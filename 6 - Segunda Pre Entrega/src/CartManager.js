const fs = require("fs");
const ProductManager = require("./ProductManager");

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = this.readFileCarts();
    this.cartIdCounter = this.calculateCartIdCounter();
    this.productManager = new ProductManager("products.json");
  }

  readFileCarts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      this.carts = JSON.parse(data) || [];
      return this.carts;
    } catch (error) {
      console.log("Error reading file:", error.message);
      return [];
    }
  }
  calculateCartIdCounter() {
    return Math.max(...this.carts.map((cart) => cart.id), 0) + 1;
  }

  saveCartsToFile() {
    try {
      const data = JSON.stringify(this.carts, null, 2);
      fs.writeFileSync(this.path, data, "utf8");
    } catch (error) {
      console.error("Error saving file:", error, message);
    }
  }

  async createCart(aProducts) {
    try {
      const aProductsQuantity = aProducts.map((productId) => ({
        id: productId,
        quantity: 1,
      }));

      const cart = {
        id: this.cartIdCounter++,
        products: aProductsQuantity || [],
      };

      this.carts.push(cart);
      this.saveCartsToFile();
      return cart;
    } catch (error) {
      console.error("Error creating cart:", error.message);
      return null;
    }
  }

  getCartById(cartId) {
    const cart = this.carts.find((c) => c.id === cartId);

    if (cart) {
      return cart;
    } else {
      console.error("Cart not found");
      return null;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = this.getCartById(cartId);

      if (!cart) {
        console.error("Carrito no encontrado");
        return {
          error: "Carrito no encontrado",
        };
      }

      const product = await this.productManager.getProductById(productId);

      if (!product) {
        console.error("Producto no encontrado");
        return {
          error: "Producto no encontrado",
        };
      }

      const existingProduct = cart.products.find(
        (product) => product.id === productId
      );

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ id: productId, quantity: 1 });
      }

      this.saveCartsToFile();
      return existingProduct || { id: productId, quantity: 1 };
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      return null;
    }
  }
}

module.exports = CartManager;
