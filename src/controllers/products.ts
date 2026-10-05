import type { Request, Response } from "express";
import { Product } from "../models/products";
import { COMPANIES } from "../types/product";
import type { ProductFilter, Company } from "../types/product";

const getAllProductsStatic = async (_req: Request, res: Response) => {
  const products = await Product.find({}).sort("name");
  res
    .status(200)
    .json({ status: "success", products, nbHits: products.length });
};

const getAllProducts = async (req: Request, res: Response) => {
  const { featured, company } = req.query;

  if (featured && featured !== "true" && featured !== "false") {
    return res.status(400).json({
      status: "fail",
      message: "featured must be either true or false",
    });
  }

  if (company && !COMPANIES.includes(company as Company)) {
    //console.log(company);
    res.status(400).json({
      status: "fail",
      message: `company must be one of: ${COMPANIES.join(", ")}`,
    });
    return;
  }

  const filter: ProductFilter = {};

  if (featured) {
    filter.featured = featured === "true" ? true : false;
  }
  if (company) {
    filter.company = company as Company;
  }

  const products = await Product.find(filter).sort("name");
  res
    .status(200)
    .json({ status: "success", products, nbHits: products.length });
};

export { getAllProductsStatic, getAllProducts };
