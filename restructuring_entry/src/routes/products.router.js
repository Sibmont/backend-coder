import { Router } from "express";

// New restructuring imports
import {
  deleteProduct,
  getProductById,
  getProducts,
  saveProduct,
  updateProduct,
} from "../controllers/products.controller.js";

const router = Router();

// Retrieve all products or a limited set of products
router.get("/", getProducts);

// Retrieve 1 specific product by its id
router.get("/:pid", getProductById);

// Add a new product
router.post("/", saveProduct);

// Update a product, can pass an entire new product or just update some fields by passing those attributes in the req.body
router.put("/:pid", updateProduct);

// Delete a product
router.delete("/:pid", deleteProduct);

export default router;
