import React from "react";
import "./Header.css";

const Header = ({ title }: { title: string }) => {
  return (
    <div className="headerContainer">
      <span className="contestTitle">{title}</span>
      <div className="columTitles">
        <span className="columTitles-Rank">Rank</span>
        <span className="columTitles-Photo" />
        <span className="columTitles-TeamName">Name</span>
        <span className="columTitles-Penalty">#AC</span>
        <span className="columTitles-Penalty">Penalty</span>
      </div>
    </div>
  );
};

export default Header;
