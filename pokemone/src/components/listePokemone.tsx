import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { FaHeartbeat, FaFistRaised, FaShieldAlt, FaBolt } from "react-icons/fa";

interface Pokemon {
  name: string;
  image: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

const PokemonCard: React.FC<Pokemon> = ({ name, image, hp, attack, defense, speed }) => {
  return (
    <div className="bg-slate-100 rounded-lg shadow-md p-4 flex flex-col items-center transform transition-transform duration-500 hover:-rotate-3">
      <div className="flex flex-col items-center mb-4">
        <img
          src={image}
          alt={name}
          className="w-32 h-32 object-cover mb-2 transform transition-transform duration-300 hover:scale-150"
        />
        <h2 className="text-2xl font-semibold capitalize text-blue-600">{name}</h2>
      </div>
      <div className="w-full flex justify-around pt-2">
        <div className="flex items-center space-x-1">
          <FaHeartbeat className="text-red-500 text-3xl" />
          <span className="text-2xl text-blue-950">{hp}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaFistRaised className="text-yellow-500 text-3xl" />
          <span className="text-2xl text-blue-950">{attack}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaShieldAlt className="text-blue-500 text-3xl" />
          <span className="text-2xl text-blue-950">{defense}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaBolt className="text-green-500 text-3xl" />
          <span className="text-2xl text-blue-950">{speed}</span>
        </div>
      </div>
    </div>
  );
};

const ListePokemone: React.FC = () => {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]); // Tous les Pokémon
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pokemonsPerPage = 12; // Nombre de Pokémon par page

  // Récupération de tous les Pokémon au démarrage
  const fetchAllPokemons = async (retryCount = 3) => {
    setLoading(true);
    setError(null);

    try {
      let allResults: Array<{ name: string; url: string }> = []; // Typage explicite pour éviter l'erreur
      const limit = 200; // Taille du lot
      const totalPokemons = 1302; // Nombre total de Pokémon

      for (let offset = 0; offset < totalPokemons; offset += limit) {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        allResults = [...allResults, ...response.data.results];
      }

      const allPokemonDetails = await Promise.all(
        allResults.map(async (pokemon: { name: string; url: string }) => {
          const details = await axios.get(pokemon.url);
          const stats = details.data.stats;
          return {
            name: pokemon.name,
            image: details.data.sprites.front_default || "https://via.placeholder.com/96",
            hp: stats.find((stat: any) => stat.stat.name === "hp")?.base_stat || 0,
            attack: stats.find((stat: any) => stat.stat.name === "attack")?.base_stat || 0,
            defense: stats.find((stat: any) => stat.stat.name === "defense")?.base_stat || 0,
            speed: stats.find((stat: any) => stat.stat.name === "speed")?.base_stat || 0,
          };
        })
      );

      setAllPokemons(allPokemonDetails); // Stocker tous les Pokémon
    } catch (err) {
      if (retryCount > 0) {
        console.warn(`Retrying... (${3 - retryCount + 1})`);
        fetchAllPokemons(retryCount - 1); // Réessayer
      } else {
        setError("Une erreur est survenue lors du chargement des Pokémon. Veuillez réessayer.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPokemons();
  }, []);

  // Gestion de la pagination locale
  const indexOfLastPokemon = (currentPage + 1) * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = allPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);

  // Gestion du changement de page
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
          <div className="text-xl font-semibold text-red-500">{error}</div>
          <button
            onClick={() => fetchAllPokemons()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-100 min-h-screen">
      <div className="container mx-auto p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {currentPokemons.map((pokemon, index) => (
            <PokemonCard
              key={index}
              name={pokemon.name}
              image={pokemon.image}
              hp={pokemon.hp}
              attack={pokemon.attack}
              defense={pokemon.defense}
              speed={pokemon.speed}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <ReactPaginate
            previousLabel="Précédent"
            nextLabel="Suivant"
            breakLabel="..."
            pageCount={Math.ceil(allPokemons.length / pokemonsPerPage)} // Nombre total de pages
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick} // Appelé lors du changement de page
            containerClassName="flex items-center space-x-2"
            pageClassName="px-4 py-2 border rounded"
            activeClassName="bg-blue-600 text-white"
            previousClassName="px-4 py-2 border rounded"
            nextClassName="px-4 py-2 border rounded"
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default ListePokemone;
