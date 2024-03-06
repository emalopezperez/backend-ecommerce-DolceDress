const express = require("express");
const categoryProduct = require("../controller/productCategory");

const router = express.Router();

const { authMiddleware, isAdmin } = require("../middlewares/authJwt");

router.post(
  "/create-category",
  authMiddleware,
  isAdmin,
  categoryProduct.createCategory
);

router.delete(
  "/delete/:id",
  authMiddleware,
  isAdmin,
  categoryProduct.deleteCategory
);

router.put(
  "/edit/:id",
  authMiddleware,
  isAdmin,
  categoryProduct.updateCategory
);

router.get("/categorys", categoryProduct.getAllCategory);
router.get("/category/:id", categoryProduct.getCategory);

module.exports = router;
