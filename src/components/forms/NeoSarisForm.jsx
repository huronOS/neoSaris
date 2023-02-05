import React, { useState } from "react";
import { getContestDataWithNeoSarisJSON } from "../../parsers/neosaris/neosaris-json-parser";

const NeoSarisForm = ({ setContestData, setStep }) => {
  const [neoSarisJSON, setNeoSarisJSON] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    setStep("loading");
    try {
      setContestData(await getContestDataWithNeoSarisJSON(neoSarisJSON));
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
          id="neoSarisJSON"
          name="neoSarisJSON"
          rows="4"
          cols="50"
          value={neoSarisJSON}
          onChange={e => {
            setNeoSarisJSON(e.target.value);
          }}
        />
        <br />
        <p>
          <label>
            To format the raw JSON object, follow{" "}
            <a href="https://github.com/equetzal/SarisResolver/blob/main/public/example.json">
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

export default NeoSarisForm;
