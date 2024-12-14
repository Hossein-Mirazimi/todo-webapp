import { RouteRules } from "./server/utils/routeMetaManager";

export default {
    '/test': {renderMode: 'SPA'},
    '/isr': {renderMode: 'ISR', revalidate: 60},
} satisfies RouteRules;