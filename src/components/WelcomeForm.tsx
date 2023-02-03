import React, { useState } from "react";
import { ContestData, getContestDataWithRawData } from "../parsers/raw-json-parser";
import { getContestDataWithCodeforcesAPI } from "../parsers/codeforces-api-parser";

type FutureData = (future: Promise<ContestData>) => void
const RawDataForm: React.FC<{ onNewContestData: FutureData }> = ({ onNewContestData }) => {
  const [rawDataValue, setRawDataValue] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(rawDataValue);
    const getNewData = async () => getContestDataWithRawData(rawDataValue);
    onNewContestData(getNewData());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <fieldset>
        <label>Please, paste your JSON data object:</label>
        <textarea
          className="w-full h-32 p-2 text-xs rounded text-gray-900 font-mono"
          value={rawDataValue}
          onChange={(e) => setRawDataValue(e.target.value)}
        />
        <label>
          To format the raw JSON object, follow{" "}
          <a
            className="text-blue-800 underline"
            href="https://github.com/equetzal/SarisResolver/blob/main/public/example.json">
            this
          </a>{" "}
          example.
        </label>
      </fieldset>
      <button
        className="bg-green-600 w-full py-2 rounded text-white"
        type="submit">
        Start Dancing
      </button>
    </form>
  );
};

const CodeforcesForm: React.FC<{ onNewContestData: FutureData }> = ({ onNewContestData }) => {
  const initFieldValues = [
    { displayName: "Frozen Time (duration in minutes):", type: "number", value: 0 },
    { displayName: "Contest ID:", type: "text", value: "" },
    { displayName: "Group ID:", type: "text", value: "" },
    { displayName: "API Key:", type: "text", value: "" },
    { displayName: "API Secret:", type: "text", value: "" },
  ];

  const [fields, setFields] = useState(initFieldValues);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fields.forEach(({ displayName, value }) => console.log(displayName, value));
    onNewContestData(getContestDataWithCodeforcesAPI(
      fields[0].value as number,
      fields[1].value as string,
      fields[2].value as string,
      fields[3].value as string,
      fields[4].value as string,
    ));
  };

  const changeField = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newFields = [...fields];
    newFields[index].value = e.target.value;
    setFields(newFields);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {fields.map(({ displayName, type, value }, index) => (
          <fieldset key={displayName} className="flex flex-col">
            <label>{displayName}</label>
            <input
              className="p-1 rounded text-gray-900"
              type={type} required value={value}
              onChange={(e) => changeField(e, index)} />
          </fieldset>
        ))}
        <button
          className="bg-green-600 w-full py-2 rounded text-white"
          type="submit">
          Start Dancing
        </button>
      </form>
    </div>
  );
};

type Sources = "raw" | "codeforces";
const WelcomeForm: React.FC<{ onNewContestData: any }> = ({ onNewContestData }) => {
  const [dataSource, setDataSource] = useState("raw" as Sources);
  return (
    <main className="flex flex-col text-center items-center lg:px-80 px-12 py-4 gap-6">
      <h1 className="text-3xl font-bold">Saris Resolver</h1>
      <p>
        Saris resolver an ICPC-like standing resolver to be used to reveal what
        happens on the frozen time of a competition. You can check the source
        code of this project on{" "}
        <a
          className="text-blue-800 underline"
          href="https://github.com/equetzal/SarisResolver"
        >
          github
        </a>
        . IOI-like contest (partial scoring) is not supported yet.
      </p>
      <hr />
      <section className="w-80 text-left flex flex-col gap-6">
        <fieldset>
          <label>Select a data source:</label>
          <select
            className="block mx-auto p-1 rounded text-gray-900 w-full"
            onChange={(event) => setDataSource(event.target.value as Sources)}
          >
            <option value="raw">Raw JSON data</option>
            <option value="codeforces">Codeforces API</option>
          </select>
        </fieldset>
        {dataSource === "raw" && <RawDataForm onNewContestData={onNewContestData} />}
        {dataSource === "codeforces" && <CodeforcesForm onNewContestData={onNewContestData} />}
      </section>
    </main>
  );
};

export default WelcomeForm;
