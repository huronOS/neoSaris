import React, { Component } from "react";
import ProblemBox from "./ProblemBox";
import "./TableRow.css";

import defaultImage from "../../assets/university_logos/default.png";
import cecyt13 from "../../assets/university_logos/cecyt13.png";
import chapingo from "../../assets/university_logos/chapingo.png";
import escom from "../../assets/university_logos/escom.png";
import itcg from "../../assets/university_logos/itcg.png";
import uam from "../../assets/university_logos/uam.png";
import ug from "../../assets/university_logos/ug.png";
import umsa from "../../assets/university_logos/umsa.png";


const images = { cecyt13, chapingo, escom, itcg, uam, ug, umsa };

class TableRow extends Component {
  getImageForTeam(url) {
    return images[url] ?? defaultImage;
  }

  numberOfTriesOnAcceptedProblem(problemLetter) {
    let team = this.props.team;
    for (let i = 0; i < this.props.numberOfProblems; i++) {
      if (this.props.problemsIndex === problemLetter) {
        return team.triesOnProblems[i] + 1 + " - " + team.penaltyOnProblem[i];
      }
    }
    return problemLetter;
  }

  numberOfTriesOnTriedProblem(problemLetter) {
    let team = this.props.team;
    for (let i = 0; i < this.props.numberOfProblems; i++) {
      if (this.props.problemsIndex[i] === problemLetter) {
        return team.triesOnProblems[i] + " - " + team.penaltyOnProblem[i];
      }
    }
    return problemLetter;
  }

  numberOfTriesOnFrozenProblem(problemLetter) {
    let team = this.props.team;
    let submissionWhenFrozen = this.props.submissionWhenFrozen;
    if (
      submissionWhenFrozen === undefined ||
      submissionWhenFrozen === null ||
      submissionWhenFrozen.length === 0
    ) {
      return problemLetter;
    }
    for (let i = 0; i < this.props.numberOfProblems; i++) {
      if (this.props.problemsIndex[i] === problemLetter) {
        if (team.isProblemSolved[i] !== 0) {
          return problemLetter;
        }
        for (let j = 0; j < submissionWhenFrozen.length; j++) {
          if (
            submissionWhenFrozen[j].teamName === team.name &&
            submissionWhenFrozen[j].problem === problemLetter
          ) {
            return team.triesOnProblems[i] + 1 + " - " + submissionWhenFrozen[j].timeSubmission;
          }
        }
      }
    }
    return problemLetter;
  }

  hasSolvedProblem(problemLetter) {
    let team = this.props.team;
    for (let i = 0; i < this.props.numberOfProblems; i++) {
      if (this.props.problemsIndex[i] === problemLetter) {
        if (team.isProblemSolved[i] === 0) {
          return false;
        } else {
          return true;
        }
      }
    }
    return false;
  }

  hasTriedProblem(problemLetter) {
    let team = this.props.team;
    for (let i = 0; i < this.props.numberOfProblems; i++) {
      if (this.props.problemsIndex[i] === problemLetter) {
        if (team.triesOnProblems[i] !== 0) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  isFirstToSolve(problemLetter) {
    let team = this.props.team;
    for (let i = 0; i < this.props.numberOfProblems; i++) {
      if (this.props.problemsIndex[i] === problemLetter) {
        if (team.isFirstToSolve[i] !== 0) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  isAPendingProblem(problemLetter) {
    let team = this.props.team;
    let submissionWhenFrozen = this.props.submissionWhenFrozen;
    if (submissionWhenFrozen === undefined || submissionWhenFrozen.length === 0) {
      return false;
    }
    for (let i = 0; i < this.props.numberOfProblems; i++) {
      if (this.props.problemsIndex[i] === problemLetter) {
        if (team.isProblemSolved[i] !== 0) {
          return false;
        }
        for (let j = 0; j < submissionWhenFrozen.length; j++) {
          if (
            submissionWhenFrozen[j].teamName === team.name &&
            submissionWhenFrozen[j].problem === problemLetter
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  isAPendingProblemOnThisRow(problemLetter) {
    let team = this.props.team;
    let savedCurrentFrozenSubmission = this.props.savedCurrentFrozenSubmission;
    if (
      savedCurrentFrozenSubmission === undefined ||
      savedCurrentFrozenSubmission === null ||
      savedCurrentFrozenSubmission.length === 0
    ) {
      return false;
    }
    for (let i = 0; i < this.props.numberOfProblems; i++) {
      if (this.props.problemsIndex[i] === problemLetter) {
        if (team.isProblemSolved[i] !== 0) {
          return false;
        }
        if (
          savedCurrentFrozenSubmission.teamName === team.name &&
          savedCurrentFrozenSubmission.problem === problemLetter
        ) {
          return true;
        }
      }
    }
    return false;
  }

  isACurrentFrozenProblem(problemLetter) {
    if (this.props.currentFrozenSubmission === null) {
      return false;
    }
    if (
      this.props.currentFrozenSubmission.teamName === this.props.team.name &&
      problemLetter === this.props.currentFrozenSubmission.problem
    ) {
      return true;
    }
    return false;
  }

  thisRowShhouldBeSelected(problems) {
    return (
      this.props.classNameForThisRow !== null &&
      this.props.classNameForThisRow !== undefined &&
      this.props.classNameForThisRow.length !== 0
    );
  }

  render() {
    let problems = this.props.problemsIndex;

    let sizeProblem = 84.0 / this.props.numberOfProblems;
    let widthPercentage = sizeProblem + "%";

    let problemColumns = problems.map(problemLetter => {
      let verdict = "NoAttempted";
      let textToShowInProblem = problemLetter;

      if (this.hasSolvedProblem(problemLetter) === true) {
        if (this.isFirstToSolve(problemLetter) === true) {
          verdict = "FirstAccepted";
        } else {
          verdict = "Accepted";
        }
        textToShowInProblem = this.numberOfTriesOnAcceptedProblem(problemLetter);
      } else if (this.isACurrentFrozenProblem(problemLetter) === true) {
        verdict = "Resolving";
        textToShowInProblem = this.numberOfTriesOnFrozenProblem(problemLetter);
      } else if (this.isAPendingProblem(problemLetter) === true) {
        verdict = "Pending";
        textToShowInProblem = this.numberOfTriesOnFrozenProblem(problemLetter);
      } else if (this.hasTriedProblem(problemLetter) === true) {
        verdict = "WrongAnswer";
        textToShowInProblem = this.numberOfTriesOnTriedProblem(problemLetter);
      }

      return {
        key: problemLetter,
        letter: problemLetter,
        width: widthPercentage,
        problemStatus: verdict,
        displayText: textToShowInProblem,
      };
    });

    let classNameForEachRow = "scoreboardTableGrayRow";
    if (this.thisRowShhouldBeSelected(problems) === true) {
      classNameForEachRow += this.props.classNameForThisRow;
    } else if (this.props.index % 2 !== 0) {
      classNameForEachRow = "scoreboardTableBlackRow";
    }

    return (
      <div className={"tableRow " + classNameForEachRow} id={this.props.team.id}>
        {/*Rank*/}
        <span className="tableRow-Rank">{this.props.team.position}</span>
        {/*Photo*/}
        <img className="tableRow-Picture" src={this.getImageForTeam(this.props.team.id)} alt="" />
        {/*Name+Problems*/}
        <div className="tableRow-TeamData">
          {/*ContestantName*/}
          <span className="tableRox-TeamName">{this.props.team.name}</span>
          {/*Problem Boxes*/}
          <div className="tableRox-Problems">
            {problemColumns.map(problemData => {
              return <ProblemBox {...problemData} />;
            })}
          </div>
        </div>
        {/*ProblemsSolved*/}
        <span className="tableRow-ResolvedProblems">{this.props.team.solved}</span>
        {/*Penalty*/}
        <span className="tableRow-Penalty">{this.props.team.penalty}</span>
        {/*
        <div
          dangerouslySetInnerHTML={{ __html: this.props.team.name }}
          className="scoreboardTableColumnTeamName"
          key="team"
        ></div>
        <span className="scoreboardTableProblemRowFirstChild">
          {}
        </span>
        <span className=""></span>
        <span className=""></span>
		*/}
      </div>
    );
  }
}

export default TableRow;
