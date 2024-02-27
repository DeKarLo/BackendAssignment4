const express = require("express");
const {
    render_admin,
    create_info,
    edit_info_form,
    update_info,
    delete_info,
    render_users,
    create_user,
    edit_user_form,
    update_user,
    delete_user,
} = require("../controllers/adminController");

router = express.Router();

//info

router.get("/info", render_admin);
router.post("/info/create", create_info);
router.get("/info/edit/:id", edit_info_form);
router.post("/info/edit/:id", update_info);
router.post("/info/delete/:id", delete_info);

//users

router.get("/users", render_users);
router.post("/users/create", create_user);
router.get("/users/edit/:id", edit_user_form);
router.post("/users/edit/:id", update_user);
router.post("/users/delete/:id", delete_user);

module.exports = router;
