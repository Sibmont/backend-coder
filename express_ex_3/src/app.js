import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ProductManager from "../managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, "../files/products.json");

const manager = new ProductManager(productsFilePath);

const app = express();

app.use(express.json());

// Retrieve all products or a limited set of products
app.get("/products", async (req, res) => {
  const products = await manager.getProducts();
  const limit = Number(req.query.limit);

  if (!limit || products.length <= limit) {
    return res.send(products);
  }

  if (products.length > limit) {
    const limitedProducts = products.slice(0, limit);
    return res.send(limitedProducts);
  }
});

// Retrieve 1 specific product by its id
app.get("/products/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const product = await manager.getProductById(pid);

  if (!product) {
    return res
      .status(404)
      .send({ status: "error", error: "Product not found" });
  }

  res.send(product);
});

// Add product
app.post("/products", async (req, res) => {
  const product = req.body;

  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.thumbnail ||
    !product.code ||
    !product.stock
  ) {
    return res
      .status(400)
      .send({ status: "error", error: "Missing required fields" });
  }

  await manager.addProduct(product);

  return res.send({ status: "success", message: "Product added" });
});

app.listen(8080, () => console.log("Listening on port 8080"));
