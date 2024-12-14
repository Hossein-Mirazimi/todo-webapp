import fs from 'fs/promises';
import express from 'express';
import { ViteDevServer } from 'vite';
import helmet from "helmet";
import { renderToString } from '@vue/server-renderer';
import { HYDRATED_KEY } from '../src/plugins/ssr-context/index.ts';

const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5173;
const BASE = process.env.BASE || '/';

const htmlTemplatePath = IS_PROD ? './dist/client/index.html' : 'index.html'

const htmlTemplate = await fs.readFile(htmlTemplatePath, 'utf-8')
const manifest = IS_PROD ? (await import('../dist/client/.vite/ssr-manifest.json')) : {}
type EntryServerExportType = typeof import('../src/entry-server.ts');

const app = express();
let vite: ViteDevServer | undefined;

if (IS_PROD) {
  // Production middlewares
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(helmet());
  app.use(compression());
  app.use((req, res, next) => {
    if (req.url.endsWith('.html')) {
      // Cache HTML for a short time (1 hour)
      res.setHeader('Cache-Control', 'public, max-age=3600');
    } else if (req.url.match(/\.(js|css|png|jpg|svg|woff2?)$/)) {
      // Cache static assets for 1 year
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    next();
  });
  app.use(BASE, sirv('./dist/client', { extensions: [] }));
} else {
  // Development middlewares
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: BASE,
  });
  app.use(vite.middlewares);
}

app.use('*', async (req, res, next) => {
  const url = req.originalUrl.replace(BASE, '');
  try {
    const template = IS_PROD
      ? htmlTemplate
      : await vite!.transformIndexHtml(url, htmlTemplate);

    const { render } = IS_PROD // @ts-ignore
      ? <EntryServerExportType>(await import('../dist/server/entry-server.js'))
      : <EntryServerExportType>(await vite!.ssrLoadModule('./src/entry-server.ts'));

    const { app, html, router, ssrContext } = await render(url);
    const { renderMode = 'SSR'} = router.getRoutes().find(route => route.path === req.originalUrl)?.meta ?? {}
    
    const ctx = {} as { modules: string[] };
    const appHtml = renderMode === 'SSR' ? (await renderToString(app, ctx)) : '';
    const preloadLinks = ctx.modules ? renderPreloadLinks(ctx.modules, manifest) : '';

    const parseHtml = template
      .replace('<html>', () => `<html${html.htmlAttrs} data-ssr="${renderMode !== 'SPA'}">`)
      .replace('<!--app-head-->', html.headTags)
      .replace('<!--app-preload-->', preloadLinks)
      .replace('<body>', () => `<body${html.bodyAttrs}>`)
      .replace('<!--app-html-->', appHtml)
      .replace('<!--app-body-->', html.bodyTags)
      .replace('<!--app-ssr-->', ssrContext.toJS());

    res.status(200).set({ 'Content-Type': 'text/html' }).end(parseHtml);
  } catch (error) {
    vite?.ssrFixStacktrace(error);
    console.error(error.stack);
    res.status(500).end('Internal Server Error');
  }
});


function renderPreloadLinks (modules: string[], manifest: Record<string, string[]>) {
  let links = '';
  const seen = new Set();
  modules.forEach(id => {
      const files = manifest[id];
      if (files) {
          files.forEach(file => {
              if (!seen.has(file)) {
                  seen.add(file);
                  links += renderPreloadLink(file);
              }
          });
      }
  });
  return links;
}

function renderPreloadLink (file: string) {
  if (file.endsWith('.js')) {
      return `<link rel="modulepreload" crossorigin href="${file}">`;
  } if (file.endsWith('.css')) {
      return `<link rel="stylesheet" crossorigin href="${file}">`;
  } if (file.endsWith('.woff2')) {
      return `<link rel="preload" href="${file}" crossorigin as="font" type="font/woff2">`;
  }
  return '';
}

app.listen(PORT, () => {
  const environment = IS_PROD ? 'Production' : 'Development';
  console.log(`[${environment}] Server started at http://localhost:${PORT}`);
});
