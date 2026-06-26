import type { Request, Response, NextFunction } from "express";


export function errorCatcher(err: string, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(500).json({ message: "Everything is on fire." });
}
