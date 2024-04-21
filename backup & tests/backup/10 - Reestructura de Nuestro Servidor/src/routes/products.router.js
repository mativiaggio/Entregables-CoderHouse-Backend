const { Router } = require("express");
const Product = require("../models/products");
const CartManager = require("../controllers/CartManager");

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};

    if (query) {
      filter["$or"] = [
        { category: { $regex: query, $options: "i" } },
        { status: { $regex: query, $options: "i" } },
      ];
    }

    const sortOptions = {};
    if (sort) {
      sortOptions.price = sort === "asc" ? 1 : -1;
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const result = {
      status: "success",
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink:
        page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
      nextLink:
        page < totalPages
          ? `/api/products?limit=${limit}&page=${page + 1}`
          : null,
    };

    res.json(result);
  } catch (error) {
    console.error("Error in /products route:", error);
    res
      .status(500)
      .json({ status: "error", error: "Error al obtener productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    // const productId = parseInt(req.params.pid);
    const productId = req.params.pid;
    // const product = await Product.findOne({ id: productId }).lean();
    const product = await Product.findOne({ _id: productId }).lean();

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    const product = new Product(productData);
    await product.save();
    res.status(200).json({ status: "Producto agregado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    // const productId = parseInt(req.params.pid);
    const productId = req.params.pid;
    const updatedProductData = req.body;

    const result = await Product.updateOne(
      { id: productId },
      updatedProductData
    );

    if (result.nModified > 0) {
      res.json({ status: "Producto actualizado correctamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    // const productId = parseInt(req.params.pid);
    const productId = req.params.pid;
    const result = await Product.deleteOne({ id: productId });

    if (result.deletedCount > 0) {
      res.json({ status: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

module.exports = router;
