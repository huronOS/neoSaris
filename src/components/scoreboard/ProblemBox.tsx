import React from "react";
import "./ProblemBox.css";
import { ProblemColumn } from "../../types/scoreboardDataTypes";

// problemStatus = "FirstAccepted" | "Accepted" | "Resolving" | "Pending" | "WrongAnswer" | "NoAttempted"

const ProblemBox = ({ index, width, problemStatus, displayText }: ProblemColumn) => {
  return (
    <span className={`problemBox problemBox-${problemStatus}`} style={{ width }} key={index}>
      {displayText}
    </span>
  );
};

export default ProblemBox;
