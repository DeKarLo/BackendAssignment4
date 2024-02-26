const axios = require("axios");

function getDescription(pokemonSpeciesData) {
    const entry = pokemonSpeciesData.flavor_text_entries.find((entry) => entry.language.name === "en");
    return entry ? entry.flavor_text : "Description not available";
}

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

module.exports = { getDescription, getPokemonSpeciesData, getPokemonData, getPokemonCards, getEvolutionChain };
