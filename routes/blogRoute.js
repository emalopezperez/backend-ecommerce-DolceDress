const express = require("express");
const blog = require("../controller/blogController");

const { authMiddleware, isAdmin } = require("../middlewares/authJwt");

const router = express.Router();

router.post("/create-blog", authMiddleware, isAdmin, blog.createBlog);
router.get("/get-blog/:id", blog.getBlog);
router.get("/get-all-blogs", blog.getAllBlogs);

router.put("/update-blog/:id", authMiddleware, isAdmin, blog.updateBlog);
router.post("/like-blog", authMiddleware, blog.likeBlog);
router.post("/dislike-blog", authMiddleware, blog.dislikeBlog);

router.delete("/delete-blog/:id", blog.deleteBlog);

module.exports = router;
