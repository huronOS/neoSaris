import React, { useState } from "react";
import CodeforcesForm from "./forms/CodeforcesForm";
import NeoSarisForm from "./forms/NeoSarisForm";
import SarisStandForm from "./forms/SarisStandForm";
import VjudgeForm from "./forms/VJudgeForm";
import neoSarisLogo from "../assets/neoSaris/neoSaris_logo_vertical_dark.svg";
import "./forms/Forms.css";
import "./Welcome.css";

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

const Introduction = () => {
  return (
    <>
      <img className="introduction-logo" src={neoSarisLogo} />
      <p className="introduction-description">
        neoSaris, is an standing resolver used to reveal what happens on the frozen time of an
        ICPC-like competition. You can check the source code of this project on{" "}
        <a href="https://github.com/equetzal/neoSaris">github</a>.
      </p>
      <hr className="introduction-separator" height="1px" width="50%" />
    </>
  );
};

const DataSourcePicker = ({ setDataSource }) => {
  return (
    <fieldset className="form-field">
      <label>Select a data source:</label>
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
    </fieldset>
  );
};

const WelcomeForm = ({ setContestData, setStep }) => {
  const [dataSource, setDataSource] = useState("neosaris");
  return (
    <div className="welcome-wrapper">
      <div className="welcome-box">
        <div className="welcome-introduction-box">
          <Introduction />
        </div>
        <div className="welcome-form-box">
          <DataSourcePicker setDataSource={setDataSource} />
          {getForm(dataSource, setContestData, setStep)}
        </div>
      </div>
    </div>
  );
};

export default WelcomeForm;
