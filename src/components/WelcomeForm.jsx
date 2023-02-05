import React, { useState } from "react";
import CodeforcesForm from "./forms/CodeforcesForm";
import NeoSarisForm from "./forms/NeoSarisForm";
import SarisStandForm from "./forms/SarisStandForm";
import VjudgeForm from "./forms/VJudgeForm";
import "./WelcomeForm.css";

const getForm = (dataSource, setContestData, setStep) => {
  switch (dataSource) {
    case "codeforces":
      return <CodeforcesForm setContestData={setContestData} setStep={setStep} />;
    case "neosaris":
      return <NeoSarisForm setContestData={setContestData} setStep={setStep} />;
    case "saris-stand":
      return <SarisStandForm setContestData={setContestData} setStep={setStep} />;
    case "vjudge":
      return <VjudgeForm setContestData={setContestData} setStep={setStep} />;
    default:
      return <p>No Option Selected</p>;
  }
};

const WelcomeForm = ({ setContestData, setStep }) => {
  const [dataSource, setDataSource] = useState("neosaris");
  return (
    <div className="data-source-selector-box">
      <h1 className="saris-title">neoSaris</h1>
      <p className="saris-description">
        neoSaris, is an ICPC-like standing resolver to be used to reveal what happens on the frozen
        time of a competition. You can check the source code of this project on{" "}
        <a href="https://github.com/equetzal/SarisResolver">github</a>. IOI-like contest (partial
        scoring) is not supported yet.
      </p>
      <hr height="1px" width="50%" />
      <div>
        <label className="text-white">Select a data source:</label>
        <select
          id="data-source"
          onChange={event => {
            setDataSource(event.target.value);
          }}
        >
          <option value="neosaris">neoSaris JSON</option>
          <option value="codeforces">Codeforces API</option>
          <option value="saris-stand">S4RiS StanD JSON</option>
          <option value="vjudge">vJudge API</option>
        </select>
      </div>
      <div className="text-white">{getForm(dataSource, setContestData, setStep)}</div>
    </div>
  );
};

export default WelcomeForm;
