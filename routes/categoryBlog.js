const express = require("express");
const categoryBlog = require("../controller/blogCategory");

const router = express.Router();

const { authMiddleware, isAdmin } = require("../middlewares/authJwt");

router.post(
  "/create-category",
  authMiddleware,
  isAdmin,
  categoryBlog.createCategory
);

router.delete(
  "/delete/:id",
  authMiddleware,
  isAdmin,
  categoryBlog.deleteCategory
);

router.put("/edit/:id", authMiddleware, isAdmin, categoryBlog.updateCategory);

router.get("/categorys", categoryBlog.getAllCategory);
router.get("/category/:id", categoryBlog.getCategory);

module.exports = router;
