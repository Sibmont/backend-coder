import { Router } from "express";
import path from "node:path";
import ProductManager from "../../managers/ProductManager.js";
import __dirname from "../utils.js";

const router = Router();

const filesPath = path.join(__dirname, "../files/Products.json");
const manager = new ProductManager(filesPath);

// Retrieve all products or a limited set of products
router.get("/", async (req, res) => {
  try {
    const result = await manager.getProducts();
    const products = result.products;
    const resultStatus = result.status;

    const limit = Number(req.query.limit);

    if (!limit || products.length <= limit) {
      return res.status(resultStatus === "Success" ? 200 : 404).send(result);
    }

    if (products.length > limit) {
      const limitedProducts = products.slice(0, limit);
      return res
        .status(resultStatus === "Success" ? 200 : 404)
        .send({ status: "Success", products: limitedProducts });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

// Retrieve 1 specific product by its id
router.get("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const result = await manager.getProductById(pid);
    const resultStatus = result.status;

    return res.status(resultStatus === "Success" ? 200 : 404).send(result);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const result = await manager.addProduct(product);
    const resultStatus = result.status;

    return res.status(resultStatus === "Success" ? 200 : 400).send(result);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

// Update a product, can pass an entire new product or just update some fields by passing those attributes in the req.body
router.put("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const update = req.body;
    const result = await manager.updateProduct(pid, update);
    const resultStatus = result.status;

    res
      .status(
        resultStatus === "Success"
          ? 200
          : result.message === "Product not found"
          ? 404
          : 400
      )
      .send(result);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

// Delete a product
router.delete("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const result = await manager.deleteProduct(pid);
    const resultStatus = result.status;

    res
      .status(
        resultStatus === "Success"
          ? 200
          : result.message === "Product not found"
          ? 404
          : 400
      )
      .send(result);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

export default router;
