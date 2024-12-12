import { renderHeadToString } from "@vueuse/head";
import { createApp } from './main'

export async function render(_url: string) {
    const { app, head, router } = createApp();

    // set the router to the desired URL before rendering
    router.push(_url);
    await router.isReady();
    
    const { headTags, htmlAttrs, bodyAttrs, bodyTags } = await renderHeadToString(head)
    
    const html = {
        headTags,
        htmlAttrs,
        bodyAttrs,
        bodyTags,
    }
    return { app, html, router }
}