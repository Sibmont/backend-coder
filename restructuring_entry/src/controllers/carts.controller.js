import {
  addToCart as addToCartService,
  deleteCartProds as deleteCartProdsService,
  deleteProdFromCart as deleteProdService,
  getCartProducts as getCartProductsService,
  getCarts as getCartsService,
  saveCart as saveCartService,
  updateCart as updateCartService,
  updateProdQuant as updateProdQuantService,
} from "../services/carts.service.js";

// File system imports
import path from "node:path";
import dbCartManager from "../dao/managers/dbManagers/carts.manager.js";
import CartManager from "../dao/managers/fileManagers/CartManager.js";
import { __dirname } from "../utils.js";

// File system setup
const filesPath = path.join(__dirname, "../files/Carts.json");
const manager = new CartManager(filesPath);
const dbManager = new dbCartManager();

const getCarts = async (req, res) => {
  try {
    // ------File System Logic------
    // const result = await manager.getCarts();
    // const carts = result.carts;
    // const resultStatus = result.status;

    // res.status(resultStatus === "Success" ? 200 : 404).send(result);

    // -----Mongo Setup------
    const result = await getCartsService();

    return handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, error);
  }
};

const saveCart = async (req, res) => {
  try {
    // ------File System Logic------
    // const result = await manager.createCart();
    // const resultStatus = result.status;

    // res.status(resultStatus === "Success" ? 200 : 400).send(result);

    // -----Mongo Setup------
    const cart = {
      products: [],
    };
    const result = await saveCartService(cart);

    return handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, error);
  }
};

const getCartProducts = async (req, res) => {
  try {
    // ------File System Logic------
    // const cid = Number(req.params.cid);
    // const result = await manager.getCartProducts(cid);
    // const resultStatus = result.status;

    // res.status(resultStatus === "Success" ? 200 : 404).send(result);

    // -----Mongo Setup------
    const cid = req.params.cid;

    const result = await getCartProductsService(cid);

    return handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, error);
  }
};

const addToCart = async (req, res) => {
  try {
    // ------File System Logic------
    // const cid = Number(req.params.cid);
    // const pid = Number(req.params.pid);

    // const result = await manager.addProductToCart(cid, pid);
    // const resultStatus = result.status;

    // res.status(resultStatus === "Success" ? 200 : 400).send(result);

    // -----Mongo Setup------
    const cid = req.params.cid;
    const pid = req.params.pid;

    const result = await addToCartService(cid, pid);

    return handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, error);
  }
};

const deleteProdFromCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const result = await deleteProdService(cid, pid);

    return handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, error);
  }
};

const updateCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const update = req.body;

    const isObjectEmpty = (object) => {
      return (
        object &&
        Object.keys(object).length === 0 &&
        object.constructor === Object
      );
    };

    if (isObjectEmpty(update)) {
      throw new MissingParametersError("Missing desired updates for product");
    }

    const result = await updateCartService(cid, update);
    return handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, error);
  }
};

const updateProdQuant = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    if (!quantity) throw new MissingParametersError("quantity");

    const result = await updateProdQuantService(cid, pid, quantity);
    return handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, error);
  }
};

const deleteCartProds = async (req, res) => {
  try {
    const cid = req.params.cid;

    const result = await deleteCartProdsService(cid);

    return handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, error);
  }
};

// Error handling
class MissingParametersError extends Error {
  constructor(paramName) {
    super(`Missing required parameter: ${paramName}`);
    this.name = "MissingParametersError";
    this.paramName;
  }
}

function handleResponse(res, result) {
  const status =
    result.status === "Success"
      ? 200
      : result.message === "Product not found"
      ? 404
      : 400;

  if (result.name === "CastError" && result.path === "_id") {
    return res.status(404).send({ status: "Error", error: "Cart not found" });
  }

  if (result.name === "CastError" && result.path === "product") {
    return res
      .status(404)
      .send({ status: "Error", error: "Product not found" });
  }

  if (result.status === 500) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }

  return res.status(status).send(result);
}

export {
  addToCart,
  deleteCartProds,
  deleteProdFromCart,
  getCartProducts,
  getCarts,
  saveCart,
  updateCart,
  updateProdQuant,
};
