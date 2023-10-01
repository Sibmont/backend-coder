import { Router } from "express";
import path from "node:path";
import CartManager from "../../managers/CartManager.js";
import __dirname from "../utils.js";

const router = Router();

const filesPath = path.join(__dirname, "../files/Carts.json");
const manager = new CartManager(filesPath);

// Retrieve carts
router.get("/", async (req, res) => {
  try {
    const result = await manager.getCarts();
    const carts = result.carts;
    const resultStatus = result.status;

    res.status(resultStatus === "Success" ? 200 : 404).send(result);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

// Create cart
router.post("/", async (req, res) => {
  try {
    const result = await manager.createCart();
    const resultStatus = result.status;

    res.status(resultStatus === "Success" ? 200 : 400).send(result);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

// Get cart products by id
router.get("/:cid", async (req, res) => {
  try {
    const cid = Number(req.params.cid);
    const result = await manager.getCartProducts(cid);
    const resultStatus = result.status;

    res.status(resultStatus === "Success" ? 200 : 404).send(result);
  } catch (error) {
    res.status(500).send({ status: "Error", error: "Internal Server Error" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);

    const result = await manager.addProductToCart(cid, pid);
    const resultStatus = result.status;

    res.status(resultStatus === "Success" ? 200 : 400).send(result);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

export default router;
