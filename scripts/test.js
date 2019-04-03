// Add event listeners
document.getElementById("member-1").addEventListener("blur", getMon);
document.getElementById("member-2").addEventListener("blur", getMon);
document.getElementById("member-3").addEventListener("blur", getMon);
document.getElementById("member-4").addEventListener("blur", getMon);
document.getElementById("member-5").addEventListener("blur", getMon);
document.getElementById("member-6").addEventListener("blur", getMon);

function getMon(e) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${e.target.value.toLowerCase()}/`)
    .then(response => response.json())
    .then(monData => {
      let img = e.target.parentElement.parentElement.firstElementChild;
      let name = img.nextElementSibling;
      img.setAttribute("src", monData.sprites.front_default);
      name.innerText =
        monData.name.charAt(0).toUpperCase() + monData.name.slice(1);
    })
    .catch(() => {
      if (e.target.value === "") {
        // Do nothing. User left input field with empty value
        // and event triggered. No issue.
      } else {
        console.log("Issue fetching resource");
      }
    });
}
