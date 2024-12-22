import { NextFunction, Request, Response } from "express";
import {isrHandler} from './isrHandler';
import {ssrHandler} from './ssrHandler';
import {spaHandler} from './spaHandler';
import { BASE, IS_PROD } from "../config/env";
import { ENTRY_SERVER_PATH } from '../config/constants';
import { ViteDevServer } from "vite";
import { logger } from "../utils/logger";

interface RenderRouterParams {
    htmlTemplate: string;
    ssrManifest: Record<string, string[]>;
    vite: ViteDevServer | undefined;
}

async function loadTemplateForRequest(url: string, htmlTemplate: string, vite?: ViteDevServer): Promise<string> {
    if (IS_PROD) {
      return htmlTemplate;
    } else {
      return vite!.transformIndexHtml(url, htmlTemplate);
    }
  }
  async function loadRenderModule(vite?: ViteDevServer): Promise<{ render: Function }> {
    if (IS_PROD) {
      return <ReturnType<typeof loadRenderModule>>(await import(ENTRY_SERVER_PATH))
    } else {
      return <ReturnType<typeof loadRenderModule>>(await vite!.ssrLoadModule(ENTRY_SERVER_PATH));
    } 
  }

export const renderRouter = ({ vite, htmlTemplate: _htmlTemplate, ssrManifest}: RenderRouterParams) => {
    return async function (req: Request, res: Response, next: NextFunction) {
        const url = req.originalUrl.replace(BASE, '');
        try {
          const { renderMode, revalidate } = req;
          logger.log(req.url, { renderMode, revalidate })
          const { render } = await loadRenderModule(vite);
          const htmlTemplate = await loadTemplateForRequest(url, _htmlTemplate, vite)
          if (renderMode === 'SSR') {
            const ssrHtml = await ssrHandler(req.url, htmlTemplate, render, ssrManifest);
            return res.status(200).send(ssrHtml);
          }
          if (renderMode === 'ISR') {
            const isrHtml = await isrHandler(req.url, htmlTemplate, render, revalidate!, ssrManifest);
            return res.status(200).send(isrHtml);
          }
          
          const spaHtml = await spaHandler(htmlTemplate);
          return res.status(200).send(spaHtml);
            
        } catch(error) {
          // @ts-ignore
          vite?.ssrFixStacktrace(error);
          next(error)
        }
    }
}