import React from "react";
import classNames from "classnames";
import { ProblemStatusType } from "../../types/scoreboardDataTypes";
import "./ProblemBox.css";

// problemStatus = "FirstAccepted" | "Accepted" | "Resolving" | "Pending" | "WrongAnswer" | "NoAttempted"

export default function ProblemBox({
  problemWidth,
  problemStatus,
  displayText,
  isNextProblem,
}: {
  problemWidth: number;
  problemStatus: ProblemStatusType;
  displayText: string;
  isNextProblem: boolean;
}) {
  return (
    <span
      className={classNames("problemBox", {
        "problemBox-FirstAccepted": problemStatus === "FirstAccepted",
        "problemBox-Accepted": problemStatus === "Accepted",
        "problemBox-Resolving": problemStatus === "Resolving",
        "problemBox-Pending": problemStatus === "Pending",
        "problemBox-WrongAnswer": problemStatus === "WrongAnswer",
        "problemBox-NoAttempted": problemStatus === "NoAttempted",
        "problemBox-Bordered": isNextProblem,
      })}
      style={{ width: `${problemWidth}%` }}
    >
      {displayText}
    </span>
  );
}
