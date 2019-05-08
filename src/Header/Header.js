import React, {Component} from 'react';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <div>
        <div className="headerHuron">
            SARIS - CLUB DE ALGORITMIA ESCOM
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
