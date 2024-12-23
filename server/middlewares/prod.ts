import { Express } from 'express';
import { BASE } from '../config/env';
import { absoluteFromRoot } from '../utils/path';


export async function prodMiddleWares (app: Express) {
    const compression = (await import('compression')).default;
    const sirv = (await import('sirv')).default;
    const helmet = (await import('helmet')).default;
    app.use(helmet({
        contentSecurityPolicy: false
    }));
    app.use(compression());
    app.use((req, res, next) => {
        if (req.url.endsWith('.html')) {
        // Cache HTML for a short time (1 hour)
        res.setHeader('Cache-Control', 'public, max-age=3600');
        } else if (req.url.match(/\.(js|css|png|jpg|svg|woff2?)$/)) {
        // Cache static assets for 1 year
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
        next();
    });
    app.use(BASE, sirv(absoluteFromRoot('website/dist/client'), {}));
}