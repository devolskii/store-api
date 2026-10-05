import type { Request, Response, NextFunction } from "express";

export const errorHandler = async (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};
