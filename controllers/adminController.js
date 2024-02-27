const Info = require("../models/Info");

async function render_admin(req, res) {
    language = req.cookies.language;
    if (!language) {
        language = "en";
    }
    infos = await Info.find({}).exec();
    res.render("admin", { user: req.session.user, language, infos, error: null, message: null });
}

async function create_info(req, res) {
    const { picture1, picture2, picture3, name_ru, name_en, description_ru, description_en } = req.body;
    const newInfo = new Info({
        picture1,
        picture2,
        picture3,
        name_ru,
        name_en,
        description_ru,
        description_en,
    });
    language = req.cookies.language;
    if (!language) {
        language = "en";
    }
    try {
        await newInfo.save();
        res.render("admin", {
            user: req.session.user,
            infos: await Info.find({}).exec(),
            language,
            error: null,
            message: "Info created successfully",
        });
    } catch (error) {
        res.render("admin", {
            user: req.session.user,
            language,
            infos: await Info.find({}).exec(),
            error: "Failed to create info",
            message: null,
        });
    }
}

async function edit_info_form(req, res) {
    const { id } = req.params;
    language = req.cookies.language;
    if (!language) {
        language = "en";
    }
    try {
        const info = await Info.findById(id).exec();
        if (!info) {
            return res.status(404).json({ message: "Info not found" });
        }
        res.render("edit_info_form", { user: req.session.user, language, info, error: null, message: null });
    } catch (error) {
        res.render("admin", {
            user: req.session.user,
            language,
            infos: await Info.find({}).exec(),
            error: "Failed to edit info",
            message: null,
        });
    }
}

async function update_info(req, res) {
    const { id } = req.params;
    const { picture1, picture2, picture3, name_ru, name_en, description_ru, description_en } = req.body;
    language = req.cookies.language;
    if (!language) {
        language = "en";
    }
    try {
        const info = await Info.findById(id).exec();
        if (!info) {
            return res.status(404).json({ message: "Info not found" });
        }
        info.picture1 = picture1;
        info.picture2 = picture2;
        info.picture3 = picture3;
        info.name_ru = name_ru;
        info.name_en = name_en;
        info.description_ru = description_ru;
        info.description_en = description_en;
        await info.save();
        res.render("admin", {
            user: req.session.user,
            infos: await Info.find({}).exec(),
            language,
            error: null,
            message: "Info updated successfully",
        });
    } catch (error) {
        res.render("admin", {
            user: req.session.user,
            language,
            infos: await Info.find({}).exec(),
            error: "Failed to update info",
            message: null,
        });
    }
}

async function delete_info(req, res) {
    const { id } = req.params;
    language = req.cookies.language;
    if (!language) {
        language = "en";
    }
    try {
        await Info.findByIdAndDelete(id).exec();
        res.render("admin", {
            user: req.session.user,
            infos: await Info.find({}).exec(),
            language,
            error: null,
            message: "Info deleted successfully",
        });
    } catch (error) {
        res.render("admin", {
            user: req.session.user,
            infos: await Info.find({}).exec(),
            language,
            error: "Failed to delete info",
            message: null,
        });
    }
}

module.exports = { render_admin, create_info, edit_info_form, update_info, delete_info };
