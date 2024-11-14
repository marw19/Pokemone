// src/components/ListePokemone.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Pokemon {
  name: string;
  image: string;
}

const PokemonCard: React.FC<Pokemon> = ({ name, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
      <img src={image} alt={name} className="w-24 h-24 object-cover mb-4" />
      <h2 className="text-lg font-semibold">{name}</h2>
    </div>
  );
};

const ListePokemone: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonPerPage = 12; // Nombre de Pokémon par page

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        const offset = (currentPage - 1) * pokemonPerPage;
        // Récupération de la liste des Pokémon avec pagination
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`);
        const results = response.data.results;

        // Récupérer les détails de chaque Pokémon pour obtenir l'image
        const pokemonData = await Promise.all(
          results.map(async (pokemon: { name: string; url: string }) => {
            const pokemonDetails = await axios.get(pokemon.url);
            return {
              name: pokemon.name,
              image: pokemonDetails.data.sprites.front_default,
            };
          })
        );

        setPokemons(pokemonData);
      } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon :', error);
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
    return <div className="text-center">Chargement des Pokémon...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {pokemons.map((pokemon, index) => (
          <PokemonCard key={index} name={pokemon.name} image={pokemon.image} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="text-lg font-semibold">Page {currentPage}</span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default ListePokemone;
