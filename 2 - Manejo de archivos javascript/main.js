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

// Ejemplo de uso:
const productManager = new ProductManager("./products.json");

// PRODUCTO PRUEBA 1
console.log(
  "*******************************************************\nPRODUCTO 1\n*******************************************************"
);
productManager.addProduct(
  "Samsung Galaxy s23 ultra",
  "Ultimo celular samsung...",
  1900000,
  "path/s23ultra.jpg",
  "SMGS23U",
  9030
);
console.log("\n\n\n");

// PRODUCTO PRUEBA 2
console.log(
  "*******************************************************\nPRODUCTO 2\n*******************************************************"
);
productManager.addProduct(
  "Laptop Lenovo i7",
  "Laptop Lenovo procesador i7",
  1545000,
  "path/lenovoi7.jpg",
  "LAPLENi7",
  10000
);
console.log("\n\n\n");

// PRODUCTO DUPLICADO
console.log(
  "*******************************************************\nPRODUCTO DUPLICADO\n*******************************************************"
);
productManager.addProduct(
  "Samsung Galaxy s23 ultra 2",
  "Ultimo celular samsung...",
  1900000,
  "path/s23ultra.jpg",
  "SMGS23U",
  9030
);
console.log("\n\n\n");

// PRODUCTO MAL CARGADO (SE ELIMINARA)
console.log(
  "*******************************************************\nPRODUCTO MAL CARGADO\n*******************************************************"
);
productManager.addProduct("error", "error", 1, "path/error.jpg", "AAA", 1);
console.log("\n\n\n");

// PRODUCTO VACIO, TEST DE ERROR
productManager.addProduct({});

// TODOS LOS PRODUCTOS
console.log("Todos los productos:", productManager.getProducts());

// ENCUENTRO UN PRODUCTO EXISTENTE
const producto_a_encontrar = 1;
producto_encontrado = productManager.getProductById(producto_a_encontrar);
if (producto_encontrado) {
  console.log(
    `Producto encontrado: ${producto_encontrado.title} - ${producto_encontrado.code}${producto_encontrado.id}`
  );
}

// BUSCO UN PRODUCTO QUE NO EXISTE, TEST DE ERROR
const producto_no_existente_a_encontrar = 10000;
producto_encontrado = productManager.getProductById(
  producto_no_existente_a_encontrar
);
if (producto_encontrado) {
  console.log(
    `Producto encontrado: ${producto_encontrado.title} - ${producto_encontrado.code}${producto_encontrado.id}`
  );
}

// ACTUALIZO EL PRODUCTO 1
productManager.updateProduct(
  1,
  "Samsung Galaxy s23 ultra DESCUENTO",
  "Ultimo celular samsung...",
  1450000,
  "path/s23ultra.jpg",
  "SMGS23U",
  50
);

// ELIMINO EL PRODUCTO 2 (error)
productManager.deleteProduct(4);

// TODOS LOS PRODUCTOS DESPUES DEL DELETE
console.log(
  "Todos los productos despues del delete: ",
  productManager.getProducts()
);
