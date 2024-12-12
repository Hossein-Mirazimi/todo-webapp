import { createSSRApp, createApp as _createApp } from "vue";
import { createHead } from "@vueuse/head";
import { createRouter, createWebHistory, createMemoryHistory } from "vue-router";
import routes from '~pages';
import App from "./App.vue";


export function createApp() {
    const app = import.meta.env.SSR
        ? createSSRApp(App)
        : _createApp(App);
        
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