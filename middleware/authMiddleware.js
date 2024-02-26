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
        res.status(403).send("Not an admin");
    }
}

module.exports = { authenticate, isAdmin };
