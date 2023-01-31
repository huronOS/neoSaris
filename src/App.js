import React, { useEffect, useState } from "react";
import "./App.css";
import { buildJSON } from "./parsers/codeforces/codeforces-api-parser";
import Scoreboard from "./components/Scoreboard";
import { CircleLoading } from "react-loadingg";

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
      {step === "loading" && <CircleLoading />}
      {step === "reveal" && <Scoreboard submissionsData={contestData} />}
    </div>
  );
}

export default App;
