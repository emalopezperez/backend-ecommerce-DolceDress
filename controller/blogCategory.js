const CategoryBlog = require("../models/blogCategoryModel");

const createCategory = async (req, res) => {
  try {
    const newCategory = await CategoryBlog.create(req.body);

    res.status(201).json({
      success: true,
      message: "Category blog created successfully",
      product: newCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create category blog",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryDelete = await CategoryBlog.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: "Category blog delete successfully",
      product: categoryDelete,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete category blog",
      error: error.message,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categorys = await CategoryBlog.find();

    res.status(201).json({
      success: true,
      message: "Successfully",
      product: categorys,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to all category blog",
      error: error.message,
    });
  }
};

const getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await CategoryBlog.findById(id);
    res.status(201).json({
      success: true,
      message: "Successfully",
      product: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCategory = await CategoryBlog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json({
      success: true,
      message: "Edit category successfully",
      product: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Edit category failed",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
};
