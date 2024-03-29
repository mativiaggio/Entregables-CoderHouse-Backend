const { Router } = require("express");
const Product = require("../models/products");
const CartManager = require("../CartManager");
const ProductManager = require("../ProductManager");

const axios = require("axios");

const router = Router();
const cartManager = new CartManager();

const productManager = new ProductManager();

router.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const apiResponse = await axios.get(
      `http://localhost:8080/api/products?limit=${limit}&page=${page}`
    );

    const totalPages = apiResponse.data.totalPages;

    res.render("products", {
      title: "Productos",
      products: apiResponse.data.payload,
      totalPages,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}` : null,
      nextLink:
        page < totalPages
          ? `/products?limit=${limit}&page=${parseInt(page) + 1}`
          : null,
    });
  } catch (error) {
    console.error("Error in /products route:", error);
    res
      .status(500)
      .json({ status: "error", error: "Error al obtener productos" });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const apiResponse = await axios.get(
      `http://localhost:8080/api/products/${productId}`
    );

    const product = apiResponse.data;

    if (product) {
      res.render("productDetails", { title: product.title, product });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post("/products/:pid/add-to-cart", async (req, res) => {
  try {
    const productId = req.params.pid;
    const cartId = req.body.cartId;
    console.log(`Id del carrito: "${cartId}"`);
    const result = await cartManager.addProductToCart(cartId, productId);

    // if  (cartId)

    if (result && result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ cart: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      const products = [];
      for (const item of cart.products) {
        console.log("El id del producto es " + item.id);
        const product = await productManager.getProductById(item.id);
        if (product) {
          products.push({
            ...product,
            quantity: item.quantity,
          });
        }
      }

      res.render("cartDetails", {
        title: `Carrito ${cartId}`,
        cart: { products },
      });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
