import { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "../models/errors/app-error";

export function catchErrors(handler: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch(e) {
      console.error(e);
      if (e instanceof AppError) {
        res.status(e.status).json({
          error: e.message || "Internal server error!"
        })
      } else {
        res.status(500).json({
          error: "Internal server error!"
        })
      }
    }
  }
}