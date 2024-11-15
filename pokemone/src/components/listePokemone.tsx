import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeartbeat, FaFistRaised, FaShieldAlt, FaBolt } from 'react-icons/fa'; // Importer des icônes

interface Pokemon {
  name: string;
  image: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

interface PokemonResult {
  name: string;
  url: string;
}

const PokemonCard: React.FC<Pokemon> = ({ name, image, hp, attack, defense, speed }) => {
  return (
    <div className="bg-slate-100 rounded-lg shadow-md p-4 flex flex-col items-center transform transition-transform duration-500 hover:-rotate-3">
      <div className="flex flex-col items-center mb-4">
        <img src={image} alt={name} className="w-32 h-32 object-cover mb-2 transform transition-transform duration-300 hover:scale-150" />
        <h2 className="text-2xl font-semibold capitalize text-blue-600">{name}</h2>
      </div>
      {/* Footer de la carte */}
      <div className="w-full flex justify-around  pt-2 ">
        <div className="flex items-center space-x-1">
          <FaHeartbeat className="text-red-500 text-3xl" />
          <span className='text-2xl text-blue-950'>{hp}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaFistRaised className="text-yellow-500 text-3xl" />
          <span className='text-2xl text-blue-950'>{attack}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaShieldAlt className="text-blue-500 text-3xl" />
          <span className='text-2xl text-blue-950'>{defense}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaBolt className="text-green-500 text-3xl" />
          <span className='text-2xl text-blue-950'>{speed}</span>
        </div>
      </div>
    </div>
  );
};

const ListePokemone: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonPerPage = 12;

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      setError(null); // Réinitialiser l'état d'erreur
      try {
        const offset = (currentPage - 1) * pokemonPerPage;
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`
        );
        const results: PokemonResult[] = response.data.results;

        const pokemonData = await Promise.all(
          results.map(async (pokemon) => {
            const pokemonDetails = await axios.get(pokemon.url);
            const stats = pokemonDetails.data.stats;

            return {
              name: pokemon.name,
              image: pokemonDetails.data.sprites.front_default || 'https://via.placeholder.com/96', // Image par défaut
              hp: stats.find((stat: any) => stat.stat.name === 'hp')?.base_stat || 0,
              attack: stats.find((stat: any) => stat.stat.name === 'attack')?.base_stat || 0,
              defense: stats.find((stat: any) => stat.stat.name === 'defense')?.base_stat || 0,
              speed: stats.find((stat: any) => stat.stat.name === 'speed')?.base_stat || 0,
            };
          })
        );

        setPokemons(pokemonData);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des Pokémon. Veuillez réessayer.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-blue-100">
    <div className="text-center">
      <div className="text-6xl mb-4 animate-bounce">⏳</div>
      <div className="text-xl font-semibold text-blue-600">Chargement des Pokémon...</div>
    </div>
  </div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-blue-100 min-h-screen">
      <div className="container mx-auto p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {pokemons.map((pokemon, index) => (
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
        <div className="flex justify-center space-x-4 p-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-lg font-semibold text-blue-950">{currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={pokemons.length < pokemonPerPage} // Désactiver si pas assez de Pokémon
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListePokemone;
