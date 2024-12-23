import { Request, Response } from "express";
import { IS_PROD } from "../config/env";
import { logger } from "../utils/logger";
interface ErrorHandlerOptions {
    logErrors?: boolean;
}
export function errorHandlerMiddleware(options: ErrorHandlerOptions = {}) {
    const { logErrors = true } = options;
  
    return (err: any, _: Request, res: Response) => {
      if (logErrors) {
        logger.error(`[${new Date().toISOString()}] Error:`, err.stack || err.message || err);
      }
  
      const statusCode = +err.status || 500;
  
      const errorResponse = {
        success: false,
        message: IS_PROD ? err.message : 'Internal Server Error',
        ...(IS_PROD && { stack: err.stack }),
      };

      res.status(statusCode).json(errorResponse);
    };
  }