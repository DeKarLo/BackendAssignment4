const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const adminRoutes = require("./routes/adminRoutes");
const pokemonRoutes = require("./routes/pokemonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const { isAdmin } = require("./middleware/authMiddleware");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(
    session({
        secret: "your_secret_here",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.use(express.json());
app.use(cookieParser());

mongoose
    .connect("mongodb+srv://DeKarLo:0FzMsKxA7HxdKa1Y@cluster1.enhb9xt.mongodb.net/")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

app.use("/", pokemonRoutes);
app.use("/auth", authRoutes);
app.use("/admin", isAdmin, adminRoutes);
app.use("/quiz", quizRoutes);
app.post("/change-language", (req, res) => {
    const { language } = req.body;
    res.cookie("language", language, { httpOnly: true });
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
