import type { Request, Response } from "express";
const getAllProductsStatic = async (_req: Request, res: Response) => {
  // throw new Error("Testing async error handling");
  res.status(200).json({ msg: "getAllProductsStatic" });
};
const getAllProducts = async (_req: Request, res: Response) => {
  res.status(200).json({ msg: "getAllProducts" });
};
export { getAllProductsStatic, getAllProducts };
