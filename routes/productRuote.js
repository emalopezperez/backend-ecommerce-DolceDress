const express = require("express");
const product = require("../controller/productController");

const router = express.Router();

router.post("/create-product", product.createProduct);

module.exports = router;
