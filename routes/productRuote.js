const express = require("express");
const product = require("../controller/productController");

const router = express.Router();

router.post("/create-product", product.createProduct);
router.get("/get-product/:id", product.getProduct);

module.exports = router;
