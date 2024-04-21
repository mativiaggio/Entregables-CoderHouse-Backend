const { Router } = require("express");
const CartManager = require("../controllers/CartManager");
const Cart = require("../models/carts");
const Product = require("../models/products");

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  try {
    const allCarts = await Cart.find().populate("products.id");
    res.json({ carts: allCarts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cartId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await Cart.findById(cartId).populate("products.id").lean();

    if (cart) {
      res.json({ cart });
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const products = req.body.products || [];
    const newCart = await cartManager.createCart(products);

    res.json({ cart: newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      res.render("cartDetails", { title: `Carrito ${cartId}`, cart });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid/", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body.products || [];

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    const updatedCart = await Promise.all(
      products.map(async (product) => {
        const productId = product.id;
        const quantity = product.quantity || 1;

        const result = await cartManager.addProductToCart(
          cartId,
          productId,
          quantity
        );

        if (result && result.error) {
          return { error: result.error };
        }

        return result;
      })
    );

    res.json({ cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    const result = await cartManager.updateProductQuantity(
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
});

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const result = await Cart.deleteOne({ _id: cartId });

    if (result.deletedCount > 0) {
      res.json({ status: "Cart deleted successfully" });
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.delete("/:cid/products/:pid", async (req, res) => {
//   try {
//     const cartId = req.params.cid;
//     const productId = req.params.pid;

//     const result = await cartManager.removeProductFromCart(cartId, productId);

//     if (result && result.error) {
//       return res.status(400).json({ error: result.error });
//     }

//     res.json({ cart: result });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const result = await cartManager.removeProductFromCart(cartId, productId);

    if (result && result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ message: "Producto eliminado del carrito con éxito." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
