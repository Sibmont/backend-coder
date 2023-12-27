import {
  deleteProduct as deleteProductService,
  getProductById as getProductByIdService,
  getProducts as getProductsService,
  saveProduct as saveProductService,
  updateProduct as updateProductService,
} from "../services/products.service.js";
// File system imports
import path from "node:path";
import productsModel from "../dao/managers/dbManagers/models/products.model.js";
import dbProductManager from "../dao/managers/dbManagers/products.manager.js";
import ProductManager from "../dao/managers/fileManagers/ProductManager.js";
import { __dirname } from "../utils.js";

// File System setup
const filesPath = path.join(__dirname, "../files/Products.json");
const manager = new ProductManager(filesPath);
const dbManager = new dbProductManager();

const getProducts = async (req, res) => {
  try {
    // ------File System Logic------
    // const result = await manager.getProducts();
    // const products = result.products;

    // const limit = Number(req.query.limit);

    // if (!limit || products.length <= limit) {
    //   return handleResponse(res, result);
    // }

    // if (products.length > limit) {
    //   const limitedProducts = products.slice(0, limit);
    //   return handleResponse(res, {
    //     status: "Success",
    //     products: limitedProducts,
    //   });
    // }

    // -----Mongo Setup------
    const { limit = 10, page = 1, sort, query, queryValue } = req.query;

    // const search = !query
    //   ? {}
    //   : query === "category"
    //   ? { category: queryValue }
    //   : query === "stock"
    //   ? { stock: queryValue ? { $gte: queryValue } : { $gte: 1 } }
    //   : {};

    // const sortQuery = sort ? { price: Number(sort) } : {};

    const result = await getProductsService(
      sort,
      query,
      queryValue,
      limit,
      page
    );

    return handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, { status: 500 });
  }
};

const getProductById = async (req, res) => {
  try {
    // ------File System Logic------
    // const pid = Number(req.params.pid);
    // const result = await manager.getProductById(pid);
    // handleResponse(res, result);

    // -----Mongo Setup------
    const pid = req.params.pid;
    const result = await getProductByIdService(pid);
    handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, error);
  }
};

const saveProduct = async (req, res) => {
  try {
    // ------File System Logic------
    // const product = req.body;
    // const result = await manager.addProduct(product);
    // const io = req.app.get("socketio");
    // const products = (await manager.getProducts()).products;
    // io.emit("showProducts", products);
    // handleResponse(res, result);

    // -----Mongo Setup------
    const product = req.body;
    if (!product.title) throw new MissingParametersError("Title");
    if (!product.description) throw new MissingParametersError("Description");
    if (!product.price) throw new MissingParametersError("Price");
    if (!product.category) throw new MissingParametersError("Category");
    if (!product.code) throw new MissingParametersError("Code");
    if (!product.stock) throw new MissingParametersError("Stock");

    product.stock > 0 ? (product.status = true) : (product.status = false);

    const result = await saveProductService(product);
    handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, error);
  }
};

const updateProduct = async (req, res) => {
  try {
    // ------File System Logic------
    // const pid = Number(req.params.pid);
    // const update = req.body;
    // const result = await manager.updateProduct(pid, update);
    // handleResponse(res, result);

    // -----Mongo Setup------
    const pid = req.params.pid;
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

    const result = await updateProductService(pid, update);

    handleResponse(res, result);
  } catch (error) {
    return handleResponse(res, error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    // ------File System Logic------
    // const pid = Number(req.params.pid);
    // const result = await manager.deleteProduct(pid);
    // const io = req.app.get("socketio");
    // const products = (await manager.getProducts()).products;
    // io.emit("showProducts", products);
    // handleResponse(res, result);

    // -----Mongo Setup------
    const pid = req.params.pid;

    const result = await deleteProductService(pid);
    handleResponse(res, result);
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

  if (result.code === 11000) {
    return res.status(400).send({ status: "Error", error: "Duplicate Code" });
  }

  if (result.name === "CastError") {
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
  deleteProduct,
  getProductById,
  getProducts,
  saveProduct,
  updateProduct,
};
