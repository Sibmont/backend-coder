import { Router } from "express";

// New restructuring imports
import {
  addToCart,
  deleteCartProds,
  deleteProdFromCart,
  getCartProducts,
  getCarts,
  saveCart,
  updateCart,
  updateProdQuant,
} from "../controllers/carts.controller.js";

const router = Router();

// Retrieve carts
router.get("/", getCarts);

// Create cart
router.post("/", saveCart);

// Get cart products by id
router.get("/:cid", getCartProducts);

// Add products to cart
router.post("/:cid/products/:pid", addToCart);

// Delete product from cart
router.delete("/:cid/products/:pid", deleteProdFromCart);

// Update cart
router.put("/:cid", updateCart);

// Update cart products' quantity
router.put("/:cid/products/:pid", updateProdQuant);

// Delete cart products
router.delete("/:cid", deleteCartProds);

export default router;
