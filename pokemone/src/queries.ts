import { gql } from "@apollo/client";

export const GET_ALL_POKEMONS = gql`
  query GetAllPokemons($limit: Int, $offset: Int) {
    pokemon_v2_pokemon(limit: $limit, offset: $offset) {
      name
      id
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
    }
  }
`;
