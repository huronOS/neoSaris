import React, { useState } from "react";
import Scoreboard from "./components/scoreboard/Scoreboard";
import WelcomeForm from "./components/WelcomeForm";
import Spinner from "./components/misc/Spinner";
import { verifyNeoSarisJSON } from "./parsers/neosaris/neosaris-json-parser";
import "./App.css";

function App() {
  const [step, setStep] = useState("form");
  const [contestData, setContestData] = useState({});
  const setContestDataWithLog = contestData => {
    console.log("neoSarisJSON", contestData);
    verifyNeoSarisJSON(contestData);
    setContestData(contestData);
  };

  return (
    <div className="AppBackground">
      {step === "form" && <WelcomeForm setContestData={setContestDataWithLog} setStep={setStep} />}
      {step === "loading" && <Spinner />}
      {step === "resolver" && <Scoreboard submissionsData={contestData} />}
    </div>
  );
}

export default App;
