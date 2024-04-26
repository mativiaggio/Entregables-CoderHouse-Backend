const CartDAO = require("../dao/carts.dao");

class CartController {
  constructor() {
    this.cartDAO = new CartDAO();
  }

  async createCart(req, res) {
    try {
      const { products } = req.body;
      const newCart = await this.cartDAO.createCart(products);

      res.status(201).json({ cart: newCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCartById(req, res) {
    try {
      const cartId = req.params.cartId;
      const cart = await this.cartDAO.getCartById(cartId);

      if (cart) {
        res.json({ cart });
      } else {
        res.status(404).json({ error: "Cart not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // async addProductToCart(req, res) {
  //   try {
  //     const { cartId, productId } = req.params;
  //     const result = await this.cartDAO.addProductToCart(cartId, productId);

  //     if (result && result.error) {
  //       return res.status(400).json({ error: result.error });
  //     }

  //     res.json({ cart: result });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  async addProductToCart(userId, productId) {
    try {
      // Buscar el carrito del usuario
      const cart = await this.cartDAO.getCartByUserId(userId);
      console.log("el carrito es " + cart);

      if (!cart) {
        // Si el usuario no tiene un carrito, crear uno nuevo
        const newCart = await this.cartDAO.createCart(userId, [productId]);
        return newCart;
      }

      // Agregar el producto al carrito del usuario
      const result = await this.cartDAO.addProductToCart(cart._id, productId);

      if (result && result.error) {
        return { error: result.error };
      }

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { cartId, productId } = req.params;
      const { quantity } = req.body;
      const result = await this.cartDAO.updateProductQuantity(
        cartId,
        productId,
        quantity
      );

      if (result && result.error) {
        return res.status(400).json({ error: result.error });
      }

      res.json({ cart: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const { cartId, productId } = req.params;
      const result = await this.cartDAO.removeProductFromCart(
        cartId,
        productId
      );

      if (result && result.error) {
        return res.status(400).json({ error: result.error });
      }

      res.json({ message: "Product removed from cart successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CartController;
