import { IS_PROD } from './env'
import { absoluteFromRoot } from '../utils/path';

export const HTML_TEMPLATE_PATH = IS_PROD ? absoluteFromRoot('website/dist/client/index.html') : absoluteFromRoot('website/index.html')
export const SSR_MANIFEST_PATH = absoluteFromRoot('website/dist/client/.vite/ssr-manifest.json');
export const ENTRY_SERVER_PATH = IS_PROD ?  absoluteFromRoot('website/dist/server/entry-server.mjs') : absoluteFromRoot('website/src/entry-server.ts')