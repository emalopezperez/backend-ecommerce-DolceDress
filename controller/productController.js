const Product = require("../models/productModel");

const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Producto encontrado",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
};
