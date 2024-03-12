class ProductManager {
  constructor() {}

  async addProduct(productData) {
    try {
      const product = new Product(productData);
      console.log(`El productData es ${product}`);
      await product.save();
      console.log("Producto agregado correctamente");
      return { status: "Producto agregado correctamente" };
    } catch (error) {
      console.error(error);
      return { error: "Error al agregar el producto" };
    }
  }

  async getProducts() {
    try {
      const products = await Product.find().lean();
      return products;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }
  }

  async getProductById(productId) {
    console.log(`El id del producto es ${productId}`);
    try {
      const product = await Product.findOne({ id: productId }).lean();

      if (product) {
        return product;
      } else {
        console.error("Producto no encontrado");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      return null;
    }
  }

  async updateProduct(productId, updatedProductData) {
    try {
      const result = await Product.updateOne(
        { id: productId },
        updatedProductData
      );

      if (result.nModified > 0) {
        console.log("Producto actualizado correctamente");
        return { status: "Producto actualizado correctamente" };
      } else {
        console.error("Producto no encontrado");
        return { error: "Producto no encontrado" };
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      return { error: "Error al actualizar el producto" };
    }
  }

  async deleteProduct(productId) {
    try {
      const result = await Product.deleteOne({ id: productId });

      if (result.deletedCount > 0) {
        console.log("Producto eliminado correctamente");
      } else {
        console.error("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  }
}

module.exports = ProductManager;
