import React from 'react';
import './App.css';

import { io } from 'socket.io-client';
import { useState } from 'react';

// Components
import Navigation from './components/Navigation/Navigation';
import Main from './components/Main/Main';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Main />
    </div>
  );
}

export default App;
