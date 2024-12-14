import { renderToString } from "@vue/server-renderer";

export async function ssrHandler(url: string, template: string, render: Function, ssrManifest: Record<string, string[]>) {
    const { app, html, ssrContext } = await render(url);
    const ctx = {} as {modules: string[]}
    const appHtml = await renderToString(app, ctx);
    const preloadLinks = renderPreloadLinks(ctx.modules, ssrManifest);

    const parseHtml = template
        .replace('<html>', () => `<html${html.htmlAttrs} data-ssr="true">`)
        .replace('<!--app-head-->', html.headTags)
        .replace('<!--app-preload-->', preloadLinks)
        .replace('<body>', () => `<body${html.bodyAttrs}>`)
        .replace('<!--app-html-->', appHtml)
        .replace('<!--app-body-->', html.bodyTags)
        .replace('<!--app-ssr-->', ssrContext.toJS());
    return parseHtml;
}

function renderPreloadLinks (modules: string[] = [], manifest: Record<string, string[]>) {
    let links = '';
    const seen = new Set();
    modules.forEach(id => {
        const files = manifest[id];
        if (files) {
            files.forEach(file => {
                if (!seen.has(file)) {
                    seen.add(file);
                    links += renderPreloadLink(file);
                }
            });
        }
    });
    return links;
  }
  
  function renderPreloadLink (file: string) {
    if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}">`;
    } if (file.endsWith('.css')) {
        return `<link rel="stylesheet" crossorigin href="${file}">`;
    } if (file.endsWith('.woff2')) {
        return `<link rel="preload" href="${file}" crossorigin as="font" type="font/woff2">`;
    }
    return '';
  }