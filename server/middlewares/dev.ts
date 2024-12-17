import { Express } from 'express';
import { BASE } from '../config/env';
import { absoluteFromRoot } from '../utils/path';
export async function devMiddlewares (app: Express) {
    const { createServer } = await import('vite');
    const vite = await createServer({
        root: absoluteFromRoot('website'),
        server: { middlewareMode: true },
        appType: 'custom',
        base: BASE,
    });
    app.use(vite.middlewares);
    return vite;
}