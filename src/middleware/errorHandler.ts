import type { Request, Response, NextFunction } from "express";

export const errorHandler = async (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);
  return res
    .status(500)
    .json({ msg: "Something went wrong, please try again" });
};
