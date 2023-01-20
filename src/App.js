import React from "react";
import "./App.css";
import Scoreboard from "./Scoreboard/Scoreboard";
import SubmissionsJSON from "./logs/logs.json";

function App() {
  return (
    <div className="AppBackground">
      <Scoreboard submissionsData={SubmissionsJSON} />
    </div>
  );
}

export default App;
