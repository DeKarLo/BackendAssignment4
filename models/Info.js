const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema({
    picture1: {
        type: String,
    },
    picture2: {
        type: String,
    },
    picture3: {
        type: String,
    },
    name_ru: {
        type: String,
    },
    name_en: {
        type: String,
    },
    description_ru: {
        type: String,
    },
    description_en: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Info = mongoose.model("Info", infoSchema);

module.exports = Info;
