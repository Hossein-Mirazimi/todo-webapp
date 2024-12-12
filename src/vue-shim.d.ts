import 'vue-router'

type RenderMode = 'SPA' | 'SSR' | 'ISR' | 'SSG';

declare module 'vue-router' {
    interface RouteMeta {
        renderMode?: RenderMode;
        revalidate?: number;
    }
}

export {}