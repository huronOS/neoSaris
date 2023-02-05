import React, { useState } from "react";
import { getContestDataWithCodeforcesAPI } from "../../parsers/codeforces/codeforces-api-parser";

const CodeforcesForm = ({ setContestData, setStep }) => {
  const [contestId, setContestId] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [frozenTime, setFrozenTime] = useState(60);

  const handleSubmit = async event => {
    event.preventDefault();
    setStep("loading");
    try {
      setContestData(
        await getContestDataWithCodeforcesAPI({
          frozenTime,
          contestId,
          isPrivate,
          groupId,
          apiKey,
          apiSecret,
        })
      );
      setStep("resolver");
    } catch (error) {
      alert(error.message);
      setStep("form");
    }
    return false;
  };

  return (
    <div>
      <form className="all-forms" onSubmit={e => handleSubmit(e)}>
        <label>Frozen Time (duration in minutes):</label>
        <input
          type="number"
          name="cf_frozen_time"
          required
          onChange={e => setFrozenTime(parseInt(e.target.value))}
        />

        <label>Contest ID:</label>
        <input
          type="text"
          name="cf_contest_id"
          required
          onChange={e => setContestId(e.target.value)}
        />

        <label>Is Private Contest? </label>
        <label className="switch">
          <input type="checkbox" onChange={e => setIsPrivate(e.target.checked)} />
          <span className="slider round"></span>
        </label>

        {isPrivate && <label>Group ID:</label>}
        {isPrivate && (
          <input
            type="text"
            name="cf_group_id"
            required
            onChange={e => setGroupId(e.target.value)}
          />
        )}

        {isPrivate && <label>API Key:</label>}
        {isPrivate && (
          <input type="text" name="cf_api_key" required onChange={e => setApiKey(e.target.value)} />
        )}

        {isPrivate && <label>API Secret:</label>}
        {isPrivate && (
          <input
            type="text"
            name="cf_api_secret"
            required
            onChange={e => setApiSecret(e.target.value)}
          />
        )}

        <br />
        <input type="submit" value="Start Dancing" />
      </form>
    </div>
  );
};

export default CodeforcesForm;
