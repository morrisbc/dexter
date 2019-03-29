// Add event listeners
addEventListener("DOMContentLoaded", getResults);
document
  .getElementById("pokemon-name")
  .addEventListener("keyup", addInputOptions);
document.getElementById("get-mons").addEventListener("click", getResults);
document
  .getElementById("btn-male")
  .addEventListener("click", appendGenderString);
document
  .getElementById("btn-female")
  .addEventListener("click", appendGenderString);
document
  .getElementById("deoxys-normal")
  .addEventListener("click", appendDeoxysFormString);
document
  .getElementById("deoxys-attack")
  .addEventListener("click", appendDeoxysFormString);
document
  .getElementById("deoxys-defense")
  .addEventListener("click", appendDeoxysFormString);
document
  .getElementById("deoxys-speed")
  .addEventListener("click", appendDeoxysFormString);
document.getElementById("chevron").addEventListener("click", e => {
  if (e.target.nodeName === "A") {
    if (e.target.className.indexOf("rotate-180") === -1) {
      e.target.className += " rotate-180";
    } else {
      e.target.className = e.target.className.replace("rotate-180", "");
    }
  } else {
    if (e.target.parentElement.className.indexOf("rotate-180") === -1) {
      e.target.parentElement.className += " rotate-180";
    } else {
      e.target.parentElement.className = e.target.parentElement.className.replace(
        "rotate-180",
        ""
      );
    }
  }
});

// Adds the gender symbol onto the end of the value in the input field
function appendGenderString(e) {
  {
    let name = document.getElementById("pokemon-name");
    if (name.value.endsWith("\u2642") || name.value.endsWith("\u2640")) {
      name.value =
        name.value.substring(0, name.value.length - 1) + e.target.value;
    } else {
      name.value += e.target.value;
    }
  }
}

// Changes the suffix of the value in the input field to the selection
// chosen from the drop down menu
function appendDeoxysFormString(e) {
  let name = document.getElementById("pokemon-name");
  if (name.value.indexOf("-") === -1) {
    name.value += `-${e.target.textContent.toLowerCase()}`;
  } else {
    name.value =
      name.value.substring(0, name.value.indexOf("-")) +
      `-${e.target.textContent.toLowerCase()}`;
  }
}

function getResults(e) {
  let inputValue = document.getElementById("pokemon-name").value;
  let output = document.getElementById("output");
  let damageTypes = document.querySelector(".damage-types");

  // Make sure the name from the input field is acceptable for the API
  inputValue = toAPIString(inputValue);

  // httpGet(`https://pokeapi.co/api/v2/pokemon/${inputValue.toLowerCase()}/`)
  //   .then(pokemonResponse => {
  //     getPokemon(pokemonResponse);
  //   })
  //   .catch(() => (output.style.display = "none"));

  fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue.toLowerCase()}/`)
    .then(pokemonResponse => {
      return pokemonResponse.json();
    })
    .then(pokemonData => {
      getPokemon(pokemonData);
      return pokemonData.types;
    })
    .then(pokemonTypes => {
      Promise.all(
        pokemonTypes.map(type =>
          fetch(type.type.url).then(typeResponse => typeResponse.json())
        )
      ).then(typeObjects => {
        let damages = calculateTypeMatchups(typeObjects);
        console.log(damages);
        damageTypes.innerHTML = "";
        for (type in damages) {
          damageTypes.innerHTML += `<span class="btn type ${type} damage-type d-flex justify-content-between align-items-center"><span>${type
            .charAt(0)
            .toUpperCase() +
            type.slice(1)}</span><span class="btn bg-white damage-multiplier">${
            damages[type]
          }x</span></span>`;
        }
      });
    })
    .catch(() => (output.style.display = "none"));

  e.preventDefault();
}

function getPokemon(pokemon) {
  // Get UI elements to populate the data into
  let output = document.getElementById("output");
  let nameHeading = document.getElementById("name-result");
  let frontImg = document.getElementById("img-front");
  let backImg = document.getElementById("img-back");
  let types = document.getElementById("type-result");
  let dexNum = document.getElementById("dex-num");
  let height = document.getElementById("height-val");
  let weight = document.getElementById("weight-val");

  // Get the info from the API and display the info in the UI
  console.log(pokemon);
  // The HTTP request completed successfully
  if (pokemon !== null) {
    // Populate the pokedex number
    dexNum.innerText = `No. ${pokemon.id}`;

    // Populate the images, front and back, of the Pokemon
    frontImg.setAttribute("src", `${pokemon.sprites.front_default}`);
    backImg.setAttribute("src", `${pokemon.sprites.back_default}`);

    let name = pokemon.name;

    // Convert the pokemon name from the API response to one that looks
    // better for the UI. Used for edge case pokemon with special names
    // in the API database (ex. Nidoran)
    name = toUIString(name);

    // Populate the name of the Pokemon
    nameHeading.innerText = `${name.charAt(0).toUpperCase() + name.slice(1)}`;

    // Clear type bagdes from any previous queries and populate the page
    // with type badges from the new query
    types.innerHTML = "";
    pokemon.types.forEach((monType, index) => {
      types.innerHTML += `<span class="btn type ${
        monType.type.name
      }">${monType.type.name.charAt(0).toUpperCase() +
        monType.type.name.slice(1)}</span>`;
    });

    // Clear height and weight from previous query
    height.innerText = "";
    weight.innerText = "";

    // Update height and weight with new query values
    height.innerText = `${pokemon.height / 10} m`;
    weight.innerText = `${pokemon.weight / 10} kg`;

    // Make the output area of the UI visible
    output.style.display = "block";
  } else {
    // Hide the output area of the UI on error
    output.style.display = "none";
  }
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
}

// Adds UI elements for special input characters/substrings when the pokemon
// they apply to is typed into the input field
function addInputOptions(e) {
  // Get the male and female button elements for nidoran genders
  let maleBtn = document.getElementById("btn-male");
  let femaleBtn = document.getElementById("btn-female");
  // Get the drop down menu element for deoxys forms
  let deoxysMenu = document.getElementById("deoxysMenu");

  // Display the gender buttons when the user types "nidoran" and remove
  // them as soon as the input field no longer equals "nidoran" (case-insensitive)
  if (e.target.value.toLowerCase().startsWith("nidoran")) {
    maleBtn.style.display = "inline";
    femaleBtn.style.display = "inline";
  } else {
    maleBtn.style.display = "none";
    femaleBtn.style.display = "none";
  }

  // Show the drop down menu for deoxys forms once the user has
  // typed "deoxys" and remove it once the input field's value no
  // longer begins with "deoxys" (case-insensitive)
  if (e.target.value.toLowerCase().startsWith("deoxys")) {
    deoxysMenu.style.display = "inline";
  } else {
    deoxysMenu.style.display = "none";
  }
}

// Takes in a string from the UI input field that is unacceptable for
// use in a call to the API and returns a new string that is acceptable
// for use in an API call
function toAPIString(uiString) {
  let apiString;

  if (uiString.startsWith("nidoran") && uiString.endsWith("\u2642")) {
    apiString = uiString.replace("\u2642", "-m");
  } else if (uiString.startsWith("nidoran") && uiString.endsWith("\u2640")) {
    apiString = uiString.replace("\u2640", "-f");
  } else {
    apiString = uiString;
  }

  return apiString;
}

// Takes in a string from an API call response that is unacceptable
// for display in the UI and returns a new string that is acceptable
// for display in the UI
function toUIString(apiString) {
  let uiString;

  if (apiString.startsWith("nidoran") && apiString.endsWith("-m")) {
    uiString = apiString.replace("-m", "\u2642");
  } else if (apiString.startsWith("nidoran") && apiString.endsWith("-f")) {
    uiString = apiString.replace("-f", "\u2640");
  } else {
    uiString = apiString;
  }

  return uiString;
}

function calculateTypeMatchups(pokemonTypes) {
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
