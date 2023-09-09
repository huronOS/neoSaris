import React, { useState } from "react";
import { getContestDataWithSarisStandJSON } from "../../parsers/saris-stand/saris-stand-json-parser";
import { ContestData } from "../../types/contestDataTypes";

const SarisStandForm = ({
  setContestData,
  setStep,
}: {
  setContestData: React.Dispatch<React.SetStateAction<ContestData>>;
  setStep: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [sarisStandJSON, setSarisStandJSON] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    setStep("loading");
    try {
      setContestData(await getContestDataWithSarisStandJSON(sarisStandJSON));
      setStep("resolver");
    } catch (error) {
      alert(error);
      setStep("form");
    }
    return false;
  };

  return (
    <form className="form-box" onSubmit={e => handleSubmit(e)}>
      <fieldset className="form-field">
        <label>Please, paste your JSON data object:</label>
        <textarea
          className="form-raw-data-json-box"
          id="sarisStandJSON"
          name="sarisStandJSON"
          value={sarisStandJSON}
          onChange={e => {
            setSarisStandJSON(e.target.value);
          }}
        />
      </fieldset>
      <fieldset className="form-field">
        <label>
          To format the Saris Stand JSON object, follow{" "}
          <a href="https://github.com/OStrekalovsky/S4RiS-StanD/blob/master/log%20examples/test-contest.txt">
            this
          </a>{" "}
          example.
        </label>
      </fieldset>
      <fieldset className="form-field">
        <input type="submit" value="Start Dancing" />
      </fieldset>
    </form>
  );
};

export default SarisStandForm;
