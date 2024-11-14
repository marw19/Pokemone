// src/components/Navbar.tsx

import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Recherche:', searchQuery);
    // Logique de recherche ici
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex items-center justify-between flex-wrap">
        {/* Logo ou nom de l'application */}
        <div className="text-white text-2xl font-bold">Pokémone</div>

        {/* Barre de recherche */}
        <div className="w-full md:w-auto md:flex items-center mt-4 md:mt-0">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            {/* Icône de loupe */}
            <span className="absolute right-3 text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 2a8 8 0 106.32 14.906l4.387 4.387a1 1 0 001.415-1.415l-4.387-4.387A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
              </svg>
            </span>

            {/* Champ de recherche */}
            <input
              type="text"
              placeholder="Rechercher un Pokémon"
              value={searchQuery}
              onChange={handleSearch}
              className="p-2  w-full md:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
