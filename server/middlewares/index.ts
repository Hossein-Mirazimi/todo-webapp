import type { Express } from "express";
import { IS_PROD } from "../config/env";

export const appMiddlewares = async (app: Express) => (IS_PROD
    ? ((await import('./prod')).prodMiddleWares(app))
    : (await import('./dev')).devMiddlewares(app));

export { errorHandlerMiddleware } from './errorHandler';
export { routeRuleMiddleware } from './routeRules';