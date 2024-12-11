import { renderToString } from "@vue/server-renderer";
import { createApp } from './main'
import { renderHeadToString } from "@vueuse/head";

export async function render(_url: string) {
    const { app, head } = createApp();

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
    return { html }
}