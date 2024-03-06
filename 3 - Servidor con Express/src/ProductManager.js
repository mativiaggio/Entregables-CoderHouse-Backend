const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.readFileProducts();
    this.productIdCounter = this.calculateProductIdCounter();
  }

  readFileProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      return JSON.parse(data) || [];
    } catch (error) {
      console.error("Error reading file:", error.message);
      return [];
    }
  }

  calculateProductIdCounter() {
    return Math.max(...this.products.map((product) => product.id), 0) + 1;
  }

  saveProductsToFile() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.path, data, "utf8");
    } catch (error) {
      console.error("Error saving file:", error.message);
    }
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    let missingParams = [];

    if (!title) {
      missingParams.push("title");
    }
    if (!description) {
      missingParams.push("description");
    }
    if (!price) {
      missingParams.push("price");
    }
    if (!thumbnail) {
      missingParams.push("thumbnail");
    }
    if (!code) {
      missingParams.push("code");
    }
    if (!stock) {
      missingParams.push("stock");
    }

    if (missingParams.length > 0) {
      console.error(
        `Faltan los siguientes campos obligatorios: ${missingParams.join(", ")}`
      );
      return;
    }

    const product = {
      id: this.productIdCounter++,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };

    if (
      this.products.some(
        (existingProduct) => existingProduct.code === product.code
      )
    ) {
      console.error("Ya existe un producto con este código");
      return;
    }

    this.products.push(product);
    console.log(
      `Producto agregado: ${product.title} - ${product.code}${product.id}`
    );
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const product = this.products.find((p) => p.id === productId);

    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado");
      return null;
    }
  }

  updateProduct(productId, title, description, price, thumbnail, code, stock) {
    const index = this.products.findIndex((p) => p.id === productId);

    if (index !== -1) {
      const updatedProduct = {};

      updatedProduct.id = productId;
      updatedProduct.title = title;
      updatedProduct.description = description;
      updatedProduct.price = price;
      updatedProduct.thumbnail = thumbnail;
      updatedProduct.code = code;
      updatedProduct.stock = stock;

      this.products[index] = updatedProduct;

      this.saveProductsToFile();

      console.log(
        `Producto actualizado: ${updatedProduct.title} - ${updatedProduct.code}${updatedProduct.id}`
      );
    } else {
      console.error("Producto no encontrado");
    }
  }

  deleteProduct(productId) {
    const index = this.products.findIndex((p) => p.id === productId);

    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0];

      // Guardar en archivo después de eliminar el producto
      this.saveProductsToFile();

      console.log(
        `Producto eliminado: ${deletedProduct.title} - ${deletedProduct.code}${deletedProduct.id}`
      );
    } else {
      console.error("Producto no encontrado");
    }
  }
}

module.exports = ProductManager;
