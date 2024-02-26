const express = require("express");
const { render_index, render_pokemon, render_pokemon_name } = require("../controllers/pokemonController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", render_index);
router.get("/pokemon", authenticate, render_pokemon);
router.get("/pokemon/:name", authenticate, render_pokemon_name);

module.exports = router;
