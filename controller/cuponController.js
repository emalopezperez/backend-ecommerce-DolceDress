const Cupon = require("../models/cuponModel");

const createCupon = async (req, res) => {
  try {
    const newCupon = await Cupon.create(req.body);

    res.status(201).json({
      success: true,
      message: "Cupon created successfully",
      product: newCupon,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create cupon",
      error: error.message,
    });
  }
};

const updateCupon = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCupon = await Cupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json({
      success: true,
      message: "Edit cupon successfully",
      product: updatedCupon,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Edit cupon failed",
      error: error.message,
    });
  }
};

const deleteCupon = async (req, res) => {
  const { id } = req.params;

  try {
    const cuponDelete = await Cupon.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: "Cupon delete successfully",
      product: cuponDelete,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete cupon",
      error: error.message,
    });
  }
};

const getAllCupons = async (req, res) => {
  try {
    const cupons = await Cupon.find();

    res.status(201).json({
      success: true,
      message: "Successfully",
      product: cupons,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to all cupons",
      error: error.message,
    });
  }
};

const getCupon = async (req, res) => {
  const { id } = req.params;

  try {
    const cupon = await Cupon.findById(id);

    res.status(201).json({
      success: true,
      message: "Successfully",
      product: cupon,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed ",
      error: error.message,
    });
  }
};

module.exports = {
  createCupon,
  getAllCupons,
  getCupon,
  updateCupon,
  deleteCupon,
};
