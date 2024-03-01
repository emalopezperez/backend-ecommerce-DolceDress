const Blog = require("../models/blogModel.js");
const User = require("../models/userModel.js");

const createBlog = async (req, res, next) => {
  try {
    const newPost = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      message: "new post created successfully",
      product: newPost,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

const getBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Post no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "post encontrado",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const getBlogs = await Blog.find();

    res.status(200).json({
      success: true,
      message: "posts encontrados",
      getBlogs,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      deleteBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { createBlog, getBlog, getAllBlogs, deleteBlog, updateBlog };
