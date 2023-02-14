import React from "react";
import "./ProblemBox.css";

// problemStatus = "FirstAccepted" | "Accepted" | "Resolving" | "Pending" | "WrongAnswer" | "NoAttempted"

const ProblemBox = ({ index, width, problemStatus, displayText }) => {
  return (
    <span className={`problemBox problemBox-${problemStatus}`} style={{ width }} key={index}>
      {displayText}
    </span>
  );
};

export default ProblemBox;
