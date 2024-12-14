import { NextFunction } from "express";
import { routeRuleManager } from "../utils/routeMetaManager";

export function routeRuleMiddleware(req: Request, _: Response, next: NextFunction) {
    const { renderMode = 'SSR', revalidate = null } = routeRuleManager.getRouteRule(req.url) ?? {};
    // @ts-ignore
    req.renderMode = renderMode;
    // @ts-ignore
    req.revalidate = revalidate;

    next();
}