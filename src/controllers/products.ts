import type { Request, Response } from "express";
import { Product } from "../models/products";
import { COMPANIES } from "../types/product";
import type { ProductFilter, Company } from "../types/product";

const getAllProductsStatic = async (_req: Request, res: Response) => {
  const search = "wooden";
  const products = await Product.find({
    name: { $regex: search, $options: "i" },
  })
    .sort("name -price")
    .select("name price")
    .limit(3)
    .skip(1);
  res
    .status(200)
    .json({ status: "success", products, nbHits: products.length });
};

const getAllProducts = async (req: Request, res: Response) => {
  const { featured, company, name, sort, select, limit, skip } = req.query;

  if (featured && featured !== "true" && featured !== "false") {
    return res.status(400).json({
      status: "fail",
      message: "featured must be either true or false",
    });
  }

  if (company && !COMPANIES.includes(company as Company)) {
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

  if (name) {
    filter.name = { $regex: name as string, $options: "i" };
  }

  let result = Product.find(filter);
  if (sort) {
    const sortList = (sort as string).split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  if (select) {
    const selectList = (select as string).split(",").join(" ");
    result = result.select(selectList);
  }

  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limitNumber = req.query.limit
    ? parseInt(req.query.limit as string, 10)
    : 10;
  const skipNumber = (page - 1) * limitNumber;

  result = result.skip(skipNumber).limit(limitNumber);

  const products = await result;
  res
    .status(200)
    .json({ status: "success", products, nbHits: products.length });
};

export { getAllProductsStatic, getAllProducts };
