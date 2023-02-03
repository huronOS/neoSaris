import React, { forwardRef } from "react";

import defaultImg from "../media/university_logos/default.png";
import cecyt13 from "../media/university_logos/cecyt13.png";
import chapingo from "../media/university_logos/chapingo.png";
import escom from "../media/university_logos/escom.png";
import itcg from "../media/university_logos/itcg.png";
import uam from "../media/university_logos/uam.png";
import ug from "../media/university_logos/ug.png";
import umsa from "../media/university_logos/umsa.png";
import { ContestData } from "../parsers/raw-json-parser";
import { Submission } from "./Scoreboard";

const images = { cecyt13, chapingo, escom, itcg, uam, ug, umsa };

type Props = {
  index: number
  team: any,
  numberOfProblems: number
  problemsIndex: ContestData["Contest"]["ProblemsIndex"]
  submissionWhenFrozen: Array<Submission>,
  currentFrozenSubmission: Submission | null,
  savedCurrentFrozenSubmission: Submission | null,
  classNameForThisRow: string,
};


const TableItem = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const getImageForTeam = (name: keyof typeof images) => images[name] ?? defaultImg;

  function numberOfTriesOnAcceptedProblem(problemLetter: string) {
    let team = props.team;
    for (let i = 0; i < props.numberOfProblems; i++) {
      if (props.problemsIndex[i] === problemLetter) {
        return team.triesOnProblems[i] + 1 + " - " + team.penaltyOnProblem[i];
      }
    }
    return problemLetter;
  }

  function numberOfTriesOnTriedProblem(problemLetter: string) {
    let team = props.team;
    for (let i = 0; i < props.numberOfProblems; i++) {
      if (props.problemsIndex[i] === problemLetter) {
        return team.triesOnProblems[i] + " - " + team.penaltyOnProblem[i];
      }
    }
    return problemLetter;
  }

  function numberOfTriesOnFrozenProblem(problemLetter: string) {
    let team = props.team;
    let submissionWhenFrozen = props.submissionWhenFrozen;
    if (
      submissionWhenFrozen === undefined ||
      submissionWhenFrozen === null ||
      submissionWhenFrozen?.length === 0
    ) {
      return problemLetter;
    }
    for (let i = 0; i < props.numberOfProblems; i++) {
      if (props.problemsIndex[i] === problemLetter) {
        if (team.isProblemSolved[i] !== 0) {
          return problemLetter;
        }
        for (const element of submissionWhenFrozen) {
          if (
            element.teamName === team.name &&
            element.problem === problemLetter
          ) {
            return (
              team.triesOnProblems[i] +
              1 +
              " - " +
              element.timeSubmission
            );
          }
        }
      }
    }
    return problemLetter;
  }

  function hasSolvedProblem(problemLetter: string) {
    let team = props.team;
    for (let i = 0; i < props.numberOfProblems; i++) {
      if (props.problemsIndex[i] === problemLetter) {
        if (team.isProblemSolved[i] === 0) {
          return false;
        } else {
          return true;
        }
      }
    }
    return false;
  }

  function hasTriedProblem(problemLetter: string) {
    let team = props.team;
    for (let i = 0; i < props.numberOfProblems; i++) {
      if (props.problemsIndex[i] === problemLetter) {
        if (team.triesOnProblems[i] !== 0) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  function isFirstToSolve(problemLetter: string) {
    let team = props.team;
    for (let i = 0; i < props.numberOfProblems; i++) {
      if (props.problemsIndex[i] === problemLetter) {
        if (team.isFirstToSolve[i] !== 0) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  function isAPendingProblem(problemLetter: string) {
    let team = props.team;
    let submissionWhenFrozen = props.submissionWhenFrozen;
    if (
      submissionWhenFrozen === undefined ||
      submissionWhenFrozen.length === 0
    ) {
      return false;
    }
    for (let i = 0; i < props.numberOfProblems; i++) {
      if (props.problemsIndex[i] === problemLetter) {
        if (team.isProblemSolved[i] !== 0) {
          return false;
        }
        for (const element of submissionWhenFrozen) {
          if (
            element.teamName === team.name &&
            element.problem === problemLetter
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function isAPendingProblemOnThisRow(problemLetter: string) {
    let team = props.team;
    let savedCurrentFrozenSubmission = props.savedCurrentFrozenSubmission;
    if (
      savedCurrentFrozenSubmission === undefined ||
      savedCurrentFrozenSubmission === null
    ) {
      return false;
    }
    for (let i = 0; i < props.numberOfProblems; i++) {
      if (props.problemsIndex[i] === problemLetter) {
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

  function isACurrentFrozenProblem(problemLetter: string) {
    if (props.currentFrozenSubmission === null) {
      return false;
    }
    return !!(props.currentFrozenSubmission.teamName === props.team.name &&
      problemLetter === props.currentFrozenSubmission.problem);
  }

  function thisRowShhouldBeSelected(problems: ContestData["Contest"]["ProblemsIndex"]) {
    return (
      props.classNameForThisRow !== null &&
      props.classNameForThisRow !== undefined &&
      props.classNameForThisRow.length !== 0
    );
  }


  let problems = props.problemsIndex;

  let sizeProblem = 80.0 / props.numberOfProblems;
  let widthPercentage = sizeProblem + "%";

  let problemColumns = problems.map((problemLetter) => {
    let verdict = "scoreboardTableColumnProblemDefault";
    let textToShowInProblem = problemLetter;

    if (hasSolvedProblem(problemLetter) === true) {
      if (isFirstToSolve(problemLetter) === true) {
        verdict = "scoreboardTableColumnProblemFirstToSolve";
      } else {
        verdict = "scoreboardTableColumnProblemAccepted";
      }
      textToShowInProblem =
        numberOfTriesOnAcceptedProblem(problemLetter);
    } else if (isACurrentFrozenProblem(problemLetter) === true) {
      verdict = "scoreboardTableColumnProblemCurrentPending";
      textToShowInProblem = numberOfTriesOnFrozenProblem(problemLetter);
    } else if (isAPendingProblem(problemLetter) === true) {
      verdict = "scoreboardTableColumnProblemPending";
      textToShowInProblem = numberOfTriesOnFrozenProblem(problemLetter);
    } else if (hasTriedProblem(problemLetter) === true) {
      verdict = "scoreboardTableColumnProblemTried";
      textToShowInProblem = numberOfTriesOnTriedProblem(problemLetter);
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
  if (thisRowShhouldBeSelected(problems) === true) {
    classNameForEachRow += props.classNameForThisRow;
  } else if (props.index % 2 !== 0) {
    classNameForEachRow = "scoreboardTableBlackRow";
  }

  return (
    <div
      ref={ref}
      className={"scoreboardTableRow " + classNameForEachRow}
    >
      <div
        dangerouslySetInnerHTML={{ __html: props.team.name }}
        className="scoreboardTableColumnTeamName"
        key="team"
      ></div>
      <span className="scoreboardTableColumnRank">
        {props.team.position}
      </span>
      <img
        className="scoreboardTableColumnTeamPicture"
        src={getImageForTeam(props.team.id)}
        alt=""
      />
      <span className="scoreboardTableProblemRowFirstChild">
        {problemColumns}
      </span>
      <span className="end">
        <span className="scoreboardTableColumnSolved">
          {props.team.solved}
        </span>
        <span className="scoreboardTableColumnTime">
          {props.team.penalty}
        </span>
      </span>
    </div>
  );
}
)


export default TableItem;
