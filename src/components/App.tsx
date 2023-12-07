import React, { useState } from "react";
import WelcomeForm from "./Welcome";
import Spinner from "./misc/Spinner";
import { verifyNeoSarisJSON } from "../parsers/neosaris/neosaris-json-parser";
import "./App.css";
import { ContestData } from "../types/contestDataTypes";
import Scoreboard from "./scoreboard/Scoreboard";
import test from "./test.json";
import { getInitialData, getNextData } from "./scoreboard/ScoreboardDirector";

const App = () => {
  const [step, setStep] = useState("form");
  const [contestData, setContestData] = useState<ContestData>({} as ContestData);
  const setContestDataWithLog = (contestData: ContestData) => {
    console.log("neoSarisJSON", contestData);
    verifyNeoSarisJSON(contestData);
    setContestData(contestData);
  };
  return (
    <div className="AppBackground">
      {step === "form" && <WelcomeForm setContestData={setContestDataWithLog} setStep={setStep} />}
      {step === "loading" && <Spinner />}
      {step === "resolver" && <Scoreboard contestData={contestData} />}
    </div>
  );
  //   const [step, setStep] = useState("resolver");
  //   const [contestData, setContestData] = useState<ContestData>(
  //     JSON.parse(JSON.stringify(test)) as ContestData
  //   );
  //   return (
  //     <div className="AppBackground">
  //       {step === "resolver" && <Scoreboard contestData={contestData} />}
  //     </div>
  //   );
};

export default App;
