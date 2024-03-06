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

  addProduct(product) {
    let missingParams = [];

    if (!product.title) {
      missingParams.push("title");
    }
    if (!product.description) {
      missingParams.push("description");
    }
    if (!product.category) {
      missingParams.push("category");
    }
    if (!product.status) {
      missingParams.push("status");
    }
    if (!product.price) {
      missingParams.push("price");
    }
    if (!product.code) {
      missingParams.push("code");
    }
    if (!product.stock) {
      missingParams.push("stock");
    }

    if (missingParams.length > 0) {
      console.error(
        `Faltan los siguientes campos obligatorios: ${missingParams.join(", ")}`
      );
      return {
        error: `Faltan los siguientes campos obligatorios: ${missingParams.join(
          ", "
        )}`,
      };
    }

    product = { id: this.productIdCounter++, ...product };

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

    this.saveProductsToFile();

    return { status: "Producto agregado correctamente" };
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

  // updateProduct(productId, updatedProduct) {
  //   const index = this.products.findIndex((p) => p.id === productId);

  //   if (index !== -1) {
  //     this.products[index] = { ...this.products[index], ...updatedProduct };

  //     this.saveProductsToFile();

  //     console.log(`Producto actualizado`);
  //   } else {
  //     console.error("Producto no encontrado");
  //   }
  // }

  updateProduct(productId, updatedProduct) {
    const index = this.products.findIndex((p) => p.id === productId);

    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...updatedProduct,
        id: this.products[index].id,
      };

      this.saveProductsToFile();

      console.log(`Producto actualizado`);
      return { status: "Producto actualizado correctamente" };
    } else {
      console.error("Producto no encontrado");
      return { error: "Producto no encontrado" };
    }
  }

  deleteProduct(productId) {
    const index = this.products.findIndex((p) => p.id === productId);

    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0];

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
