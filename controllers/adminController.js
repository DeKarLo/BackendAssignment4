async function render_admin(req, res) {
    res.render("admin", { user: req.session.user });
}

module.exports = { render_admin };
