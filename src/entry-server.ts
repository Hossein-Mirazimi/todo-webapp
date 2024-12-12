import { renderToString } from "@vue/server-renderer";
import { renderHeadToString } from "@vueuse/head";
import { createApp } from './main'

export async function render(_url: string) {
    const { app, head, router } = createApp();

    // set the router to the desired URL before rendering
    router.push(_url);
    await router.isReady();

    const ctx = {};
    const appHtml = await renderToString(app, ctx);

    const { headTags, htmlAttrs, bodyAttrs, bodyTags } = await renderHeadToString(head)
    
    const html = {
        appHtml,
        headTags,
        htmlAttrs,
        bodyAttrs,
        bodyTags,
    }
    return { html, router }
}