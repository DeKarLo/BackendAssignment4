const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userID: Number,
    username: {
        type: String,
        unique: true,
    },
    password: String,
    creationDate: {
        type: Date,
        default: Date.now,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
