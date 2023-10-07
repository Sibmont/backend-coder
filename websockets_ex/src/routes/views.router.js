import { Router } from "express";
import path from "node:path";
import ProductManager from "../../managers/ProductManager.js";
import __dirname from "../utils.js";

const router = Router();

const filesPath = path.join(__dirname, "../files/Products.json");
const manager = new ProductManager(filesPath);

const products = await manager.getProducts();
router.get("/", async (req, res) => {
  try {
    res.render("home", products);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts", products);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

export default router;
