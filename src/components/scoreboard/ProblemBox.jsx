import React from "react";
import "./ProblemBox.css";

// problemStatus = "FirstAccepted" | "Accepted" | "Resolving" | "Pending" | "WrongAnswer" | "NoAttempted"

const ProblemBox = ({ letter, width, problemStatus, displayText }) => {
  return (
    <span className={`problemBox problemBox-${problemStatus}`} style={{ width }} key={letter}>
      {displayText}
    </span>
  );
};

export default ProblemBox;
