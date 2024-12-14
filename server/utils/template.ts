import fs from 'fs/promises';
import { IS_PROD, HTML_TEMPLATE_PATH, SSR_MANIFEST_PATH } from '../config/env'

export async function leadHtmlTemplate () {
    const path = HTML_TEMPLATE_PATH
    return await fs.readFile(path, 'utf-8')
}
  
export async function loadSSRManifest () {
    return IS_PROD ? (await import(SSR_MANIFEST_PATH)) : {}
}