/**
 * Class used to contain the logic for manipulating the UI.
 */
class UI {
  /**
   * Constructor for the UI class. Gets all the necessary UI elements that will
   * need to be manipulated as properties and adds event listeners to the UI
   * elements that need them. This is done in the constructor to keep properties
   * private and promote information hiding.
   */
  constructor() {
    // Get the page elements that will need to be manipulated
    if (document.getElementById("pokemon-name") !== null) {
      this.input = document.getElementById("pokemon-name");
      this.nameHeading = document.getElementById("name-result");
      this.frontImg = document.getElementById("img-front");
      this.backImg = document.getElementById("img-back");
      this.types = document.getElementById("type-result");
      this.dexNum = document.getElementById("dex-num");
      this.height = document.getElementById("height-val");
      this.weight = document.getElementById("weight-val");
    }

    // Non page specific elements
    this.output = document.getElementById("output");
    this.damageTypes = document.querySelector(".damage-types");

    // Add event listeners

    addEventListener("DOMContentLoaded", () => {
      fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
        .then(resp => resp.json())
        .then(data => (this.pokemonSuggestions = data.results))
        .catch(() => console.log("Failed to fetch autocomplete resources."));
    });

    if (document.getElementById("pokemon-name") !== null) {
      document
        .getElementById("pokemon-name")
        .addEventListener("keyup", this.showSuggestions.bind(this));
      document
        .getElementById("chevron")
        .addEventListener("click", this.rotateButton);
    }

    if (document.getElementById("member-0") !== null) {
      document.querySelectorAll(".form-control").forEach(inputField => {
        inputField.addEventListener("keyup", this.showSuggestions.bind(this));
      });
    }
  }

  /**
   * Takes in a pokemon object received from the PokeAPI and populates the UI
   * with the information received within the object.
   *
   * @param {Object} pokemon Pokemon object received from the PokeAPI
   */
  populatePokemonInfo(pokemon) {
    let displayName;

    // Populate the pokedex number
    this.dexNum.innerText = `No. ${pokemon.id}`;

    // Populate the images, front and back, of the Pokemon. Populates with a
    // pokeball if the API has no image for the Pokemon.
    if (pokemon.sprites.front_default !== null) {
      this.frontImg.setAttribute("src", `${pokemon.sprites.front_default}`);
    } else {
      this.frontImg.setAttribute(
        "src",
        "https://github.com/PokeAPI/sprites/blob/master/sprites/items/poke-ball.png?raw=true"
      );
    }
    if (pokemon.sprites.back_default !== null) {
      this.backImg.setAttribute("src", `${pokemon.sprites.back_default}`);
    } else {
      this.backImg.setAttribute(
        "src",
        "https://github.com/PokeAPI/sprites/blob/master/sprites/items/poke-ball.png?raw=true"
      );
    }

    // Convert the pokemon name from the API response to one that looks
    // better for the UI. Used for edge case pokemon with special names
    // in the API database (ex. Nidoran)
    displayName = this.toUIString(pokemon.name);

    // Populate the name of the Pokemon
    this.nameHeading.innerText = `${displayName.charAt(0).toUpperCase() +
      displayName.slice(1)}`;

    // Clear type bagdes from any previous queries and populate the page
    // with type badges from the new query
    this.types.innerHTML = "";
    pokemon.types.forEach(monType => {
      this.types.innerHTML += `<span class="btn type ${
        monType.type.name
      }">${monType.type.name.charAt(0).toUpperCase() +
        monType.type.name.slice(1)}</span>`;
    });

    // Update height and weight with new query values
    this.height.innerText = `${pokemon.height / 10} m`;
    this.weight.innerText = `${pokemon.weight / 10} kg`;

    this.showOutput();
  }

  /**
   * Takes in an object containing damage multipliers for each type of attack
   * the pokemon can receive and displays this information in the UI.
   *
   * @param {Object} damageTypeMultipliers An object containing the damage
   *                                       multipliers for every attack type
   */
  populateDamageTypes(damageTypeMultipliers) {
    // Clear info from the previous query
    this.damageTypes.innerHTML = "";
    for (let type in damageTypeMultipliers) {
      this.damageTypes.innerHTML += `
        <span class="btn type ${type} damage-type d-flex justify-content-between align-items-center"><span>${type
        .charAt(0)
        .toUpperCase() +
        type.slice(1)}</span><span class="btn bg-white damage-multiplier p-1">${
        damageTypeMultipliers[type]
      }</span></span>`;
    }
  }

  /**
   * Populates the UI with the image and name of the team member entered into
   * the input field in the team evaluator section of the application.
   *
   * @param {Event} e
   * @param {Object} pokemonData Pokemon object containing data to populate
   *                             into the UI
   */
  populateTeamMember(e, pokemonData) {
    let img = e.target.parentElement.parentElement.firstElementChild;
    let name = img.nextElementSibling;

    img.setAttribute("src", pokemonData.sprites.front_default);
    name.innerText =
      pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
  }

  /**
   * Resets a team member to the default image and name in the team evaluator
   * section of the application.
   *
   * @param {Event} e Event passed in from another function. Used for DOM
   *                  navigation when changing the elements in the markup.
   */
  resetTeamMember(e) {
    let img = e.target.parentElement.parentElement.firstElementChild;
    let name = img.nextElementSibling;

    img.setAttribute(
      "src",
      "https://github.com/PokeAPI/sprites/blob/master/sprites/items/poke-ball.png?raw=true"
    );
    name.innerText =
      parseInt(e.target.id.slice(e.target.id.indexOf("-") + 1)) + 1;
  }

  /**
   * Changes the visibility of the output field to hidden.
   */
  hideOutput() {
    this.output.style.display = "none";
  }

  /**
   * Changes the visibility of the output field to visible.
   */
  showOutput() {
    this.output.style.display = "block";
  }

  /**
   * Takes in a string from the API request and if necessary reformats it to
   * match the string the user input before making the request. If both the input
   * string and the one received from the API are a match the input is returned
   * unchanged.
   *
   * @param {*} apiString The string received from the API request
   */
  toUIString(apiString) {
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

  /**
   * Takes in a string and assures that it is acceptable for an API request
   * by checking if the string satisfies one of a few edge case pokemon. If
   * theres a match the string is changed from what the user sees in the UI to
   * one that will return a match when requesting the resource from the API.
   * Otherwise the string is returned unchanged.
   *
   * @param {String} uiString The string from the pokemon input field in the UI
   */
  toAPIString(uiString) {
    let apiString;

    if (
      uiString.toLowerCase().startsWith("nidoran") &&
      uiString.endsWith("\u2642")
    ) {
      apiString = uiString.replace("\u2642", "-m");
    } else if (
      uiString.toLowerCase().startsWith("nidoran") &&
      uiString.endsWith("\u2640")
    ) {
      apiString = uiString.replace("\u2640", "-f");
    } else {
      apiString = uiString;
    }

    return apiString;
  }

  /**
   * Shows up to five suggestions under an <input> contained
   * within e.target. Assumes that the markup structure is as follows:
   *
   * <input>
   * <datalist>
   *
   * @param {Event} e Event object used to navigate the DOM and populate
   *                  the suggestions
   */
  showSuggestions(e) {
    // Get the <datalist> under the <input>
    const suggestionBox = e.target.nextElementSibling;

    // Filter out all the non matching pokemon
    const matches = this.pokemonSuggestions.filter(pokemon => {
      return pokemon.name.startsWith(e.target.value);
    });

    suggestionBox.innerHTML = "";
    // Add up to five suggestions under the input field
    for (let match = 0; match < 5 && match < matches.length; match++) {
      suggestionBox.innerHTML += `
        <option>${matches[match].name}</option>
      `;
    }
  }

  /**
   * Adds a class of 'rotate-180' that contains a CSS transform to rotate the
   * element 180 degrees.
   *
   * @param {Event} e
   */
  rotateButton(e) {
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
  }
}
