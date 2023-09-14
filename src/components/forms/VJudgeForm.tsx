import React, { useState } from "react";
import { getContestDataWithVjudgeAPI } from "../../parsers/vjudge/vjudge-api-parser";
import { ContestData } from "../../types/contestDataTypes";

const VjudgeForm = ({
  setContestData,
  setStep,
}: {
  setContestData: (contestData: ContestData) => void;
  setStep: (step: string) => void;
}) => {
  const [contestId, setContestId] = useState("");
  const [frozenTime, setFrozenTime] = useState(0);
  const [numberOfProblems, setNumberOfProblems] = useState(0);

  const handleSubmit = async event => {
    event.preventDefault();
    setStep("loading");
    try {
      setContestData(await getContestDataWithVjudgeAPI(frozenTime, contestId, numberOfProblems));
      setStep("resolver");
    } catch (error) {
      alert(error.message);
      setStep("form");
    }
    return false;
  };

  return (
    <form className="form-box" onSubmit={e => handleSubmit(e)}>
      <fieldset className="form-field">
        <label>Frozen Time (duration in minutes):</label>
        <input
          type="number"
          name="vjudge_frozen_time"
          required
          onChange={e => setFrozenTime(parseInt(e.target.value))}
        />
      </fieldset>

      <fieldset className="form-field">
        <label>Number of Problems:</label>
        <input
          type="number"
          name="vjudge_number_of_problems"
          required
          onChange={e => setNumberOfProblems(parseInt(e.target.value))}
        />
      </fieldset>

      <fieldset className="form-field">
        <label>Contest ID:</label>
        <input
          type="text"
          name="vjudge_contest_id"
          required
          onChange={e => setContestId(e.target.value)}
        />
      </fieldset>

      <fieldset className="form-field">
        <input type="submit" value="Start Dancing" />
      </fieldset>
    </form>
  );
};

export default VjudgeForm;
