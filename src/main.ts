import { createSSRApp } from "vue";
import { createHead } from "@vueuse/head";
import App from "./App.vue";

export function createApp() {
    const app = createSSRApp(App);
    const head = createHead({
        htmlAttrs: {
            lang: 'en',
        },
        title: 'Vite + Vue + TS'
    });

    app.use(head);

    return {
        app,
        head
    }
}