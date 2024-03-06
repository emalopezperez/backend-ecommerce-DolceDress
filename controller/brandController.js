const Brand = require("../models/brandModel.js");

const createBrand = async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      product: newBrand,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create brand",
      error: error.message,
    });
  }
};

const updateBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: "Brand update successfully",
      product: updatedBrand,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update brand",
      error: error.message,
    });
  }
};

const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const barandDelete = await Brand.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: "Brand delete successfully",
      product: barandDelete,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete brand",
      error: error.message,
    });
  }
};

const getAllBrand = async (req, res) => {
  try {
    const brands = await Brand.find();

    res.status(201).json({
      success: true,
      message: "Successfully",
      product: brands,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to all brands",
      error: error.message,
    });
  }
};

const getBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "brand no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "brand encontrado",
      brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrand,
  getBrand,
};
