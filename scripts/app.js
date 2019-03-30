// Init UI Class
const ui = new UI();

// Add event listeners
document.getElementById("get-mons").addEventListener("click", getResults);
addEventListener("DOMContentLoaded", getResults);

function getResults(e) {
  let inputValue = document.getElementById("pokemon-name").value,
    hasLevitate = false,
    damages;

  // Make sure the name from the input field is acceptable for the API
  inputValue = ui.toAPIString(inputValue);

  fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue.toLowerCase()}/`)
    .then(pokemonResponse => {
      return pokemonResponse.json();
    })
    .then(pokemonData => {
      ui.populatePokemon(pokemonData);
      return pokemonData;
    })
    .then(pokemonData => {
      if (pokemonData.abilities[0].ability.name === "levitate") {
        hasLevitate = true;
      }

      return Promise.all(
        pokemonData.types.map(type =>
          fetch(type.type.url).then(typeResponse => typeResponse.json())
        )
      ).then(typeObjects => {
        damages = calculateTypeMatchups(typeObjects, hasLevitate);
        ui.populateDamageTypes(damages);
      });
    })
    .catch(ui.hideOutput.bind(ui));

  e.preventDefault();
}

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

  if (hasLevitate) {
    matchups.ground = 0;
  }

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
