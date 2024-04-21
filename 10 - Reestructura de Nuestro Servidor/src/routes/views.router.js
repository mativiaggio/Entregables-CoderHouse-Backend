const { Router } = require("express");
const CartController = require("../controllers/carts.controller");
const ProductController = require("../controllers/products.controller");

const router = Router();
const cartController = new CartController();
const productController = new ProductController();

const publicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/");
  next();
};

const privateAccess = (req, res, next) => {
  if (!req.session.user) {
    console.log("not logged in");
    return res.redirect("/login");
  }
  next();
};

router.get("/register", publicAccess, (req, res) => {
  res.render("register", {});
});

router.get("/login", publicAccess, (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error destroying session");
    }
    res.redirect("/login");
  });
});

router.get("/", privateAccess, (req, res) => {
  res.render("home", { user: req.session.user });
});

router.get("/realtimeproducts", privateAccess, (req, res) => {
  res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

router.get("/products", privateAccess, async (req, res) => {
  try {
    const { limit = 12, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const products = await productController.getProducts(req, res);

    console.log("products " + products);
    const totalPages = products.totalPages;

    products.payload.forEach((product) => {
      const randomDiscountPercentage = Math.random() * (0.3 - 0.05) + 0.05;
      const discountedPrice = (
        product.price *
        (1 - randomDiscountPercentage)
      ).toFixed(2);
      product.discountedPrice = discountedPrice;
      product.discountPercentage = (randomDiscountPercentage * 100).toFixed(0);
    });

    res.render("products", {
      title: "Productos",
      products: products.payload,
      totalPages,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}` : null,
      nextLink:
        page < totalPages
          ? `/products?limit=${limit}&page=${parseInt(page) + 1}`
          : null,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error in /products route:", error);
    res
      .status(500)
      .json({ status: "error", error: "Error al obtener productos" });
  }
});

router.get("/products/:pid", privateAccess, async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productController.getProductById(productId);

    if (product) {
      res.render("productDetails", { title: product.title, product });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post("/products/:pid/add-to-cart", privateAccess, async (req, res) => {
  try {
    const productId = req.params.pid;
    const cartId = req.body.cartId;
    console.log(`Id del carrito: "${cartId}"`);
    const result = await cartController.addProductToCart(cartId, productId);

    if (result && result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ cart: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/carts/:cid", privateAccess, async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartController.getCartById(cartId);

    if (cart) {
      const products = [];
      for (const item of cart.products) {
        console.log("El id del producto es " + item.id);
        const product = await productController.getProductById(item.id);
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
