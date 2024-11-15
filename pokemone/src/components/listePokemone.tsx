import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_POKEMONS } from "../queries";
import ReactPaginate from "react-paginate";
import {
  FaHeartbeat,
  FaFistRaised,
  FaShieldAlt,
  FaBolt,
  FaFilter,
  FaSortAlphaUp,
  FaSortAlphaDown,
} from "react-icons/fa";

interface Pokemon {
  name: string;
  image: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

interface ListePokemoneProps {
  searchTerm: string;
}

const ListePokemone: React.FC<ListePokemoneProps> = ({ searchTerm }) => {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]); // Tous les Pokémon
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]); // Pokémon filtrés
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const pokemonsPerPage = 12;

  const { loading, error, data } = useQuery(GET_ALL_POKEMONS, {
    variables: {
      limit: 3200,
      offset: 0,
    },
  });
  const resetPokemons = () => {
    setFilteredPokemons(allPokemons); // Rétablit les Pokémon d'origine
    setSortOrder(null); // Supprime le tri
    setCurrentPage(0); // Réinitialise la pagination
  };

  useEffect(() => {
    if (data && data.pokemon_v2_pokemon) {
      const allPokemons = data.pokemon_v2_pokemon.map((pokemon: any) => {
        const stats = pokemon.pokemon_v2_pokemonstats.reduce(
          (acc: any, stat: any) => ({
            ...acc,
            [stat.pokemon_v2_stat.name]: stat.base_stat,
          }),
          {}
        );

        const spriteData = pokemon.pokemon_v2_pokemonsprites[0]?.sprites;
        const frontDefault =
          typeof spriteData === "string"
            ? JSON.parse(spriteData)?.front_default
            : spriteData?.front_default;

        return {
          name: pokemon.name,
          image: frontDefault || "https://via.placeholder.com/96",
          hp: stats.hp || 0,
          attack: stats.attack || 0,
          defense: stats.defense || 0,
          speed: stats.speed || 0,
        };
      });

      setAllPokemons(allPokemons); // Stocke tous les Pokémon
      setFilteredPokemons(allPokemons); // Initialise les Pokémon filtrés
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemons(filtered);
    } else {
      setFilteredPokemons(allPokemons); // Réinitialise la liste si le champ est vide
    }
    setCurrentPage(0);
  }, [searchTerm, allPokemons]);

  const sortPokemons = (order: "asc" | "desc") => {
    const sorted = [...filteredPokemons].sort((a, b) =>
      order === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    setFilteredPokemons(sorted);
    setSortOrder(order);
  };

  const indexOfLastPokemon = (currentPage + 1) * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = filteredPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-100">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <div className="text-xl font-semibold text-blue-600">Chargement des Pokémon...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-100">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚠️</div>
          <div className="text-xl font-semibold text-red-500">Erreur : {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-100 min-h-screen">
      <div className="container mx-auto p-5">
        {/* Bouton de tri */}
        <div className="flex justify-end items-center mb-4 relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center"
          >
            <FaFilter className="text-white text-xl" />
          </button>

          {showFilter && (
            <div className="bg-white shadow-lg rounded-md absolute top-10 right-0 p-2 w-40 z-10">
              <ul>
                <li
                  className="flex items-center py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => sortPokemons("asc")}
                >
                  <FaSortAlphaUp className="mr-2 text-gray-600" />
                  Trier A-Z
                </li>
                <li
                  className="flex items-center py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => sortPokemons("desc")}
                >
                  <FaSortAlphaDown className="mr-2 text-gray-600" />
                  Trier Z-A
                </li>
                <li
                  className="flex items-center py-2 cursor-pointer hover:bg-gray-200"
                  onClick={resetPokemons}
                >
                  <FaFilter className="mr-2 text-gray-600" />
                  Réinitialiser
                </li>
              </ul>
            </div>

          )}
        </div>

        {/* Aucun Pokémon trouvé */}
        {filteredPokemons.length === 0 && !loading && (
          <div className="flex items-center justify-center h-screen bg-blue-100">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">😞</div>
              <div className="text-xl font-semibold text-blue-600">Aucun Pokémon trouvé...</div>
            </div>
          </div>
        )}

        {/* Cartes Pokémon */}
        {filteredPokemons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {currentPokemons.map((pokemon, index) => (
              <div
                key={index}
                className="bg-slate-100 rounded-lg shadow-md p-4 flex flex-col items-center transform transition-transform duration-500 hover:-rotate-3"
              >
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-32 h-32 object-cover mb-2 transform transition-transform duration-300 hover:scale-150"
                  />
                  <h2 className="text-2xl font-semibold capitalize text-blue-600">{pokemon.name}</h2>
                </div>
                <div className="w-full flex justify-around pt-2">
                  <div className="flex items-center space-x-1">
                    <FaHeartbeat className="text-red-500 text-3xl" />
                    <span className="text-2xl text-blue-950">{pokemon.hp}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaFistRaised className="text-yellow-500 text-3xl" />
                    <span className="text-2xl text-blue-950">{pokemon.attack}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaShieldAlt className="text-blue-500 text-3xl" />
                    <span className="text-2xl text-blue-950">{pokemon.defense}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaBolt className="text-green-500 text-3xl" />
                    <span className="text-2xl text-blue-950">{pokemon.speed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredPokemons.length > 0 && (
          <div className="flex justify-center mt-8">
            <ReactPaginate
              previousLabel="Précédent"
              nextLabel="Suivant"
              breakLabel="..."
              pageCount={Math.ceil(filteredPokemons.length / pokemonsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName="flex items-center space-x-2"
              pageClassName="px-4 py-2 border rounded"
              activeClassName="bg-blue-600 text-white"
              previousClassName="px-4 py-2 border rounded"
              nextClassName="px-4 py-2 border rounded"
              disabledClassName="opacity-50 cursor-not-allowed"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListePokemone;
