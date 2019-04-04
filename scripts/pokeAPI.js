/**
 * Utility class used to interface with the PokeAPI. Each method encapsulates
 * a fetch request to the resource specific URL of the API.
 */
class pokeAPI {
  /**
   * Takes in either the pokemon's name or its pokedex number and returns
   * a Promise containing the data on the requested pokemon in an unnamed
   * object.
   *
   * @param {number / string} identifier The pokemon's name or pokedex number
   * @returns A Promise containing the data on the requested pokemon
   * @throws An error if the fetch request fails
   */
  static async fetchPokemon(identifier) {
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${identifier.toLowerCase()}/`
    );
    let pokemonData = await response.json();

    return pokemonData;
  }

  /**
   * Takes in either the name of a type or the type's api specific id and
   * returns a Promise containing the data on the requested type in an unnamed
   * object.
   *
   * @param {number / string} identifier
   * @returns A Promise containing the data on the requested type
   * @throws An error if the fetch request fails
   */
  static async fetchType(identifier) {
    let response = await fetch(
      `https://pokeapi.co/api/v2/type/${identifier.toLowerCase()}/`
    );
    let typeData = await response.json();

    return typeData;
  }
}
