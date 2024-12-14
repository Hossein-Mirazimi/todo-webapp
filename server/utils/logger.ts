export const logger = {
    info: (message: string, data?: any) => console.info(`[INFO]: ${message}`, data),
    error: (message: string, data?: any) => console.error(`[ERROR]: ${message}`, data),
    log: (message: string, data?: any) => console.log(`[LOG]: ${message}`, data),
  };