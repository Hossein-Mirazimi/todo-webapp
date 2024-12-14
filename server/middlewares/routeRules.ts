import { NextFunction } from "express";
import { routeRuleManager } from "../utils/routeMetaManager";

export function routeRuleMiddleware(req: Request, res: Response, next: NextFunction) {
    const { renderMode = 'SSR', revalidate = null } = routeRuleManager.getRouteRule(req.url) ?? {};

    req.renderMode = renderMode;
    req.revalidate = revalidate;

    next();
}