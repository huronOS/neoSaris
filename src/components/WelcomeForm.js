import React, { useState } from "react";
import { CircleLoading } from "react-loadingg";
import Scoreboard from "./Scoreboard";
import { getContestDataWithRawData } from "../parsers/raw/raw-json-parser";
import { getContestDataWithCodeforcesAPI } from "../parsers/codeforces/codeforces-api-parser";
import "./WelcomeForm.css";

let contestData = {};

const RawDataForm = ({ setStep }) => {
  const [rawDataValue, setRawDataValue] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(rawDataValue);
    setStep("loading");
    try {
      contestData = await getContestDataWithRawData(rawDataValue);
      setStep("resolver");
    } catch (error) {
      alert(error);
      setStep("form");
    }
    return false;
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <p>
          <label>Please, paste your JSON data object:</label>
        </p>
        <textarea
          id="rawContestDataJSON"
          name="rawContestDataJSON"
          rows="4"
          cols="50"
          value={rawDataValue}
          onChange={(e) => {
            setRawDataValue(e.target.value);
          }}
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

const CodeforcesForm = ({ setStep }) => {
  const [contestId, setContestId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [frozenTime, setFrozenTime] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(
      `contestId: ${contestId}, groupId: ${groupId}, apiKey: ${apiKey}, apiSecret: ${apiSecret}`
    );
    setStep("loading");
    try {
      contestData = await getContestDataWithCodeforcesAPI(
        frozenTime,
        contestId,
        groupId,
        apiKey,
        apiSecret
      );
      console.log(contestData);
      setStep("resolver");
    } catch (error) {
      alert(error.message);
      setStep("form");
    }
    return false;
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)} className="form">
        <label>Frozen Time (duration in minutes):</label>
        <input
          type="number"
          name="cf_frozen_time"
          required
          onChange={(e) => setFrozenTime(parseInt(e.target.value))}
        />

        <label>Contest ID:</label>
        <input
          type="text"
          name="cf_contest_id"
          required
          onChange={(e) => setContestId(e.target.value)}
        />

        <label>Group ID:</label>
        <input
          type="text"
          name="cf_group_id"
          required
          onChange={(e) => setGroupId(e.target.value)}
        />

        <label>API Key:</label>
        <input
          type="text"
          name="cf_api_key"
          required
          onChange={(e) => setApiKey(e.target.value)}
        />

        <label>API Secret:</label>
        <input
          type="text"
          name="cf_api_secret"
          required
          onChange={(e) => setApiSecret(e.target.value)}
        />

        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

const getForm = (dataSource, setStep) => {
  switch (dataSource) {
    case "raw":
      return <RawDataForm setStep={setStep} />;
    case "codeforces":
      return <CodeforcesForm setStep={setStep} />;
    default:
      return <p>No Option Selected</p>;
  }
};

const WelcomeForm = () => {
  const [step, setStep] = useState("form");
  const [dataSource, setDataSource] = useState("raw");
  return (
    <div>
      {step === "form" && (
        <div>
          <div>
            <label className="text-white">Select a data source:</label>
            <select
              id="data-source"
              onChange={(event) => {
                setDataSource(event.target.value);
              }}
            >
              <option value="raw">Raw JSON data</option>
              <option value="codeforces">Codeforces API</option>
            </select>
          </div>
          <div className="text-white">{getForm(dataSource, setStep)}</div>
        </div>
      )}
      {step === "loading" && <CircleLoading />}
      {step === "resolver" && <Scoreboard submissionsData={contestData} />}
    </div>
  );
};

export default WelcomeForm;
