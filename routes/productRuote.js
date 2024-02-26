const express = require("express");
const product = require("../controller/productController");

const router = express.Router();

router.post("/create-product", product.createProduct);
router.get("/get-products", product.getAllProducts);
router.get("/:id", product.getProduct);
router.put("/update-product/:id", product.updateProduct);
router.delete("/delete-product/:id", product.deleteProduct);

module.exports = router;
