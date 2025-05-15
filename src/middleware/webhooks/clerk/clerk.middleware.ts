import { NextFunction, Request, Response } from "express";
import { Webhook } from "svix";

export function clerkMiddleware(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawBody = req.body.toString();

      const wh = new Webhook(secret);

      wh.verify(rawBody, {
        "svix-id": req.headers["svix-id"] as string,
        "svix-timestamp": req.headers["svix-timestamp"] as string,
        "svix-signature": req.headers["svix-signature"] as string
      });

      next();
    } catch {
      res.status(401).json({
        error: "Unauthorized"
      })
    }
  }
}