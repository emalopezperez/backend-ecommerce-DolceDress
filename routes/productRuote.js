const express = require("express");
const product = require("../controller/productController");

const { authMiddleware, isAdmin } = require("../middlewares/authJwt");

const router = express.Router();

router.post("/create-product", authMiddleware, isAdmin, product.createProduct);
router.get("/get-products", product.getAllProducts);
router.get("/get-product/:id", product.getProduct);
router.put(
  "/update-product/:id",
  authMiddleware,
  isAdmin,
  product.updateProduct
);
router.delete(
  "/delete-product/:id",
  authMiddleware,
  isAdmin,
  product.deleteProduct
);

router.put("/wishlist", authMiddleware, product.addToWishlist);

module.exports = router;
