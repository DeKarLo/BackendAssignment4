const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Function to fetch Pokemon species data
async function getPokemonSpeciesData(pokemonName) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Pokemon species data:", error);
        return null;
    }
}

// Function to fetch Pokemon data
async function getPokemonData(pokemonName) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Pokemon data:", error);
        return null;
    }
}

// Main page route with search functionality
app.get("/", (req, res) => {
    res.render("index");
});

// Route to display detailed information about a specific Pokemon
app.get("/pokemon", async (req, res) => {
    const pokemonName = req.query.name.toLowerCase();

    const pokemonSpeciesData = await getPokemonSpeciesData(pokemonName);
    if (!pokemonSpeciesData) {
        return res.render("pokemon", { pokemon: null, error: "Pokemon not found." });
    }

    const pokemonData = await getPokemonData(pokemonName);
    if (!pokemonData) {
        return res.render("pokemon", { pokemon: null, error: "Pokemon data not found." });
    }

    const name = pokemonData.name;
    const description = getDescription(pokemonSpeciesData);
    const imageUrl = pokemonData.sprites.other["dream_world"].front_default;

    // Fetch evolution chain data
    const evolutionChainUrl = pokemonSpeciesData.evolution_chain.url;
    const evolutionChainResponse = await axios.get(evolutionChainUrl);
    const evolutionChain = evolutionChainResponse.data.chain;
    console.log(evolutionChain.evolves_to);

    if (pokemonData) {
        res.render("pokemon", {
            pokemon: { name, description, imageUrl, evolutionChain },
            error: null,
        });
    } else {
        res.render("pokemon", { pokemon: null, error: "Pokemon not found." });
    }
});

// Function to get description from flavor_text_entries
function getDescription(pokemonSpeciesData) {
    const entry = pokemonSpeciesData.flavor_text_entries.find((entry) => entry.language.name === "en");
    return entry ? entry.flavor_text : "Description not available";
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
