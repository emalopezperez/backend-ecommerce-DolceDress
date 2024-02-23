const express = require("express");
const user = require("../controller/userController");
const router = express.Router();

router.post("/register", user.createUser);
router.post("/login", user.loginUser);
router.get("/users", user.getAllUsers);
router.get("/:id", user.getUser);
router.delete("/delete/:id", user.deleteUser);

module.exports = router;
