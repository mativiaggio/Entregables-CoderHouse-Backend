const { Router } = require("express");

const ProductManager = require("../ProductManager");

const productManager = new ProductManager("products.json");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const productsJSON = await productManager.getProducts();

    if (!isNaN(limit)) {
      res.send(productsJSON.slice(0, limit));
    } else {
      res.send({ products: productsJSON });
    }
  } catch (error) {
    console.error("Error in /products route:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const productsJSON = await productManager.getProductById(productId);

    if (productsJSON) {
      res.json(productsJSON);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;

    console.log(product);
    const productAdded = await productManager.addProduct(product);

    // res.send({ status: product });
    // console.log(productAdded);

    if (productAdded && productAdded.error) {
      res.status(400).json({ error: productAdded.error });
    } else {
      res.status(200).json({ status: "Producto agregado correctamente" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const product = req.body;
    console.log(product);
    const productId = parseInt(req.params.pid);
    console.log(productId);

    const productUpdated = await productManager.updateProduct(
      productId,
      product
    );

    if (productUpdated.error) {
      res.status(404).json({ error: productUpdated.error });
    } else {
      res.json({ status: productUpdated.status });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al subir el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    // const product = req.body;
    const productId = parseInt(req.params.pid);

    const productDeleted = await productManager.deleteProduct(productId);
    res.send({});
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

module.exports = router;
