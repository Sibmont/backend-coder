const { ProductManager } = require("./managers/ProductManager");

const manager = new ProductManager("./files/Products.json");

const env = async () => {
  // Recibir los productos una primera vez
  const products = await manager.getProducts();
  console.log(products);

  // Crear productos para agregar
  const product1 = {
    title: "Product 1",
    description: "First Product",
    price: 35,
    thumbnail: "img1.jpg",
    code: "P-001",
    stock: 12,
  };
  const product2 = {
    title: "Product 2",
    description: "Second Product",
    price: 22,
    thumbnail: "img2.jpg",
    code: "P-002",
    stock: 19,
  };
  const product3 = {
    title: "Product 3",
    description: "Third Product",
    price: 55,
    thumbnail: "img3.jpg",
    code: "P-003",
    stock: 4,
  };

  // Agregar los productos nuevos
  await manager.addProduct(product1);
  await manager.addProduct(product2);

  // Traer un producto con ID especifico
  await manager.getProductById(2);

  // Eliminar un producto
  await manager.deleteProduct(1);

  // Actualizar un producto
  // Pasar el ID del producto a actualizar y luego pasar { title: "Product 1", description: "Descripcion" ...} para editar campos específicos.
  await manager.updateProduct(1, { title: "Product 3", stock: 55 });
  // Pasar el ID del producto a actualizar, y luego pasar o un producto entero nuevo (para editar todo el producto)
  await manager.updateProduct(2, product3);

  // Imprimir productos de nuevo
  const productsResult = await manager.getProducts();
  console.log(productsResult);
};

env();
