import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ProductManager from "../managers/ProductManager.js";
import cartsRouter from "../src/routes/carts.router.js";
import productsRouter from "../src/routes/products.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, "../files/products.json");

const manager = new ProductManager(productsFilePath);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(8080, () => console.log("Server running on port 8080"));
