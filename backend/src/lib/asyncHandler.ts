import { Request, Response, NextFunction } from "express";

// Wraps route handlers so unhandled promise rejections reach errorHandler middleware.
// Express 4 does not catch async errors automatically.
export function asyncHandler(fn: (req: any, res: Response) => void | Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res)).catch(next);
}
