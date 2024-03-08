const Blog = require("../models/blogModel.js");
const User = require("../models/userModel.js");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

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
    console.error("Error :", error);
    res.status(500).json({ message: "An error occurred while update blog" });
  }
};

const likeBlog = async (req, res) => {
  const { blogId } = req.body;
  const userId = req.user._id;

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const isLiked = blog.likes.includes(userId);
    const isDisliked = blog.dislikes.includes(userId);

    if (isDisliked) {
      await Blog.findByIdAndUpdate(blogId, {
        $pull: { dislikes: userId },
        isDisliked: false,
      });
    }

    if (isLiked) {
      await Blog.findByIdAndUpdate(blogId, {
        $pull: { likes: userId },
        isLiked: false,
      });
    } else {
      await Blog.findByIdAndUpdate(blogId, {
        $push: { likes: userId },
        isLiked: true,
      });
    }

    const updatedBlog = await Blog.findById(blogId);
    res.json(updatedBlog);
  } catch (error) {
    console.error("Error liking blog:", error);
    res
      .status(500)
      .json({ message: "An error occurred while liking the blog" });
  }
};

const dislikeBlog = async (req, res) => {
  const { blogId } = req.body;
  const userId = req.user._id;

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const isLiked = blog.likes.includes(userId);
    const isDisliked = blog.dislikes.includes(userId);

    if (isLiked) {
      await Blog.findByIdAndUpdate(blogId, {
        $pull: { likes: userId },
        isLiked: false,
      });
    }

    if (isDisliked) {
      await Blog.findByIdAndUpdate(blogId, {
        $pull: { dislikes: userId },
        isDisliked: false,
      });
    } else {
      await Blog.findByIdAndUpdate(blogId, {
        $push: { dislikes: userId },
        isDisliked: true,
      });
    }

    const updatedBlog = await Blog.findById(blogId);
    res.json(updatedBlog);
  } catch (error) {
    console.error("Error disliking blog:", error);
    res
      .status(500)
      .json({ message: "An error occurred while disliking the blog" });
  }
};

const uploadImages = async (req, res) => {
  const { id } = req.params;

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);

      try {
        fs.unlinkSync(path);
        console.log("File removed");
      } catch (err) {
        console.error("Something wrong happened removing the file", err);
      }
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },

      {
        new: true,
      }
    );

    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  updateBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
};
