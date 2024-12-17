import express from 'express';
import type { ViteDevServer } from 'vite';
import { IS_PROD, PORT } from './config/env';
import { renderRouter } from './handlers/renderRouter';
import { leadHtmlTemplate, loadSSRManifest } from './utils/template';
import { appMiddlewares, errorHandlerMiddleware, routeRuleMiddleware } from './middlewares/index';
import { logger } from './utils/logger';

const app = express();

Promise.all([leadHtmlTemplate(), loadSSRManifest(), appMiddlewares(app)])
  .then(([htmlTemplate, ssrManifest, _vite]) => {
    let vite: ViteDevServer | undefined = _vite ?? undefined;

    // @ts-ignore
    app.use(routeRuleMiddleware);
    // @ts-ignore
    app.use(renderRouter({ vite, htmlTemplate, ssrManifest }));
    app.use(errorHandlerMiddleware());

    app.listen(PORT, () => {
      const environment = IS_PROD ? 'Production' : 'Development';
      logger.log(`[${environment}] Server started at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to initialize the server:', err);
    process.exit(1);
  });
