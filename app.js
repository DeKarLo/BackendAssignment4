const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const { authenticate } = require("./middleware/authMiddleware");
const adminRoutes = require("./routes/adminRoutes");

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

mongoose
    .connect("mongodb+srv://DeKarLo:0FzMsKxA7HxdKa1Y@cluster1.enhb9xt.mongodb.net/")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

async function getPokemonSpeciesData(pokemonName) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Pokemon species data:", error);
        return null;
    }
}

async function getPokemonData(pokemonName) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Pokemon data:", error);
        return null;
    }
}

async function getPokemonCards(pokemonName, limit) {
    try {
        const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${pokemonName}&pageSize=${limit}`);
        const data = await response.json();
        const cards = data.data.map((card) => ({
            image: card.images.large,
            link: card.cardmarket.url,
        }));
        return cards;
    } catch (error) {
        console.error("Error fetching Pokémon cards:", error);
        return null;
    }
}

async function getEvolutionChain(pokemonSpeciesData) {
    const evolutionChainUrl = pokemonSpeciesData.evolution_chain.url;
    const evolutionChainResponse = await axios.get(evolutionChainUrl);
    const evolutionChain = evolutionChainResponse.data.chain;

    const evolutionGroups = [];
    traverse(evolutionChain, evolutionGroups);

    return evolutionGroups;
}

function traverse(evolution, evolutionGroups, groupIndex = 0) {
    if (!evolution) return;

    if (!evolutionGroups[groupIndex]) {
        evolutionGroups[groupIndex] = [];
    }

    evolutionGroups[groupIndex].push({
        name: evolution.species.name,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
            evolution.species.url.split("/")[6]
        }.png`,
    });

    evolution.evolves_to.forEach((nextEvolution) => {
        traverse(nextEvolution, evolutionGroups, groupIndex + 1);
    });
}
app.get("/", (req, res) => {
    user = req.session.user;
    res.render("index", { user, error: null });
});

app.get("/pokemon", authenticate, async (req, res) => {
    const pokemonName = req.query.name.toLowerCase();
    const user = req.session.user;
    const pokemonSpeciesData = await getPokemonSpeciesData(pokemonName);
    if (!pokemonSpeciesData) {
        return res.render("pokemon", { pokemon: null, user, error: "Pokemon not found." });
    }

    const pokemonData = await getPokemonData(pokemonName);
    if (!pokemonData) {
        return res.render("pokemon", { pokemon: null, user, error: "Pokemon data not found." });
    }

    const name = pokemonData.name;
    const description = getDescription(pokemonSpeciesData);
    const imageUrl = pokemonData.sprites.other["home"].front_default;
    const evolutionChain = await getEvolutionChain(pokemonSpeciesData);

    const cards = await getPokemonCards(name, 5);

    res.render("pokemon", {
        pokemon: { name, description, imageUrl, evolutionChain, cards },
        user,
        error: null,
    });
});

app.get("/pokemon/:name", async (req, res) => {
    const pokemonName = req.params.name.toLowerCase();
    const user = req.session.user;
    const pokemonSpeciesData = await getPokemonSpeciesData(pokemonName);
    if (!pokemonSpeciesData) {
        return res.render("pokemon", { pokemon: null, user, error: "Pokemon not found." });
    }

    const pokemonData = await getPokemonData(pokemonName);
    if (!pokemonData) {
        return res.render("pokemon", { pokemon: null, user, error: "Pokemon data not found." });
    }

    const name = pokemonData.name;
    const description = getDescription(pokemonSpeciesData);
    const imageUrl = pokemonData.sprites.other["home"].front_default;
    const cards = await getPokemonCards(name, 5);
    const evolutionChain = await getEvolutionChain(pokemonSpeciesData);

    if (pokemonData) {
        res.render("pokemon", {
            pokemon: { name, description, imageUrl, evolutionChain, cards },
            user,
            error: null,
        });
    } else {
        res.render("pokemon", { pokemon: null, user, error: "Pokemon not found." });
    }
});

function getDescription(pokemonSpeciesData) {
    const entry = pokemonSpeciesData.flavor_text_entries.find((entry) => entry.language.name === "en");
    return entry ? entry.flavor_text : "Description not available";
}

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
