const User = require("../models/User.js");
const bcrypt = require("bcrypt");

async function render_login(req, res) {
    language = req.cookies.language;
    if (!language) {
        language = "en";
    }
    res.render("login", { user: req.session.user, language, error: null, message: null });
}

async function render_register(req, res) {
    language = req.cookies.language;
    if (!language) {
        language = "en";
    }
    res.render("register", { user: req.session.user, language, error: null, message: null });
}

async function login(req, res) {
    const { username, password } = req.body;
    language = req.cookies.language;
    if (!language) {
        language = "en";
    }
    try {
        const user = await User.findOne({ username }).exec();
        if (!user) {
            return res.render("login", { user: null, error: "Invalid username", language, message: null });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error("Error during login:", err);
                return res.render("login", { user: null, error: "Internal Server Error", language, message: null });
            }
            if (result) {
                req.session.user = user;
                return res.render("login", { user, error: null, language, message: "Login successful" });
            } else {
                return res.render("login", { user: null, language, error: "Invalid password", message: null });
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.render("login", { user: null, language, error: "Internal Server Error, connect to support", message: null });
    }
}

async function register(req, res) {
    const { username, password, password_repeat } = req.body;
    language = req.cookies.language;
    if (!language) {
        language = "en";
    }
    const user = await User.findOne({ username }).exec();
    if (user) {
        return res.render("register", { user: null, language, error: "Username already taken", message: null });
    }
    if (username.length < 3) {
        return res.render("register", { user: null, language, error: "Username must be at least 3 characters long", message: null });
    }
    if (username.length > 20) {
        return res.render("register", { user: null, language, error: "Username must be at most 20 characters long", message: null });
    }
    if (password.length < 8) {
        return res.render("register", { user: null, language, error: "Password must be at least 8 characters long", message: null });
    }
    if (password !== password_repeat) {
        return res.render("register", { user: null, language, error: "Passwords do not match", message: null });
    }
    try {
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                console.error("Error during registration:", err);
                return res.render("register", { user: null, language, error: "Internal Server Error", message: null });
            }
            const user = await User.create({ username, password: hash });
            res.render("login", { user: null, language, error: null, message: "Registration successful, log in to account" });
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.render("register", { user: null, language, error: "Internal Server Error,", message: null });
    }
}

async function logout(req, res) {
    req.session.destroy();
    res.redirect("/auth/login");
}

module.exports = { login, register, render_login, render_register, logout };
