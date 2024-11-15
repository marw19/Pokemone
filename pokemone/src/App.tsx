import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ListePokemone from './components/listePokemone';

const App: React.FC = () => {


 
  return (
    <div>
      <Navbar/>
      <ListePokemone />
    </div>
  );
};

export default App;
