// Init UI Class instance
const ui = new UI();

// Add event listeners
if (document.getElementById("get-mons") !== null) {
  document.getElementById("get-mons").addEventListener("click", getPokemonInfo);
}

/**
 * "Main" function of the pokemon info section of the application. Calls the
 * appropriate functions to get the request from the PokeAPI and populate the
 * UI with the results.
 *
 * @param {Event} e Event fired after pressing the "Get Pokemon" button
 */
async function getPokemonInfo(e) {
  e.preventDefault();

  let inputValue = document.getElementById("pokemon-name").value,
    hasLevitate = false,
    damages;

  // Make sure the name from the input field is acceptable for the API
  inputValue = ui.toAPIString(inputValue);

  try {
    // Get the pokemon data and populate the UI
    let pokemonData = await pokeAPI.fetchPokemon(inputValue);
    console.log(pokemonData);
    ui.populatePokemonInfo(pokemonData);

    // Check the pokemon's abilities for levitate to use in the
    // damages calculation later
    if (pokemonData.abilities[0].ability.name === "levitate") {
      hasLevitate = true;
    }

    // Request type information for each of the pokemon's type[s] and
    // collect them in an array for the damages calculation
    let typePromises = pokemonData.types.map(type =>
      pokeAPI.fetchType(type.type.name)
    );
    let typeObjects = await Promise.all(typePromises);

    // Calculate the damages stats and populate the UI
    damages = calculateTypeMatchups(typeObjects, hasLevitate);
    ui.populateDamageTypes(damages);
  } catch (e) {
    ui.hideOutput();
  }
}

/**
 * Calculates the damages received from each of the other pokemon types and
 * returns them as an object with keys for each type and values representing
 * the damage multiplier for incoming attacks.
 *
 * @param {Array} pokemonTypes - An array of pokemon type objects each containing
 *                               information on damage taken from other types
 * @param {boolean} hasLevitate - A boolean determining if the pokemon has
 *                                the levitate ability
 * @returns An object with keys for each pokemon type and values representing
 *          the damage multiplier for attacks from each type
 */
function calculateTypeMatchups(pokemonTypes, hasLevitate) {
  let matchups = {
    normal: 1,
    fighting: 1,
    flying: 1,
    poison: 1,
    ground: 1,
    rock: 1,
    bug: 1,
    ghost: 1,
    steel: 1,
    fire: 1,
    water: 1,
    grass: 1,
    electric: 1,
    psychic: 1,
    ice: 1,
    dragon: 1,
    dark: 1,
    fairy: 1
  };

  // The levitate ability negates the effects of ground type attacks
  if (hasLevitate) {
    matchups.ground = 0;
  }

  // For each type the pokemon has add the damage relations to the matchups
  // object. Damage relations are multiplicative. For example, if one of the
  // pokemon's types has a 2x damage from ground and the other has a 1/2x damage
  // from ground the overall ground damage in matchups would be 1x.
  pokemonTypes.forEach(type => {
    type.damage_relations.double_damage_from.forEach(doubleDamageType => {
      matchups[`${doubleDamageType.name}`] *= 2;
    });

    type.damage_relations.half_damage_from.forEach(halfDamageType => {
      matchups[`${halfDamageType.name}`] *= 0.5;
    });

    type.damage_relations.no_damage_from.forEach(zeroDamageType => {
      matchups[`${zeroDamageType.name}`] *= 0;
    });
  });

  return matchups;
}

function getTeamEvaluation() {}
