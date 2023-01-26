import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { buildJSON } from "./Codeforces/parser";
import Scoreboard from "./Scoreboard/Scoreboard";
import Form from "./Form/Form";

let contestData = {};

function App() {
  const [step, setStep] = useState("loading");

  useEffect(() => {
    if (step === "loading") {
      buildJSON().then((result) => {
        contestData = result;
        setStep("reveal");
      });
    }
  }, [step, setStep]);

  return (
    <div className="AppBackground">
      {step === "loading" && <p>Loading</p>}
      {step === "reveal" && <Scoreboard submissionsData={contestData} />}
    </div>
  );
}

export default App;
