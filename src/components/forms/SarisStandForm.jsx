import React, { useState } from "react";
import { getContestDataWithSarisStandJSON } from "../../parsers/saris-stand/saris-stand-json-parser";

const SarisStandForm = ({ setContestData, setStep }) => {
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
    <div>
      <form className="all-forms" onSubmit={e => handleSubmit(e)}>
        <p>
          <label>Please, paste your JSON data object:</label>
        </p>
        <textarea
          className="form-raw-data-json-box"
          id="sarisStandJSON"
          name="sarisStandJSON"
          rows="4"
          cols="50"
          value={sarisStandJSON}
          onChange={e => {
            setSarisStandJSON(e.target.value);
          }}
        />
        <br />
        <p>
          <label>
            To format the Saris Stand JSON object, follow{" "}
            <a href="https://github.com/OStrekalovsky/S4RiS-StanD/blob/master/log%20examples/test-contest.txt">
              this
            </a>{" "}
            example.
          </label>
        </p>
        <input type="submit" value="Start Dancing" />
      </form>
    </div>
  );
};

export default SarisStandForm;
