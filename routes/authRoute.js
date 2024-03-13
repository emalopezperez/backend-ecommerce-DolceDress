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
router.post("/cash-order", authMiddleware, user.createOrder);
router.post("/apply-coupon", authMiddleware, user.applyCoupon);

router.put("/password", authMiddleware, user.updatePassword);
router.put("/reset-password/:token", user.resetPassword);

router.get("/users", user.getAllUsers);
router.get("/logout", user.logout);
router.get("/refresh", user.handleRefreshToken);
router.get("/get-wishlist", authMiddleware, user.getWishlist);
router.get("/get-cart", authMiddleware, user.getUserCart);
router.get("/get-orders", authMiddleware, user.getOrders);
router.get("/get-all-orders", authMiddleware, isAdmin, user.getAllOrders);
router.get("/get-order/:id", authMiddleware, isAdmin, user.getAllOrders);
router.get("/:id", authMiddleware, isAdmin, user.getUser);

router.delete("/empty-cart", authMiddleware, user.emptyCart);
router.delete("/delete/:id", authMiddleware, user.deleteUser);
router.put("/edit/:id", authMiddleware, user.updateUser);
router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  user.updateOrderStatus
);

module.exports = router;
