// Add event listeners for the page load and the Pokemon name submission field
addEventListener("DOMContentLoaded", getMon);
document.getElementById("get-mons").addEventListener("click", getMon);

// Create the HTTP request object
const http = new httpRequest();

function getMon(e) {
  // Get page elements to populate the data into
  let name = document.getElementById("pokemon-name").value;
  let nameHeading = document.getElementById("name-result");
  let front = document.getElementById("img-front");
  let back = document.getElementById("img-back");
  let types = document.getElementById("type-result");

  // Get the info from the API and display on screen
  http.get(
    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}/`,
    (err, response) => {
      console.log(response);
      // The HTTP request completed successfully
      if (err === null) {
        // Populate the images, front and back of the Pokemon
        front.setAttribute("src", `${response.sprites.front_default}`);
        back.setAttribute("src", `${response.sprites.back_default}`);

        // Populate the name of the Pokemon
        nameHeading.innerText = `${response.name.charAt(0).toUpperCase() +
          response.name.slice(1)}`;

        // Clear types from any previous queries and populate types for the
        // new query
        types.innerHTML = "";
        response.types.forEach(monType => {
          console.log(monType);
          types.innerHTML += `<li class="list-group-item">${monType.type.name
            .charAt(0)
            .toUpperCase() + monType.type.name.slice(1)}</li>`;
        });
      } else {
        nameHeading.innerHTML = err;
        front.style.display = "none";
        back.style.display = "none";
      }
    }
  );

  e.preventDefault();
}
