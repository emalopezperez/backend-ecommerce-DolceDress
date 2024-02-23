const express = require("express");
const user = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authJwt");

const router = express.Router();

router.post("/register", user.createUser);
router.post("/login", user.loginUser);
router.get("/users", user.getAllUsers);
router.get("/:id", authMiddleware, isAdmin, user.getUser);
router.delete("/delete/:id", authMiddleware, user.deleteUser);
router.put("/edit/:id", user.updateUser);

module.exports = router;
