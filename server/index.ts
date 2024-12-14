import express from 'express';
import type { ViteDevServer } from 'vite';
import { IS_PROD, PORT } from './config/env';
import { renderRouter } from './handlers/renderRouter.ts'
import { leadHtmlTemplate, loadSSRManifest } from './utils/template.ts';
import { appMiddlewares, errorHandlerMiddleware, routeRuleMiddleware } from './middlewares/index.ts';
import { logger } from './utils/logger.ts';


const htmlTemplate = await leadHtmlTemplate();

const ssrManifest = await loadSSRManifest()

const app = express();


const _vite = await appMiddlewares(app)

let vite: ViteDevServer | undefined = _vite ?? undefined;

app.use(routeRuleMiddleware);
app.use(renderRouter({ vite, htmlTemplate, ssrManifest}))
app.use(errorHandlerMiddleware(vite))


app.listen(PORT, () => {
  const environment = IS_PROD ? 'Production' : 'Development';
  logger.log(`[${environment}] Server started at http://localhost:${PORT}`);
});
