import { RouteRules } from "./server/utils/routeMetaManager";

export default {
    '/': {renderMode: 'SSR'},
    '/spa': {renderMode: 'SPA'},
    '/isr': {renderMode: 'ISR', revalidate: 60},
} satisfies RouteRules;