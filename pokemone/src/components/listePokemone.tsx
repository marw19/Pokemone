import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import ReactPaginate from "react-paginate";
import {
  FaHeartbeat,
  FaFistRaised,
  FaShieldAlt,
  FaBolt,
  FaFilter,
  FaSortAlphaUp,
  FaSortAlphaDown,
  FaUndo,
} from "react-icons/fa";
import { GET_ALL_POKEMONS } from "../queries";

interface Pokemon {
  name: string;
  image: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  types: string[];
}

interface ListePokemoneProps {
  searchTerm: string;
}

const ListePokemone: React.FC<ListePokemoneProps> = ({ searchTerm }) => {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [rangeValue, setRangeValue] = useState(50);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const pokemonsPerPage = 12;

  const { loading, error, data } = useQuery(GET_ALL_POKEMONS, {
    variables: {
      limit: 3200,
      offset: 0,
    },
  });

  useEffect(() => {
    if (data && data.pokemon_v2_pokemon) {
      const allPokemons: Pokemon[] = data.pokemon_v2_pokemon.map((pokemon: any) => {
        const stats = pokemon.pokemon_v2_pokemonstats.reduce(
          (acc: Record<string, number>, stat: any) => ({
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
  
        const types: string[] = pokemon.pokemon_v2_pokemontypes.map(
          (type: any) => type.pokemon_v2_type.name
        );
  
        return {
          name: pokemon.name,
          image: frontDefault || "https://via.placeholder.com/96",
          hp: stats.hp || 0,
          attack: stats.attack || 0,
          defense: stats.defense || 0,
          speed: stats.speed || 0,
          types,
        };
      });
  
      setAllPokemons(allPokemons);
      setFilteredPokemons(allPokemons);
  
      const types = [
        ...new Set(
          allPokemons.flatMap((pokemon) => pokemon.types as string[]) // Typage explicite ici
        ),
      ];
      setAllTypes(types as string[]); // Conversion explicite ici pour rassurer TypeScript
    }
  }, [data]);
  

  useEffect(() => {
    if (searchTerm) {
      const filtered = allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemons(filtered);
    } else {
      setFilteredPokemons(allPokemons);
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

  const resetPokemons = () => {
    setFilteredPokemons(allPokemons);
    setSortOrder(null);
    setRangeValue(50);
    setSelectedOption("");
    setShowDropdown(false);
    setCurrentPage(0);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setRangeValue(value);
    const filtered = allPokemons.filter((pokemon) => pokemon.attack >= value);
    setFilteredPokemons(filtered);
    setCurrentPage(0);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleTypeChange = (selectedType: string) => {
    setSelectedOption(selectedType);
    if (selectedType) {
      const filtered = allPokemons.filter((pokemon) =>
        pokemon.types.includes(selectedType)
      );
      setFilteredPokemons(filtered);
    } else {
      setFilteredPokemons(allPokemons);
    }
    setCurrentPage(0);
  };

  const indexOfLastPokemon = (currentPage + 1) * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = filteredPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);

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
        <div className="flex justify-end items-center mb-4 relative space-x-4">
          {/* Affichage conditionnel du champ select à gauche du bouton */}
          {showDropdown && (
            <select
              className="p-2 border border-gray-300 rounded w-48 outline-none appearance-none"
              value={selectedOption}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="">Types</option>
              {allTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}

          {/* Bouton de filtre */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center"
            >
              <FaFilter className="text-white text-xl" />
              <span className="ml-2">Filtre</span>
            </button>

            {/* Affichage du menu des options */}
            {showFilter && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-4 w-80 z-10">
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
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FaFistRaised className="mr-2 text-xl" />
                      Valeur d'attaque
                    </label>
                    <input
                      type="range"
                      min="49"
                      max="190"
                      step="1"
                      value={rangeValue}
                      onChange={handleRangeChange}
                      className="w-full"
                    />
                  </div>
                  <li className="flex items-center py-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded mr-2"
                      checked={showDropdown}
                      onChange={(e) => setShowDropdown(e.target.checked)}
                    />
                    <span className="text-sm text-gray-700">Types</span>
                  </li>
                  <li
                    className="flex items-center py-2 cursor-pointer hover:bg-gray-200"
                    onClick={resetPokemons}
                  >
                    <FaUndo className="mr-2 text-gray-600" />
                    Réinitialiser les filtres
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Liste des Pokémon */}
        {filteredPokemons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {currentPokemons.map((pokemon, index) => (
              <div
                key={index}
                className="bg-slate-100 rounded-lg shadow-md p-4 flex flex-col items-center transform transition-transform duration-500 hover:-rotate-3"
              >
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-32 h-32 object-cover mb-2 transform transition-transform duration-300 hover:scale-150"
                />
                <h2 className="text-2xl font-semibold capitalize text-blue-600">{pokemon.name}</h2>
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
        ) : (
          <div className="flex items-center justify-center h-screen bg-blue-100">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">😞</div>
              <div className="text-2xl font-semibold text-blue-600">Aucun Pokémon trouvé...</div>
            </div>
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
