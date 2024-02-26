const {
    getDescription,
    getPokemonData,
    getPokemonSpeciesData,
    getEvolutionChain,
    getPokemonCards,
} = require("../services/pokemonService.js");
const Info = require("../models/Info.js");

async function render_index(req, res) {
    user = req.session.user;
    language = req.cookies.language;
    if (!language) {
        language = "en";
    }
    infos = await Info.find({}).exec();
    res.render("index", { user, error: null, language, infos });
}

async function render_pokemon(req, res) {
    const pokemonName = req.query.name.toLowerCase();
    const user = req.session.user;
    const pokemonSpeciesData = await getPokemonSpeciesData(pokemonName);
    if (!pokemonSpeciesData) {
        return res.render("pokemon", { pokemon: null, user, error: "Pokemon not found.", language });
    }

    const pokemonData = await getPokemonData(pokemonName);
    if (!pokemonData) {
        return res.render("pokemon", { pokemon: null, user, error: "Pokemon data not found.", language });
    }

    const name = pokemonData.name;
    const description = getDescription(pokemonSpeciesData);
    const imageUrl = pokemonData.sprites.other["home"].front_default;
    const evolutionChain = await getEvolutionChain(pokemonSpeciesData);

    const cards = await getPokemonCards(name, 5);
    language = req.cookies.language;
    if (!language) {
        language = "en";
    }
    res.render("pokemon", {
        pokemon: { name, description, imageUrl, evolutionChain, cards },
        user,
        language,
        error: null,
    });
}

async function render_pokemon_name(req, res) {
    const pokemonName = req.params.name.toLowerCase();
    const user = req.session.user;
    const pokemonSpeciesData = await getPokemonSpeciesData(pokemonName);
    if (!pokemonSpeciesData) {
        return res.render("pokemon", { pokemon: null, user, error: "Pokemon not found.", language });
    }

    const pokemonData = await getPokemonData(pokemonName);
    if (!pokemonData) {
        return res.render("pokemon", { pokemon: null, user, error: "Pokemon data not found.", language });
    }

    const name = pokemonData.name;
    const description = getDescription(pokemonSpeciesData);
    const imageUrl = pokemonData.sprites.other["home"].front_default;
    const cards = await getPokemonCards(name, 5);
    const evolutionChain = await getEvolutionChain(pokemonSpeciesData);
    language = req.cookies.language;
    if (!language) {
        language = "en";
    }
    if (pokemonData) {
        res.render("pokemon", {
            pokemon: { name, description, imageUrl, evolutionChain, cards },
            user,
            error: null,
            language,
        });
    } else {
        res.render("pokemon", { pokemon: null, user, error: "Pokemon not found.", language });
    }
}

module.exports = { render_index, render_pokemon, render_pokemon_name };
