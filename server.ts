import fs from 'fs';
import fsPromise from 'fs/promises';
import path from 'node:path';
import express from 'express';
import { fileURLToPath } from 'url';
import { ViteDevServer } from 'vite';
import { renderToString } from '@vue/server-renderer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5173;
const BASE = process.env.BASE || '/';

const htmlTemplatePath = IS_PROD ? './dist/client/index.html' : 'index.html'
const isrFolderPath = path.resolve(__dirname, './dist/.isr')

const htmlTemplate = await fsPromise.readFile(htmlTemplatePath, 'utf-8')

const cacheLocks = Object.create(null) as Record<string, Promise<void> | undefined>

type EntryServerExportType = typeof import('./src/entry-server.ts');

const app = express();
let vite: ViteDevServer | undefined;

await fsPromise.mkdir(isrFolderPath, { recursive: true })

if (IS_PROD) {
  // Production middlewares
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
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

app.use('*', async (req, res) => {
  const url = req.originalUrl.replace(BASE, '');
  const cacheRouteName = `${req.originalUrl.replaceAll('/', '_')}.html`;
  const cachePath = path.resolve(isrFolderPath, cacheRouteName);
  try {
    const hasCache = fs.existsSync(cachePath);
    if (hasCache) {
      const cacheHtml = await fsPromise.readFile(cachePath, 'utf-8');
      res.status(200).set({ 'Content-Type': 'text/html' }).end(cacheHtml);;
      return;
    }
    if (!!cacheLocks[cacheRouteName]) {
      await cacheLocks[cacheRouteName]
      return;
    }
    cacheLocks[cacheRouteName] = (async () => {
      try {
        const template = IS_PROD
          ? htmlTemplate
          : await vite!.transformIndexHtml(url, htmlTemplate);

        const { render } = IS_PROD
          ? <EntryServerExportType>(await import('./dist/server/entry-server'))
          : <EntryServerExportType>(await vite!.ssrLoadModule('./src/entry-server.ts'));

        const { app, html } = await render(url);

        const ctx = {};
        const appHtml = await renderToString(app, ctx);

        const parseHtml = template
          .replace('<html>', () => `<html${html.htmlAttrs} ssr>`)
          .replace('<!--app-head-->', html.headTags)
          .replace('<body>', () => `<body${html.bodyAttrs}>`)
          .replace('<!--app-html-->', appHtml)
          .replace('<!--app-body-tags-->', html.bodyTags);

        await fsPromise.writeFile(path.resolve(isrFolderPath, cacheRouteName), parseHtml)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(parseHtml);
      } catch (error) {
        console.error(error.stack);
        res.status(500).end('Internal Server Error');
      } finally {
        cacheLocks[cacheRouteName] = undefined
      }
    })();
    await cacheLocks[cacheRouteName];

  } catch (error) {
    vite?.ssrFixStacktrace(error);
    console.error(error.stack);
    res.status(500).end('Internal Server Error');
  }
});

app.listen(PORT, () => {
  const environment = IS_PROD ? 'Production' : 'Development';
  console.log(`[${environment}] Server started at http://localhost:${PORT}`);
});
