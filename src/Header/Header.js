import React, {Component} from 'react';
import SubmissionsJSON from '../logs/logs.json';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <div>
        <div className="headerHuron">
            {SubmissionsJSON.Contest.Name}
        </div>
        <div
          className="headerTableRow">
          <span className="headerTableColumnRank">
            Rank
          </span>
          <span
            className="headerTableColumnTeamName">
            Name
          </span>
          <span className="headerTableColumnSolvedAndTime">Solved Time</span>
        </div>
      </div>
    );
  }
}

export default Header;
