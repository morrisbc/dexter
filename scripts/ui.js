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
      this.output = document.getElementById("output");
      this.nameHeading = document.getElementById("name-result");
      this.frontImg = document.getElementById("img-front");
      this.backImg = document.getElementById("img-back");
      this.types = document.getElementById("type-result");
      this.dexNum = document.getElementById("dex-num");
      this.height = document.getElementById("height-val");
      this.weight = document.getElementById("weight-val");
      this.maleBtn = document.getElementById("btn-male");
      this.femaleBtn = document.getElementById("btn-female");
      this.deoxysMenu = document.getElementById("deoxysMenu");
      this.damageTypes = document.querySelector(".damage-types");
    }

    // Add event listeners
    if (document.getElementById("pokemon-name") !== null) {
      document
        .getElementById("pokemon-name")
        .addEventListener("keyup", this.addInputOptions.bind(this));
      document
        .getElementById("btn-male")
        .addEventListener("click", this.appendGenderString.bind(this));
      document
        .getElementById("btn-female")
        .addEventListener("click", this.appendGenderString.bind(this));
      document
        .getElementById("deoxys-normal")
        .addEventListener("click", this.appendDeoxysFormString.bind(this));
      document
        .getElementById("deoxys-attack")
        .addEventListener("click", this.appendDeoxysFormString.bind(this));
      document
        .getElementById("deoxys-defense")
        .addEventListener("click", this.appendDeoxysFormString.bind(this));
      document
        .getElementById("deoxys-speed")
        .addEventListener("click", this.appendDeoxysFormString.bind(this));
      document
        .getElementById("chevron")
        .addEventListener("click", this.rotateButton);
    } else if (document.getElementById("member-1") !== null) {
      document
        .getElementById("member-1")
        .addEventListener("blur", this.populateTeamMember);
      document
        .getElementById("member-2")
        .addEventListener("blur", this.populateTeamMember);
      document
        .getElementById("member-3")
        .addEventListener("blur", this.populateTeamMember);
      document
        .getElementById("member-4")
        .addEventListener("blur", this.populateTeamMember);
      document
        .getElementById("member-5")
        .addEventListener("blur", this.populateTeamMember);
      document
        .getElementById("member-6")
        .addEventListener("blur", this.populateTeamMember);
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

    displayName = pokemon.name;

    // Convert the pokemon name from the API response to one that looks
    // better for the UI. Used for edge case pokemon with special names
    // in the API database (ex. Nidoran)
    displayName = this.toUIString(displayName);

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

    // Clear height and weight from previous query
    this.height.innerText = "";
    this.weight.innerText = "";

    // Update height and weight with new query values
    this.height.innerText = `${pokemon.height / 10} m`;
    this.weight.innerText = `${pokemon.weight / 10} kg`;

    this.showOutput();
  }

  /**
   * Takes in an object containing damage multipliers for each type of attack
   * the pokemon can receive and displays this information in the UI.
   *
   * @param {Object} damages An object containing the damage multipliers for
   *                         every attack type
   */
  populateDamageTypes(damages) {
    // Clear info from the previous query
    this.damageTypes.innerHTML = "";
    for (let type in damages) {
      this.damageTypes.innerHTML += `
        <span class="btn type ${type} damage-type d-flex justify-content-between align-items-center"><span>${type
        .charAt(0)
        .toUpperCase() +
        type.slice(1)}</span><span class="btn bg-white damage-multiplier p-1">${
        damages[type]
      }x</span></span>`;
    }
  }

  /**
   * Populates the UI with the image and name of the team member entered into
   * the input field in the team evaluator section of the application.
   *
   * @param {Event} e
   */
  async populateTeamMember(e) {
    if (e.target.value !== "") {
      try {
        let pokemonData = await pokeAPI.fetchPokemon(e.target.value);
        let img = e.target.parentElement.parentElement.firstElementChild;
        let name = img.nextElementSibling;

        img.setAttribute("src", pokemonData.sprites.front_default);
        name.innerText =
          pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
      } catch (e) {
        console.log("Issue fetching resource");
      }
    } else {
      resetTeamMember(e);
    }
  }

  /**
   * Resets a team member to the default image and name in the team evaluator
   * section of the application.
   *
   * @param {Event} e Event passed in from another function. Used for DOM
   *                  navigation when changing the elements in the markup.
   */
  resetTeamMember(e) {
    let img, name;

    img = e.target.parentElement.parentElement.firstElementChild;
    name = img.nextElementSibling;
    img.setAttribute(
      "src",
      "https://github.com/PokeAPI/sprites/blob/master/sprites/items/poke-ball.png?raw=true"
    );
    name.innerText = e.target.id.slice(e.target.id.indexOf("-") + 1);
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
   * @param {*} uiString The string from the pokemon input field in the UI
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
   * Adds special input options next to the submit button when the prefix of the
   * pokemon they apply to is typed into the input field. (Ex. "nidoran" adds
   * buttons for the gender symbols).
   *
   * @param {Event} e
   */
  addInputOptions(e) {
    // Display the gender buttons when the user types "nidoran" and remove
    // them as soon as the input field no longer equals "nidoran" (case-insensitive)
    if (e.target.value.toLowerCase().startsWith("nidoran")) {
      this.maleBtn.style.display = "inline";
      this.femaleBtn.style.display = "inline";
    } else {
      this.maleBtn.style.display = "none";
      this.femaleBtn.style.display = "none";
    }

    // Show the drop down menu for deoxys forms once the user has
    // typed "deoxys" and remove it once the input field's value no
    // longer begins with "deoxys" (case-insensitive)
    if (e.target.value.toLowerCase().startsWith("deoxys")) {
      this.deoxysMenu.style.display = "inline";
    } else {
      this.deoxysMenu.style.display = "none";
    }
  }

  /**
   * Changes the suffix of the value in the input field to the selection
   * chosen from the deoxys drop down menu.
   *
   * @param {Event} e
   */
  appendDeoxysFormString(e) {
    if (this.input.value.indexOf("-") === -1) {
      this.input.value += `-${e.target.textContent.toLowerCase()}`;
    } else {
      this.input.value =
        this.input.value.substring(0, this.input.value.indexOf("-")) +
        `-${e.target.textContent.toLowerCase()}`;
    }
  }

  /**
   * Appends a gender symbol onto the end of the value in the input field.
   *
   * @param {Event} e
   */
  appendGenderString(e) {
    if (
      this.input.value.endsWith("\u2642") ||
      this.input.value.endsWith("\u2640")
    ) {
      this.input.value =
        this.input.value.substring(0, this.input.value.length - 1) +
        e.target.value;
    } else {
      this.input.value += e.target.value;
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
