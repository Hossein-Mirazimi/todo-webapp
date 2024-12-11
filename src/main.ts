import { createSSRApp } from "vue";
import { createHead } from "@vueuse/head";
import { createRouter, createWebHistory, createMemoryHistory } from "vue-router";
import App from "./App.vue";
import routes from '~pages';


export function createApp() {
    const app = createSSRApp(App);
    const router = createRouter({
        routes,
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory()
    })
    
    const head = createHead({
        htmlAttrs: {
            lang: 'en',
        },
        title: 'Vite + Vue + TS'
    });
    app.use(router);
    app.use(head);

    return {
        app,
        head,
        router
    }
}