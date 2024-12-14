export const IS_PROD = process.env.NODE_ENV === 'production';
export const BASE = process.env.BASE || '/';
export const PORT = process.env.PORT || 5173;

export const HTML_TEMPLATE_PATH = IS_PROD ? './dist/client/index.html' : 'index.html';
export const SSR_MANIFEST_PATH = '../dist/client/.vite/ssr-manifest.json';
