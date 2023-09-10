const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf8");
        const products = JSON.parse(data);

        return products;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  };

  //  El usuario tiene que pasar un objeto con las propiedades listadas abajo
  addProduct = async (product) => {
    try {
      const products = await this.getProducts();

      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.thumbnail ||
        !product.code ||
        !product.stock
      ) {
        console.log("Missing required parameter/s");
        return;
      }

      products.length === 0
        ? (product.id = 1)
        : (product.id = products[products.length - 1].id + 1);

      products.push(product);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
    } catch (error) {
      console.error(error);
    }
  };

  getProductById = async (id) => {
    try {
      const products = await this.getProducts();

      if (products.length > 0) {
        const fetchedProduct = products.find((product) => product.id === id);
        if (fetchedProduct) {
          console.log(fetchedProduct);
        } else {
          console.log("Not found");
        }
      } else {
        console.log("Database is empty");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  updateProduct = async (id, update) => {
    try {
      const products = await this.getProducts();

      let productIndex = products.findIndex((product) => product.id === id);

      if (productIndex > -1) {
        const productToUpdate = products[productIndex];

        if (update.id) {
          if (update.id !== productToUpdate.id) {
            console.log("Cannot update product's Id");
            return;
          }
        }

        products[productIndex] = { ...productToUpdate, ...update };

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );
        console.log("Product updated succesfully");
        return productToUpdate;
      } else {
        console.log("Product not found");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  deleteProduct = async (id) => {
    try {
      const products = await this.getProducts();
      const productToDelete = products.find((product) => product.id === id);
      const productIndex = products.indexOf(productToDelete);

      if (productIndex > -1) {
        products.splice(productIndex, 1);
        if (products.length === 1) {
          products[0].id = 1;
        }
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );
        console.log("Product deleted");
      } else {
        console.log("Product not found");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };
}

module.exports = { ProductManager };
