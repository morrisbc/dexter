// Init UI Class instance
const ui = new UI();

if (document.getElementById("member-0") !== null) {
  teamMembers = [null, null, null, null, null, null];
}

// Add event listeners
if (document.getElementById("get-mons") !== null) {
  document.getElementById("get-mons").addEventListener("click", getPokemonInfo);
} else if (document.getElementById("member-0") !== null) {
  document.querySelectorAll(".form-control").forEach(inputField => {
    inputField.addEventListener("blur", updateTeamMember);
  });
  document
    .getElementById("eval-team")
    .addEventListener("click", getTeamEvaluation);
}

async function updateTeamMember(e) {
  let pokemonData;

  if (e.target.value !== "") {
    try {
      pokemonData = await pokeAPI.fetchPokemonData(e.target.value.trim());
      ui.populateTeamMember(e, pokemonData);
      teamMembers[
        e.target.id.slice(e.target.id.indexOf("-") + 1)
      ] = pokemonData;
    } catch (error) {
      console.log("Issue fetching resource");
      ui.resetTeamMember(e);
      teamMembers[e.target.id.slice(e.target.id.indexOf("-") + 1)] = null;
    }
  } else {
    ui.resetTeamMember(e);
    teamMembers[e.target.id.slice(e.target.id.indexOf("-") + 1)] = null;
  }

  e.preventDefault();
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

  let inputValue = document.getElementById("pokemon-name").value.trim();

  try {
    // Get the pokemon data and populate the UI
    let pokemonData = await pokeAPI.fetchPokemonData(inputValue);
    ui.populatePokemonInfo(pokemonData);

    // Check the pokemon's abilities for levitate to use in the
    // damages calculation later
    if (pokemonData.abilities[0].ability.name === "levitate") {
      hasLevitate = true;
    }

    // Calculate the damages stats and populate the UI
    damages = await calculateTypeMatchups(pokemonData);
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
async function calculateTypeMatchups(pokemonData) {
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

  let typePromises = pokemonData.types.map(type =>
    pokeAPI.fetchTypeData(type.type.name)
  );
  let pokemonTypes = await Promise.all(typePromises);

  // The levitate ability negates the effects of ground type attacks
  if (pokemonData.abilities[0].ability.name === "levitate") {
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

/**
 * "Main" entry point for the team evaluation section of the application.
 *
 * @param {Event} e
 */
async function getTeamEvaluation(e) {
  e.preventDefault();

  // Calculate the evaluation based on types for the whole team
  const teamEvaluation = await calculateTeamMatchups();

  // Populate the UI with the calculation
  ui.populateDamageTypes(teamEvaluation);

  ui.showOutput();
}

/**
 * Calculates the evaluation for a pokemon team.
 */
async function calculateTeamMatchups() {
  let teamEval = {
    normal: 0,
    fighting: 0,
    flying: 0,
    poison: 0,
    ground: 0,
    rock: 0,
    bug: 0,
    ghost: 0,
    steel: 0,
    fire: 0,
    water: 0,
    grass: 0,
    electric: 0,
    psychic: 0,
    ice: 0,
    dragon: 0,
    dark: 0,
    fairy: 0
  };

  const results = await Promise.all(
    teamMembers.map(member => {
      if (member != null) {
        return calculateTypeMatchups(member);
      }
    })
  );
  results.forEach(result => {
    for (let type in result) {
      teamEval[type] += result[type];
    }
  });
  return teamEval;
}
