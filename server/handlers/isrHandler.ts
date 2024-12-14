
import path from 'path'
import { fileURLToPath } from 'url';
import { IS_PROD } from "../config/env";
import { CacheManager, InMemoryCache, FileBaseCache } from "../utils/cacheManager"
import { ssrHandler } from './ssrHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cacheDir = path.resolve(__dirname, '../../.cache')

const cache = !IS_PROD ? new FileBaseCache(cacheDir) : new InMemoryCache()
const cacheManager = new CacheManager(cache);

const inProgressRequests = new Map<string, Promise<string>>();

export async function isrHandler(url: string, template: string, render: Function, revalidate: number, ssrManifest: Record<string, string[]>) {
    const cachedPage = await cacheManager.get(url);

    if (cachedPage) return cachedPage;

    if (inProgressRequests.has(url)) {
        return inProgressRequests.get(url)!;
    }

    const renderPromise = (async () => {
        try {
            const renderedPage = await ssrHandler(url, template, render, ssrManifest);
            cacheManager.set(url, renderedPage, revalidate);
            return renderedPage;
        } finally {
            inProgressRequests.delete(url);
        }
    })()

    inProgressRequests.set(url, renderPromise);    
    return renderPromise;
}
