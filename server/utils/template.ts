import fs from 'fs/promises';
import { IS_PROD } from '../config/env'
import { HTML_TEMPLATE_PATH, SSR_MANIFEST_PATH } from '../config/constants'

export async function leadHtmlTemplate () {
    const path = HTML_TEMPLATE_PATH
    return await fs.readFile(path, 'utf-8')
}
  
export async function loadSSRManifest () {
    return IS_PROD ? (await import(SSR_MANIFEST_PATH, { assert: { type: 'json' } })) : {}
}