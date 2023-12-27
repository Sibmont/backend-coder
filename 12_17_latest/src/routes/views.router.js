import { Router } from "express";
import path from "node:path";
import dbCartManager from "../dao/managers/dbManagers/carts.manager.js";
import dbProductManager from "../dao/managers/dbManagers/products.manager.js";
import ProductManager from "../dao/managers/fileManagers/ProductManager.js";
import { __dirname } from "../utils.js";

const router = Router();

const filesPath = path.join(__dirname, "../files/Products.json");
const manager = new ProductManager(filesPath);
const dbProdManager = new dbProductManager();
const dbCart = new dbCartManager();

const publicAccess = (req, res, next) => {
  if (req.session?.user) return res.redirect("/products");
  next();
};

const privateAccess = (req, res, next) => {
  if (!req.session?.user) return res.redirect("/login");
  next();
};

router.get("/register", publicAccess, (req, res) => {
  res.render("register");
});

router.get("/login", publicAccess, (req, res) => {
  res.render("login");
});

router.get("/", (req, res) => {
  res.render("login");
});

// -----File products view-----
// const products = await manager.getProducts();
// router.get("/", async (req, res) => {
//   try {
//     res.render("home", products);
//   } catch (error) {
//     return res
//       .status(500)
//       .send({ status: "Error", error: "Internal Server Error" });
//   }
// });

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts", products);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

router.get("/products", privateAccess, async (req, res) => {
  try {
    const result = await dbProdManager.getAll();
    const dbProducts = result.payload.products;
    console.log(req.user);

    res.render("products", { products: dbProducts, user: req.session.user });
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await dbCart.getById(cid);

    res.render("cart", { products: result.payload });
  } catch (error) {
    return res.status(500).send({ status: "Error", message: error.message });
  }
});

export default router;
