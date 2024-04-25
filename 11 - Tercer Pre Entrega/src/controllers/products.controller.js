const ProductDAO = require("../dao/products.dao");

const productDAO = new ProductDAO();

class ProductController {
  async getProducts(req, res) {
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

      const products = await productDAO.getProducts(limit, page);

      const totalProducts = await productDAO.countProducts(filter);
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

      return result;
    } catch (error) {
      console.error("Error in /products route:", error);
      throw error;
    }
  }

  async getProductById(req, res) {
    try {
      const productId = req.params.pid;
      const product = await productDAO.getProductById(productId);

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el producto" });
    }
  }

  async addProduct(req, res) {
    try {
      const productData = req.body;
      const result = await productDAO.addProduct(productData);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al agregar el producto" });
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.pid;
      const updatedProductData = req.body;
      const result = await productDAO.updateProduct(
        productId,
        updatedProductData
      );

      if (result.status) {
        res.json(result);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el producto" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.pid;
      const result = await productDAO.deleteProduct(productId);

      if (result.deletedCount > 0) {
        res.json({ status: "Producto eliminado correctamente" });
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  }
}

module.exports = ProductController;
