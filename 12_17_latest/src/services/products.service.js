// import Products from "../dao/managers/dbManagers/products.manager.js";
import dataSources from "../dao/managers/factory.js";
import ProductsRepo from "../repositories/products.repo.js";

const ProductsDao = new dataSources.products();
const productsRepo = new ProductsRepo(ProductsDao);

// const productsManager = new Products();

const getProducts = async (sort, query, queryValue, limit, page) => {
  const products = await productsRepo.getProducts(
    sort,
    query,
    queryValue,
    limit,
    page
  );

  return products;
};

const getProductById = async (pid) => {
  const product = await productsRepo.getProductById(pid);

  return product;
};

const saveProduct = async (product) => {
  return await productsRepo.createProduct(product);
};

const updateProduct = async (pid, update) => {
  return await productsRepo.updateProduct(pid, update);
};

const deleteProduct = async (pid) => {
  return await productsRepo.deleteProduct(pid);
};

export {
  deleteProduct,
  getProductById,
  getProducts,
  saveProduct,
  updateProduct,
};
