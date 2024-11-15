import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Pokemon {
  name: string;
  image: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

interface ListePokemoneProps {
  searchQuery: string;
  resetTrigger?: boolean; // Pour forcer le rechargement depuis l'extérieur
}

const PokemonCard: React.FC<Pokemon> = React.memo(({ name, image, hp, attack, defense, speed }) => {
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col items-center p-4">
      <img src={image} alt={name} className="w-24 h-24 object-cover mb-4" />
      <h2 className="text-lg font-semibold capitalize">{name}</h2>
      <div className="mt-2 text-sm text-gray-700">
        <p>HP: {hp}</p>
        <p>Attack: {attack}</p>
        <p>Defense: {defense}</p>
        <p>Speed: {speed}</p>
      </div>
    </div>
  );
});

const ListePokemone: React.FC<ListePokemoneProps> = ({ searchQuery, resetTrigger }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonPerPage = 12;

  const cache = useRef<Record<number, Pokemon[]>>({}); // Cache des résultats

  // Fetch Pokémon avec pagination et mise en cache
  const fetchPokemons = async (page: number) => {
    if (cache.current[page]) {
      setPokemons(cache.current[page]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * pokemonPerPage;
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`);
      const results = response.data.results;

      const pokemonData = await Promise.all(
        results.map(async (pokemon: { name: string; url: string }) => {
          const { data } = await axios.get(pokemon.url);
          const stats = data.stats;

          return {
            name: pokemon.name,
            image: data.sprites.front_default || '',
            hp: stats.find((stat: any) => stat.stat.name === 'hp')?.base_stat || 0,
            attack: stats.find((stat: any) => stat.stat.name === 'attack')?.base_stat || 0,
            defense: stats.find((stat: any) => stat.stat.name === 'defense')?.base_stat || 0,
            speed: stats.find((stat: any) => stat.stat.name === 'speed')?.base_stat || 0,
          };
        })
      );

      cache.current[page] = pokemonData; // Mise en cache
      setPokemons(pokemonData);
    } catch (err) {
      setError('Erreur lors de la récupération des Pokémon. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons(currentPage);
  }, [currentPage]);

  // Rechargement lors de la réinitialisation
  useEffect(() => {
    setCurrentPage(1); // Revient à la première page
    cache.current = {}; // Réinitialise le cache
    fetchPokemons(1); // Relance l'API
  }, [resetTrigger]);

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 bg-blue-100 min-h-screen flex flex-col items-center justify-center">
      {filteredPokemons.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-2xl font-semibold text-gray-700">Aucun Pokémon trouvé</div>
        </div>
      ) : (
        <>
          <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {filteredPokemons.map((pokemon, index) => (
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

          <div className="flex justify-center space-x-4 p-7">
            <button
              aria-label="Précédent"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="text-lg font-semibold">{currentPage}</span>
            <button
              aria-label="Suivant"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListePokemone;
