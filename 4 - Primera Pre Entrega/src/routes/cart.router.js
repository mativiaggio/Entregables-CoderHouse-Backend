const { Router } = require("express");

const CartManager = require("../CartManager");

const cartManager = new CartManager("carts.json");

const router = Router();

router.get("/:cartId", (req, res) => {
  try {
    const cartId = parseInt(req.params.cartId);
    const cart = cartManager.getCartById(cartId);

    if (cart) {
      res.json({ cart });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/", (req, res) => {
  try {
    // const products = req.body;

    const aProducts = req.body.products || [];
    console.log(`Productos: ${aProducts}`);
    const newCart = cartManager.createCart(aProducts);

    res.json({ cart: newCart });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const cart = cartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const result = await cartManager.addProductToCart(cartId, productId);

    if (result && result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
