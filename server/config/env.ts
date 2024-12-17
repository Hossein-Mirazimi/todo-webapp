import { absoluteFromRoot } from './../utils/path';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const BASE = process.env.BASE || '/';
export const PORT = process.env.PORT || 5173;

export const HTML_TEMPLATE_PATH = IS_PROD ? absoluteFromRoot('website/dist/client/index.html') : absoluteFromRoot('website/index.html') // '../../../../website/dist/client/index.html' : '../../../../website/index.html';
export const SSR_MANIFEST_PATH = absoluteFromRoot('website/dist/client/.vite/ssr-manifest.json');
export const ENTRY_SERVER = IS_PROD ?  absoluteFromRoot('website/dist/server/entry-server.mjs') : absoluteFromRoot('website/src/entry-server')