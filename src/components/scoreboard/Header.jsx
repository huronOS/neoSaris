import React from "react";
import "./Header.css";

const Header = ({ title }) => {
  return (
    <div>
      <div className="headerHuron">{title}</div>
      <div className="headerTableRow">
        <span className="headerTableColumnRank">Rank</span>
        <span className="headerTableColumnTeamName">Name</span>
        <span className="headerTableColumnSolvedAndTime">Solved Time</span>
      </div>
    </div>
  );
};

export default Header;
