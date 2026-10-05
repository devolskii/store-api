import type { Request, Response } from "express";
import { Product } from "../models/products";

const getAllProductsStatic = async (_req: Request, res: Response) => {
  const products = await Product.find({}).sort("name");
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req: Request, res: Response) => {
  const { featured } = req.query;

  if (featured && featured !== "true" && featured !== "false") {
    return res.status(400).json({
      status: "fail",
      message: "featured must be either true or false",
    });
  }

  const filter =
    featured === undefined ? {} : { featured: featured === "true" };

  const products = await Product.find(filter).sort("name");
  res.status(200).json({ products, nbHits: products.length });
};

export { getAllProductsStatic, getAllProducts };
