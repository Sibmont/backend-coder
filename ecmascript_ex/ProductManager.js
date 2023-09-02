class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Missing required parameter/s");
      return;
    }

    const existingCode = this.products.find((product) => product.code === code);

    if (existingCode) {
      console.log(
        `Code for item with title "${product.title}" already exists in database`
      );
      return;
    }

    this.products.length === 0
      ? (product.id = 1)
      : (product.id = this.products[this.products.length - 1].id + 1);

    this.products.push(product);
  }

  getProducts() {
    console.log(this.products);
  }

  getProductById(id) {
    const productWithId = this.products.find((product) => product.id === id);
    if (productWithId) {
      console.log(productWithId);
    } else {
      console.error("Not found");
      return;
    }
  }
}

const manager = new ProductManager();

manager.getProducts();

manager.addProduct(
  "Game 1",
  "Newest game in the store",
  60,
  "img1",
  "ITEM-001",
  20
);
manager.addProduct(
  "Game 2",
  "Oldest game in the store",
  15,
  "img2",
  "ITEM-002",
  15
);

manager.getProducts();
manager.getProductById(2);
