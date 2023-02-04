import React, { Component } from "react";
var logos = require.context("../media/university_logos", true);

class TableItem extends Component {
  getImageForTeam(url) {
    let imgSrc = logos("./default.png");
    try {
      imgSrc = logos("./" + url + ".png");
      return imgSrc;
    } catch (err) {}
    return imgSrc;
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

    let sizeProblem = 80.0 / this.props.numberOfProblems;
    let widthPercentage = sizeProblem + "%";

    let problemColumns = problems.map(problemLetter => {
      let verdict = "scoreboardTableColumnProblemDefault";
      let textToShowInProblem = problemLetter;

      if (this.hasSolvedProblem(problemLetter) === true) {
        if (this.isFirstToSolve(problemLetter) === true) {
          verdict = "scoreboardTableColumnProblemFirstToSolve";
        } else {
          verdict = "scoreboardTableColumnProblemAccepted";
        }
        textToShowInProblem = this.numberOfTriesOnAcceptedProblem(problemLetter);
      } else if (this.isACurrentFrozenProblem(problemLetter) === true) {
        verdict = "scoreboardTableColumnProblemCurrentPending";
        textToShowInProblem = this.numberOfTriesOnFrozenProblem(problemLetter);
      } else if (this.isAPendingProblem(problemLetter) === true) {
        verdict = "scoreboardTableColumnProblemPending";
        textToShowInProblem = this.numberOfTriesOnFrozenProblem(problemLetter);
      } else if (this.hasTriedProblem(problemLetter) === true) {
        verdict = "scoreboardTableColumnProblemTried";
        textToShowInProblem = this.numberOfTriesOnTriedProblem(problemLetter);
      }

      return (
        <span
          className={"scoreboardTableColumnProblem " + verdict}
          style={{ width: widthPercentage }}
          key={problemLetter}
        >
          {textToShowInProblem}
        </span>
      );
    });

    let classNameForEachRow = "scoreboardTableGrayRow";
    if (this.thisRowShhouldBeSelected(problems) === true) {
      classNameForEachRow += this.props.classNameForThisRow;
    } else if (this.props.index % 2 !== 0) {
      classNameForEachRow = "scoreboardTableBlackRow";
    }

    return (
      <div className={"scoreboardTableRow " + classNameForEachRow} id={this.props.team.id}>
        <div
          dangerouslySetInnerHTML={{ __html: this.props.team.name }}
          className="scoreboardTableColumnTeamName"
          key="team"
        ></div>
        <span className="scoreboardTableColumnRank">{this.props.team.position}</span>
        <img
          className="scoreboardTableColumnTeamPicture"
          src={this.getImageForTeam(this.props.team.id)}
          alt=""
        />
        <span className="scoreboardTableProblemRowFirstChild">{problemColumns}</span>
        <span className="scoreboardTableColumnTime">{this.props.team.penalty}</span>
        <span className="scoreboardTableColumnSolved">{this.props.team.solved}</span>
      </div>
    );
  }
}

export default TableItem;
