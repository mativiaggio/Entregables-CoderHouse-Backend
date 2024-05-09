const Product = require("../models/products");
const { logger } = require("../utils/logger");

class ProductDAO {
  async addProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return { status: "Producto agregado correctamente" };
    } catch (error) {
      logger.error("Error al agregar el producto:", error);
      return { error: "Error al agregar el producto" };
    }
  }

  async getProducts(limit, page) {
    try {
      const products = await Product.find()
        .limit(parseInt(limit))
        .skip((page - 1) * limit)
        .lean();

      return products;
    } catch (error) {
      logger.error("Error al obtener productos:", error);
      return [];
    }
  }

  async getProductById(productId) {
    logger.info("id " + productId);
    try {
      const product = await Product.findById(productId).lean();

      if (product) {
        return product;
      } else {
        logger.error("Producto no encontrado");
        return null;
      }
    } catch (error) {
      logger.error("Error al obtener el producto:", error);
      return null;
    }
  }

  async updateProduct(productId, updatedProductData) {
    try {
      const result = await Product.updateOne(
        { _id: productId },
        updatedProductData
      );

      if (result.nModified > 0) {
        logger.info("Producto actualizado correctamente");
        return { status: "Producto actualizado correctamente" };
      } else {
        logger.error("Producto no encontrado");
        return { error: "Producto no encontrado" };
      }
    } catch (error) {
      logger.error("Error al actualizar el producto:", error);
      return { error: "Error al actualizar el producto" };
    }
  }

  async deleteProduct(productId) {
    try {
      const result = await Product.deleteOne({ _id: productId });

      if (result.deletedCount > 0) {
        logger.info("Producto eliminado correctamente");
      } else {
        logger.error("Producto no encontrado");
      }
    } catch (error) {
      logger.error("Error al eliminar el producto:", error);
    }
  }

  async countProducts(filter) {
    try {
      const count = await Product.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("Error contando productos:", error);
      return 0;
    }
  }

  async updateProductStock(productId, quantityChange) {
    try {
      const product = await Product.findById(productId).lean();
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      let currentStock = product.stock;
      currentStock += quantityChange;
      await Product.findByIdAndUpdate(productId, { stock: currentStock });

      return { status: "Stock actualizado correctamente" };
    } catch (error) {
      logger.error("Error al actualizar el stock del producto:", error);
      throw error;
    }
  }
}

module.exports = ProductDAO;
