import { createSSRApp, createApp as _createApp } from "vue";
import { createHead } from "@vueuse/head";
import { createRouter, createWebHistory, createMemoryHistory } from "vue-router";
import { createSSRContext } from "./plugins/ssr-context";
import routes from '~pages';
import App from "./App.vue";


export function createApp() {
    const app = createSSRApp(App)
        
    const router = createRouter({
        routes,
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory()
    });
    const head = createHead({
        htmlAttrs: {
            lang: 'en',
        },
        title: 'Vite + Vue + TS'
    });
    const ssrContext = createSSRContext();
    app.use(ssrContext);
    app.use(router);
    app.use(head);

    return {
        app,
        head,
        router,
        ssrContext
    }
}