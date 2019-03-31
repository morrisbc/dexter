class UI {
  constructor() {
    // Get the page elements that will need to be manipulated
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

    // Add event listeners
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
  }

  populatePokemon(pokemon) {
    console.log(pokemon);
    // Populate the pokedex number
    this.dexNum.innerText = `No. ${pokemon.id}`;

    // Populate the images, front and back, of the Pokemon
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

    let name = pokemon.name;

    // Convert the pokemon name from the API response to one that looks
    // better for the UI. Used for edge case pokemon with special names
    // in the API database (ex. Nidoran)
    name = this.toUIString(name);

    // Populate the name of the Pokemon
    this.nameHeading.innerText = `${name.charAt(0).toUpperCase() +
      name.slice(1)}`;

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

  populateDamageTypes(damages) {
    this.damageTypes.innerHTML = "";
    for (let type in damages) {
      this.damageTypes.innerHTML += `<span class="btn type ${type} damage-type d-flex justify-content-between align-items-center"><span>${type
        .charAt(0)
        .toUpperCase() +
        type.slice(1)}</span><span class="btn bg-white damage-multiplier p-1">${
        damages[type]
      }x</span></span>`;
    }
  }

  hideOutput() {
    this.output.style.display = "none";
  }

  showOutput() {
    this.output.style.display = "block";
  }

  // Takes in a string from an API call response that is unacceptable
  // for display in the UI and returns a new string that is acceptable
  // for display in the UI
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

  // Takes in a string from the UI input field that is unacceptable for
  // use in a call to the API and returns a new string that is acceptable
  // for use in an API call
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

  // Adds UI elements for special input characters/substrings when the pokemon
  // they apply to is typed into the input field
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

  // Changes the suffix of the value in the input field to the selection
  // chosen from the drop down menu
  appendDeoxysFormString(e) {
    if (this.input.value.indexOf("-") === -1) {
      this.input.value += `-${e.target.textContent.toLowerCase()}`;
    } else {
      this.input.value =
        this.input.value.substring(0, this.input.value.indexOf("-")) +
        `-${e.target.textContent.toLowerCase()}`;
    }
  }

  // Adds the gender symbol onto the end of the value in the input field
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
