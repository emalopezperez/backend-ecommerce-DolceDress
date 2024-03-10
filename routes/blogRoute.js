const express = require("express");
const blog = require("../controller/blogController");

const { authMiddleware, isAdmin } = require("../middlewares/authJwt");
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImages");

const router = express.Router();

router.get("/get-blog/:id", blog.getBlog);
router.get("/get-all-blogs", blog.getAllBlogs);

router.post("/create-blog", authMiddleware, isAdmin, blog.createBlog);
router.post("/like-blog", authMiddleware, blog.likeBlog);
router.post("/dislike-blog", authMiddleware, blog.dislikeBlog);

router.delete("/delete-blog/:id", blog.deleteBlog);

router.put("/update-blog/:id", authMiddleware, isAdmin, blog.updateBlog);
router.put(
  "/upload-images/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImgResize,
  blog.uploadImages
);

module.exports = router;
