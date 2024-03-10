const express = require("express");
const product = require("../controller/productController");

const { authMiddleware, isAdmin } = require("../middlewares/authJwt");
const {
  productImgResize,
  uploadPhoto,
} = require("../middlewares/uploadImages");

const router = express.Router();

router.post("/create-product", authMiddleware, isAdmin, product.createProduct);

router.get("/get-products", product.getAllProducts);
router.get("/get-product/:id", product.getProduct);

router.delete(
  "/delete-product/:id",
  authMiddleware,
  isAdmin,
  product.deleteProduct
);

router.put(
  "/update-product/:id",
  authMiddleware,
  isAdmin,
  product.updateProduct
);
router.put("/wishlist", authMiddleware, product.addToWishlist);
router.put("/rating", authMiddleware, product.rating);
router.put(
  "/upload-images/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  product.uploadImages
);

module.exports = router;
