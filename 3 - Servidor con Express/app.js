const express = require("express");
const ProductManager = require("./src/ProductManager");

const app = express();

app.use(express.json());

const productManager = new ProductManager("products.json");
app.set("productManager", productManager);

app.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const productManager = req.app.get("productManager");
    const products = await productManager.getProducts();

    if (!isNaN(limit)) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error("Error in /products route:", error);
    res.status(404).json({ error: "Error al obtener productos" });
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const productManager = req.app.get("productManager");
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(404).json({ error: "Error al obtener el producto" });
  }
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});

module.exports = app;
