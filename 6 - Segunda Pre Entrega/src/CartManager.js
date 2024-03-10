const mongoose = require("mongoose");
const ProductManager = require("./ProductManager");
const Cart = require("./models/carts");

class CartManager {
  constructor() {
    this.productManager = new ProductManager();
  }

  async createCart(products) {
    try {
      const productsWithQuantity = products.map((productId) => ({
        id: productId,
        quantity: 1,
      }));

      const cart = new Cart({
        products: productsWithQuantity,
      });

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error creating cart:", error.message);
      return null;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).lean();
      return cart;
    } catch (error) {
      console.error("Error getting cart:", error.message);
      return null;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        console.error("Cart not found");
        return {
          error: "Cart not found",
        };
      }

      const product = await this.productManager.getProductById(productId);

      if (!product) {
        console.error("Product not found");
        return {
          error: "Product not found",
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

      await cart.save();
      return existingProduct || { id: productId, quantity: 1 };
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      return null;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);

      if (!cart) {
        console.error("Cart not found");
        return {
          error: "Cart not found",
        };
      }

      const existingProduct = cart.products.find(
        (product) => product.id.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity = quantity;
        await cart.save();
        return existingProduct;
      } else {
        console.error("Product not found in the cart");
        return {
          error: "Product not found in the cart",
        };
      }
    } catch (error) {
      console.error("Error updating product quantity:", error.message);
      return null;
    }
  }
}

module.exports = CartManager;
