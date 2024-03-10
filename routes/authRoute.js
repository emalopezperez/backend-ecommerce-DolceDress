const express = require("express");
const user = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authJwt");

const router = express.Router();

router.post("/register", user.createUser);
router.post("/login", user.loginUser);
router.post("/admin-login", user.loginAdmin);
router.post("/forgot-password", authMiddleware, user.forgotPassword);
router.post("/save-address", authMiddleware, user.saveAddress);
router.post("/cart", authMiddleware, user.userCart);

router.put("/password", authMiddleware, user.updatePassword);
router.put("/reset-password/:token", user.resetPassword);

router.get("/users", user.getAllUsers);
router.get("/logout", user.logout);
router.get("/refresh", user.handleRefreshToken);
router.get("/get-wishlist", authMiddleware, user.getWishlist);
router.get("/:id", authMiddleware, isAdmin, user.getUser);

router.delete("/delete/:id", authMiddleware, user.deleteUser);
router.put("/edit/:id", authMiddleware, user.updateUser);

module.exports = router;
