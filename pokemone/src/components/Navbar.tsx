interface NavbarProps {
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchTerm, handleSearch }) => {
  // Fonction de gestion de la recherche avec validation de l'entrée
  const validateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remplacer tout caractère qui n'est pas une lettre ou un tiret par rien
    const validInput = e.target.value.replace(/[^a-zA-Z-]/g, "");
    handleSearch({ target: { value: validInput } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex items-center justify-between flex-wrap">
        {/* Logo ou nom de l'application */}
        <div className="text-white text-2xl font-bold">Pokémone</div>

        {/* Barre de recherche */}
        <div className="relative w-full md:w-auto mt-4 md:mt-0">
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 2a8 8 0 106.32 14.906l4.387 4.387a1 1 0 001.415-1.415l-4.387-4.387A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Rechercher un Pokémon"
            className="p-2 pl-10 w-full md:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchTerm}
            onChange={validateInput} // Utiliser la fonction de validation
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
