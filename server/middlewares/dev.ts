import { Express } from 'express';
import { BASE } from '../config/env';
export async function devMiddlewares (app: Express) {
    const { createServer } = await import('vite');
    const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base: BASE,
    });
    app.use(vite.middlewares);
    return vite;
}