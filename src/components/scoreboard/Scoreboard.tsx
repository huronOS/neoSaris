import React, { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ContestData } from "../../types/contestDataTypes";

import { Flipper } from "react-flip-toolkit";
import Header from "./Header";
import { getDataUpToNthPlace, getInitialData, getNextData } from "./ScoreboardDirector";
import TableRow from "./TableRow";
import "./Scoreboard.css";
import { ScoreboardDirectorType } from "../../types/scoreboardDataTypes";

export default function Scoreboard({ contestData }: { contestData: ContestData }) {
  const [scoreboardDirector, setScoreboardDirector] = useState(getInitialData(contestData));
  const [reloadId, setReloadId] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null); // Reference to the container

  const indexOfNextTeam = useRef(scoreboardDirector.teams.length - 1);

  const scrollToIndex = (index: number) => {
    containerRef.current?.children[index].scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "nearest",
    });
  };

  const getindexOfNextTeam = () => scoreboardDirector.teams.findLastIndex(t => !t.isDone);

  const scrollToNextTeam = () => {
    const indexOfNextTeam = getindexOfNextTeam();
    if (indexOfNextTeam === -1) scrollToIndex(0);
    else scrollToIndex(indexOfNextTeam);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToIndex(scoreboardDirector.teams.length - 1);
    }, 100);
  }, []);
  useEffect(() => scrollToNextTeam(), [scoreboardDirector, reloadId]);

  const updateScoreboard = (newData: ScoreboardDirectorType) => {
    indexOfNextTeam.current = newData.indexOfNextTeam;
    setScoreboardDirector(newData);
    setReloadId(prevReloadId => prevReloadId + 1);
  };
  const onNextSubmission = () => {
    if (indexOfNextTeam.current === -1) return;
    const newData = getNextData(scoreboardDirector);
    updateScoreboard(newData);
  };

  //(N)ext submission
  useHotkeys("n", () => onNextSubmission());
  //(T)op 10 Standing
  useHotkeys("t", () => updateScoreboard(getDataUpToNthPlace(scoreboardDirector, 10)));
  //(U)nfroze Standing
  useHotkeys("u", () => updateScoreboard(getDataUpToNthPlace(scoreboardDirector, 0)));

  const hasAnyTeamMoved = scoreboardDirector.teams.some(t => t.movedUp);
  return (
    <>
      <div id="score" className={"scoreboardTable"} tabIndex={0}>
        <Header title={scoreboardDirector.scoreboard.contestName} />
        <div className="score-FlipMove" id="score-FlipMove">
          <Flipper
            flipKey={reloadId}
            spring={{ stiffness: 200, damping: 100, overshootClamping: true }}
            staggerConfig={{ default: { speed: 0.05 } }}
          >
            <div className="grid grid-cols-12" ref={containerRef}>
              {scoreboardDirector.teams.map((t, i) => (
                <TableRow
                  team={t}
                  isNextTeam={i == indexOfNextTeam.current && !hasAnyTeamMoved}
                  index={i}
                  key={t.id}
                  isScoreInteger={scoreboardDirector.scoreboard.scoreMode === "absolute"}
                />
              ))}
            </div>
          </Flipper>
        </div>
      </div>
    </>
  );
}
