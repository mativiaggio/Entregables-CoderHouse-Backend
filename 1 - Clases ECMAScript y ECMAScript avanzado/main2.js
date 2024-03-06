class ProductManager {
  constructor() {
    this.products = [];
    this.productIdCounter = 1;
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
      console.error("Ya existe un producto con este codigo");
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
      console.error("Producto no encontrado ");
      return null;
    }
  }
}

const productManager = new ProductManager();

// PRODUCTO PRUEBA 1
productManager.addProduct(
  "Samsung Galaxy s23 ultra",
  "Ultimo celular samsung...",
  1900000,
  "path/s23ultra.jpg",
  "SMGS23U",
  9030
);

// PRODUCTO PRUEBA 2
productManager.addProduct(
  "Laptop Lenovo i7",
  "Laptop Lenovo procesador i7",
  1545000,
  "path/lenovoi7.jpg",
  "LAPLENi7",
  10000
);

// PRODUCTO DUPLICADO
productManager.addProduct(
  "Samsung Galaxy s23 ultra 2",
  "Ultimo celular samsung...",
  1900000,
  "path/s23ultra.jpg",
  "SMGS23U",
  9030
);

// PRODUCTO VACIO, TEST DE ERROR
productManager.addProduct();

// TODOS LOS PRODUCTOS
console.log("Todos los productos:", productManager.getProducts());

let producto_encontrado;

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
