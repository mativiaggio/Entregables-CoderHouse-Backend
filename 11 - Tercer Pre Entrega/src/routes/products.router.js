const { Router } = require("express");
const ProductController = require("../controllers/products.controller");

const router = Router();
const productController = new ProductController();

router.get("/", async (req, res) => {
  await productController.getProducts(req, res);
});

router.get("/:pid", async (req, res) => {
  await productController.getProductById(req, res);
});

router.post("/", async (req, res) => {
  await productController.addProduct(req, res);
});

router.put("/:pid", async (req, res) => {
  await productController.updateProduct(req, res);
});

router.delete("/:pid", async (req, res) => {
  await productController.deleteProduct(req, res);
});

module.exports = router;
