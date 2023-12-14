import Carts from "../dao/managers/dbManagers/carts.manager.js";

const cartsManager = new Carts();

const getCarts = async () => {
  const carts = await cartsManager.getAll();
  return carts;
};

const saveCart = async (cart) => {
  return await cartsManager.create(cart);
};

const getCartProducts = async (cid) => {
  return await cartsManager.getById(cid);
};

const addToCart = async (cid, pid) => {
  return await cartsManager.addToCart(cid, pid);
};

const deleteProdFromCart = async (cid, pid) => {
  return await cartsManager.deleteProd(cid, pid);
};

const updateCart = async (cid, update) => {
  return await cartsManager.updateCart(cid, update);
};

const updateProdQuant = async (cid, pid, quantity) => {
  return await cartsManager.updateProdQuant(cid, pid, quantity);
};

const deleteCartProds = async (cid) => {
  return await cartsManager.deleteCartProds(cid);
};

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
