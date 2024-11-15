import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ListePokemone from './components/listePokemone';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resetTrigger, setResetTrigger] = useState(false); // Utilisé pour forcer le rechargement

  const handleLogoClick = () => {
    setSearchQuery(''); // Réinitialise la recherche
    setResetTrigger((prev) => !prev); // Force la réinitialisation dans ListePokemone
  };

  return (
    <div>
      <Navbar
        onSearch={setSearchQuery}
        onLogoClick={handleLogoClick} // Gestion du clic sur le logo
      />
      <ListePokemone searchQuery={searchQuery} resetTrigger={resetTrigger} />
    </div>
  );
};

export default App;
