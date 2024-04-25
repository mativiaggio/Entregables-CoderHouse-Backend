const { Router } = require("express");
const CartController = require("../controllers/carts.controller");

const router = Router();
const cartController = new CartController();

router.post("/", cartController.createCart.bind(cartController));
router.get("/:cartId", cartController.getCartById.bind(cartController));
router.post(
  "/:cartId/products/:productId",
  cartController.addProductToCart.bind(cartController)
);
router.put(
  "/:cartId/products/:productId",
  cartController.updateProductQuantity.bind(cartController)
);
router.delete(
  "/:cartId/products/:productId",
  cartController.removeProductFromCart.bind(cartController)
);

module.exports = router;
