import React, { useState } from 'react';

interface NavbarProps {
  onSearch: (query: string) => void;
  onLogoClick?: () => void; // Pour réinitialiser ou recharger via le logo
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onLogoClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query); // Transmet la recherche au parent
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Empêche le rechargement de la page
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex items-center justify-between flex-wrap">
        {/* Logo cliquable */}
        <div
          className="text-white text-2xl font-bold cursor-pointer"
          onClick={onLogoClick} // Appelle la fonction passée depuis le parent
        >
          Pokémone
        </div>

        {/* Barre de recherche */}
        <div className="w-full md:w-auto mt-4 md:mt-0 flex justify-center md:justify-end">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <label htmlFor="search" className="sr-only">Rechercher un Pokémon</label>
            <input
              id="search"
              type="text"
              placeholder="Rechercher un Pokémon"
              value={searchQuery}
              onChange={handleSearch}
              className="p-2 w-full md:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 text-gray-400 hover:text-gray-600"
              aria-label="Rechercher"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 2a8 8 0 106.32 14.906l4.387 4.387a1 1 0 001.415-1.415l-4.387-4.387A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
