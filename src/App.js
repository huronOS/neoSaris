import React from 'react';
import './App.css';
import Scoreboard from './Scoreboard/Scoreboard';

function App() {
	console.log(process.env)
  return (
    <div className="AppBackground">
      <Scoreboard />
    </div>
  );
}

export default App;
