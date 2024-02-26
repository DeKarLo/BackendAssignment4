const express = require("express");
const { render_admin, create_info, edit_info_form, update_info, delete_info } = require("../controllers/adminController");

const { isAdmin } = require("../middleware/authMiddleware");

router = express.Router();

router.get("/", render_admin);
router.post("/create", create_info);
router.get("/edit/:id", edit_info_form);
router.post("/edit/:id", update_info);
router.post("/delete/:id", delete_info);

module.exports = router;
