import routeRulesData from '../../routeRules';

export interface RouteRenderMeta {
    renderMode: 'SSR' | 'ISR' | 'SPA';
    revalidate?: number;
}

export type RouteRules = Record<string, RouteRenderMeta>;
  
class RouteRuleManager {
    private routeRules: Map<string, RouteRenderMeta>;
  
    constructor(initialRouteRules: Record<string, RouteRenderMeta> = {}) {
      this.routeRules = new Map<string, RouteRenderMeta>(Object.entries(initialRouteRules));
    }
  
    getRouteRule(route: string): RouteRenderMeta | null {
      return this.routeRules.get(route) || null;
    }
  
    setRouteRule(route: string, meta: RouteRenderMeta): void {
      this.routeRules.set(route, meta);
    }
  
    removeRouteRule(route: string): void {
      this.routeRules.delete(route);
    }
  
    extendRules(newRules: Record<string, RouteRenderMeta>): void {
      for (const [route, meta] of Object.entries(newRules)) {
        this.routeRules.set(route, meta);
      }
    }
  
    getAllRules(): Record<string, RouteRenderMeta> {
      return Object.fromEntries(this.routeRules);
    }
}

const initialRouteRules = <RouteRules>routeRulesData;
export const routeRuleManager = new RouteRuleManager(initialRouteRules);
