const express = require("express");
const { login, register, render_login, render_register, logout } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/login", render_login);
router.get("/register", render_register);
router.post("/login", login);
router.post("/register", register);
router.get("/logout", authenticate, logout);

module.exports = router;
