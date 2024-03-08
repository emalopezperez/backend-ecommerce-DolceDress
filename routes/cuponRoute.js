const express = require("express");
const cupon = require("../controller/cuponController");
const { authMiddleware, isAdmin } = require("../middlewares/authJwt");

const router = express.Router();

router.post("/create-cupon", authMiddleware, isAdmin, cupon.createCupon);
router.get("/get-cupon/:id", authMiddleware, isAdmin, cupon.getCupon);
router.get("/get-all-cupons", authMiddleware, isAdmin, cupon.getAllCupons);

router.put("/update-cupon/:id", authMiddleware, isAdmin, cupon.updateCupon);
router.delete("/delete/:id", authMiddleware, isAdmin, cupon.deleteCupon);

module.exports = router;
