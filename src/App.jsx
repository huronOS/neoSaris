import React, { useState } from "react";
import { CircleLoading } from "react-loadingg";
import Scoreboard from "./components/scoreboard/Scoreboard";
import WelcomeForm from "./components/WelcomeForm";
import "./App.css";

function App() {
  const [step, setStep] = useState("form");
  const [contestData, setContestData] = useState({});
  return (
    <div className="AppBackground">
      {step === "form" && <WelcomeForm setContestData={setContestData} setStep={setStep} />}
      {step === "loading" && <CircleLoading />}
      {step === "resolver" && <Scoreboard submissionsData={contestData} />}
    </div>
  );
}

export default App;
