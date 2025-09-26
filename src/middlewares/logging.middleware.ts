import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  logger: Logger
  constructor(){
    this.logger = new Logger()
  }

  use(req: Request, res: Response, next: NextFunction) {
    const reqStartedAt = Date.now()
    const id = crypto.randomUUID().split('-')[0]
    this.logger.debug(`${id} :: RESTful API Request: ${req.method} ${req.originalUrl}`)

    next();
    res.on('finish', () => {
      const duration = Date.now() - reqStartedAt;
      this.logger.debug(`${id} :: RESTful API Response: ${res.statusCode} ${req.method} ${req.originalUrl} took ${(duration)}ms`)
    })
  }
}