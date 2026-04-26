import { Request, Response, NextFunction } from "express";

// Wraps async route handlers so unhandled promise rejections reach errorHandler middleware.
// Express 4 does not catch async errors automatically.
export function asyncHandler(fn: (req: any, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next);
}
