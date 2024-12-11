import { renderToString } from "@vue/server-renderer";
import { createApp } from './main'

export async function render(_url: string) {
    const { app } = createApp();

    const ctx = {};
    const html = await renderToString(app, ctx);

    return { html }
}