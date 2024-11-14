import React from 'react';
import Navbar from './components/Navbar';
import ListePokemone from './components/listePokemone';

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <ListePokemone />
      {/* Autres composants */}
    </div>
  );
};
export default App;