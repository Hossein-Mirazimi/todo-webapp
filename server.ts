import fs from 'fs/promises';
import express from 'express';
import { ViteDevServer } from 'vite';

const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5173;
const BASE = process.env.BASE || '/';

const htmlTemplatePath = IS_PROD ? './dist/client/index.html' : 'index.html'

const htmlTemplate = await fs.readFile(htmlTemplatePath, 'utf-8')

const app = express();
let vite: ViteDevServer | undefined;

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

app.use('*', async (req, res, next) => {
  const url = req.originalUrl.replace(BASE, '');
  try {
    const template = IS_PROD
      ? htmlTemplate
      : await vite!.transformIndexHtml(url, htmlTemplate);

    const { render } = IS_PROD
      ? await import('./dist/server/entry-server')
      : (await vite!.ssrLoadModule('./src/entry-server.ts'));

    const { html: appHtml } = await render(url);
    const html = template.replace('<!--app-html-->', appHtml);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
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
