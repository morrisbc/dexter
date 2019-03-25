// Add event listeners
addEventListener("DOMContentLoaded", getMon);
document.getElementById("pokemon-name").addEventListener("keyup", addOptions);
document.getElementById("get-mons").addEventListener("click", getMon);
document.getElementById("btn-male").addEventListener("click", () => {
  document.getElementById("pokemon-name").value += "\u2642";
});
document.getElementById("btn-female").addEventListener("click", () => {
  document.getElementById("pokemon-name").value += "\u2640";
});

// Create the HTTP request object
const http = new httpRequest();

// Gets the requested pokemon from the API and populates the page fields with
// the information from the response
function getMon(e) {
  // Get page elements to populate the data into
  let name = document.getElementById("pokemon-name").value;
  let output = document.getElementById("output");
  let nameHeading = document.getElementById("name-result");
  let front = document.getElementById("img-front");
  let back = document.getElementById("img-back");
  let types = document.getElementById("type-result");
  let dexNum = document.getElementById("dex-num");

  if (name.endsWith("\u2642")) {
    name = name.replace("\u2642", "-m");
  } else if (name.endsWith("\u2640")) {
    name = name.replace("\u2640", "-f");
  }

  // Get the info from the API and display on screen
  http.get(
    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}/`,
    (err, response) => {
      // The HTTP request completed successfully
      if (err === null) {
        // Populate the pokedex number
        dexNum.innerText = `No. ${response.id}`;

        // Populate the images, front and back of the Pokemon
        front.setAttribute("src", `${response.sprites.front_default}`);
        back.setAttribute("src", `${response.sprites.back_default}`);

        // Append the gender symbol back onto the end of the name for
        // nidoran
        if (name.startsWith("nidoran") && name.endsWith("-m")) {
          name = name.replace("-m", "\u2642");
        } else if (name.startsWith("nidoran") && name.endsWith("-f")) {
          name = name.replace("-f", "\u2640");
        }

        // Populate the name of the Pokemon
        nameHeading.innerText = `${name.charAt(0).toUpperCase() +
          name.slice(1)}`;

        // Clear types from any previous queries and populate types for the
        // new query
        types.innerHTML = "";
        response.types.forEach(monType => {
          types.innerHTML += `<span class="btn type ${
            monType.type.name
          }">${monType.type.name.charAt(0).toUpperCase() +
            monType.type.name.slice(1)}</span>`;
        });
        output.style.display = "block";
      } else {
        output.style.display = "none";
      }
    }
  );

  e.preventDefault();
}

// Adds special character options or prefix buttons for specific pokemon
function addOptions(e) {
  // Get the male and female buttons for nidoran
  let maleBtn = document.getElementById("btn-male");
  let femaleBtn = document.getElementById("btn-female");

  // Display the gender buttons when the user types "nidoran" and remove
  // them as soon as the input field no longer equals "nidoran" (case-insensitive)
  if (e.target.value.toLowerCase() === "nidoran") {
    maleBtn.style.display = "inline";
    femaleBtn.style.display = "inline";
  } else {
    maleBtn.style.display = "none";
    femaleBtn.style.display = "none";
  }
}
