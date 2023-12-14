import Products from "../dao/managers/dbManagers/products.manager.js";

const productsManager = new Products();

const getProducts = async (sort, query, queryValue, limit, page) => {
  const products = await productsManager.getAll(
    sort,
    query,
    queryValue,
    limit,
    page
  );

  return products;
};

const getProductById = async (pid) => {
  const product = await productsManager.getById(pid);

  return product;
};

const saveProduct = async (product) => {
  return await productsManager.create(product);
};

const updateProduct = async (pid, update) => {
  return await productsManager.update(pid, update);
};

const deleteProduct = async (pid) => {
  return await productsManager.delete(pid);
};

export {
  deleteProduct,
  getProductById,
  getProducts,
  saveProduct,
  updateProduct,
};
