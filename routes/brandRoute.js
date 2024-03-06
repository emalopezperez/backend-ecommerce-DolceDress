const express = require("express");
const brand = require("../controller/brandController");

const router = express.Router();

const { authMiddleware, isAdmin } = require("../middlewares/authJwt");

router.post("/create-brand", authMiddleware, isAdmin, brand.createBrand);
router.put("/update/:id", authMiddleware, isAdmin, brand.updateBrand);

router.delete("/delete/:id", authMiddleware, isAdmin, brand.deleteBrand);

router.get("/get-brand/:id", brand.getBrand);
router.get("/get-all-brands", brand.getAllBrand);

module.exports = router;
