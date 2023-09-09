import React, { useState } from "react";
import { getContestDataWithNeoSarisJSON } from "../../parsers/neosaris/neosaris-json-parser";
import { ContestData } from "../../types/contestDataTypes";

const NeoSarisForm = ({
  setContestData,
  setStep,
}: {
  setContestData: React.Dispatch<React.SetStateAction<ContestData>>;
  setStep: React.Dispatch<React.SetStateAction<string>>;
}) => {
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
    <form className="form-box" onSubmit={e => handleSubmit(e)}>
      <fieldset className="form-field">
        <label>Please, paste your JSON data object:</label>
        <textarea
          className="form-raw-data-json-box"
          id="neoSarisJSON"
          name="neoSarisJSON"
          value={neoSarisJSON}
          onChange={e => {
            setNeoSarisJSON(e.target.value);
          }}
        />
      </fieldset>

      <fieldset className="form-field">
        <label>
          To format the raw JSON object, follow{" "}
          <a href="https://github.com/equetzal/neoSaris/blob/main/public/example.json">this</a>{" "}
          example.
        </label>
      </fieldset>

      <fieldset className="form-field">
        <input type="submit" value="Start Dancing" />
      </fieldset>
    </form>
  );
};

export default NeoSarisForm;
