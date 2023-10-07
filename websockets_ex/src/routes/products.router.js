import { Router } from "express";
import path from "node:path";
import ProductManager from "../../managers/ProductManager.js";
import __dirname from "../utils.js";

const router = Router();

const filesPath = path.join(__dirname, "../files/Products.json");
const manager = new ProductManager(filesPath);

function handleResponse(res, result) {
  const status =
    result.status === "Success"
      ? 200
      : result.message === "Product not found"
      ? 404
      : 400;

  if (result.status === 500) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }

  return res.status(status).send(result);
}

// Retrieve all products or a limited set of products
router.get("/", async (req, res) => {
  try {
    const result = await manager.getProducts();
    const products = result.products;

    const limit = Number(req.query.limit);

    if (!limit || products.length <= limit) {
      return handleResponse(res, result);
    }

    if (products.length > limit) {
      const limitedProducts = products.slice(0, limit);
      return handleResponse(res, {
        status: "Success",
        products: limitedProducts,
      });
    }
  } catch (error) {
    return handleResponse(res, { status: 500 });
  }
});

// Retrieve 1 specific product by its id
router.get("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const result = await manager.getProductById(pid);

    handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, { status: 500 });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const result = await manager.addProduct(product);

    const io = req.app.get("socketio");
    const products = (await manager.getProducts()).products;
    io.emit("showProducts", products);

    // return res.status(resultStatus === "Success" ? 200 : 400).send(result);
    handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, { status: 500 });
  }
});

// Update a product, can pass an entire new product or just update some fields by passing those attributes in the req.body
router.put("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const update = req.body;
    const result = await manager.updateProduct(pid, update);

    handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, { status: 500 });
  }
});

// Delete a product
router.delete("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const result = await manager.deleteProduct(pid);

    const io = req.app.get("socketio");
    const products = (await manager.getProducts()).products;
    io.emit("showProducts", products);

    handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, { status: 500 });
  }
});

export default router;
