import 'express';

declare global {
  namespace Express {
    export interface Request {
      renderMode: 'SSR' | 'ISR' | 'SPA';
      revalidate?: number | null;
    }
  }
}


export {}