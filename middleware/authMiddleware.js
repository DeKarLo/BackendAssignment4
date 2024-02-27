const e = require("express");

function authenticate(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.render("login", { user: null, error: "You need to be logged in to do this.", message: null });
    }
}

function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.render("login", { user: null, error: "You need to be an admin to do this.", message: null });
    }
}

module.exports = { authenticate, isAdmin };
