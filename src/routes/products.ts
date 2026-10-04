import express from "express";
import { getAllProductsStatic, getAllProducts } from "../controllers/products";

const router = express.Router();

router.route("/static").get(getAllProductsStatic);
router.route("/").get(getAllProducts);

export { router };
