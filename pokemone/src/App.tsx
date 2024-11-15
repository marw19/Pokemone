import React, { useState } from "react";
import ListePokemone from './components/listePokemone';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState(""); // État de la recherche

  // Gestion du changement de recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="App">
      <Navbar searchTerm={searchTerm} handleSearch={handleSearch} /> {/* Passer les props de recherche */}
      <ListePokemone searchTerm={searchTerm} /> {/* Passer le terme de recherche au composant ListePokemone */}
    </div>
  );
};

export default App;
