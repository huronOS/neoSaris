import { useState } from "react";
import WelcomeForm from "./components/WelcomeForm";
import Scoreboard from "./components/Scoreboard";
import { ContestData } from "./parsers/raw-json-parser";

type AppStates = { state: "waiting for data" } | { state: "loading" } | { state: "scoreboard", data: ContestData };

const App = () => {
  const [status, setStatus] = useState({ state: "waiting for data" } as AppStates);
  const handleNewData = (data: Promise<ContestData>) => {
    setStatus({ state: "loading" });
    data
      .then((contestData) => setStatus({ state: "scoreboard", data: contestData }))
      .catch(() => setStatus({ state: "waiting for data" }));
  }

  if (status.state === "waiting for data") return <WelcomeForm onNewContestData={handleNewData} />;
  if (status.state === "loading") return <h1>...</h1>;

  if (status.state === "scoreboard") return <Scoreboard submissionsData={status.data} />

  return null;
};

export default App;