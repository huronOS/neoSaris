import React, { useEffect, useRef } from "react";

import FlipMove from "react-flip-move";

import TableItem from "./TableItem";
import Header from "./Header";
import { ContestData } from "../parsers/raw-json-parser";

import "./Scoreboard.css";

function getSubmissions(submissionsData: ContestData) {
  const duration = submissionsData.Contest.Duration;
  const frozen = submissionsData.Contest.FrozenTime;

  return submissionsData.Submissions
    .filter(submission => submission.timeSubmission < duration - frozen)
    .map(submission => (
      {
        teamName: submission.TeamName,
        timeSubmission: submission.timeSubmission,
        verdict: submission.Verdict,
        problem: submission.Problem
      }
    ))
}

export type Submission = ReturnType<typeof getSubmissions>[number];

const Scoreboard: React.FC<{ submissionsData: ContestData }> = (props) => {
  function getInitialState() {
    const teams = Object.entries(props.submissionsData.Teams ?? {}).map((team, i) => {
      const triesOnProblems = [];
      const isProblemSolved = [];
      const penaltyOnProblem = [];
      const isFirstToSolve = [];

      for (let j = 0; j < props.submissionsData.Contest.NumberOfProblems; j++) {
        isProblemSolved.push(0);
        isFirstToSolve.push(0);
        triesOnProblems.push(0);
        penaltyOnProblem.push(0);
      }

      return {
        position: 0,
        name: team[1],
        id: team[0],
        penalty: 0,
        solved: 0,
        isProblemSolved: isProblemSolved,
        isFirstToSolve: isFirstToSolve,
        triesOnProblems: triesOnProblems,
        penaltyOnProblem: penaltyOnProblem,
      }
    });

    const verdictsWithoutPenalty = Object
      .entries(props.submissionsData.VerdictWithoutPenalty ?? {})
      .map((verdict) => verdict[1]);

    const submissions = getSubmissions(props.submissionsData);
    submissions.sort((a, b) => a.timeSubmission - b.timeSubmission);

    let submissionWhenFrozen = getSubmissionsWhenFrozen(
      props.submissionsData,
      verdictsWithoutPenalty
    );

    submissionWhenFrozen = submissionWhenFrozen.sort((a, b) => a.timeSubmission - b.timeSubmission);

    let idOfNextUserRowHighlighted = -1;
    if (teams !== null && teams !== undefined) {
      idOfNextUserRowHighlighted = teams.length - 1;
    }

    return {
      submissions: submissions,
      submissionWhenFrozen: submissionWhenFrozen,
      contestDuration: props.submissionsData.Contest.Duration,
      contestFrozenTime: props.submissionsData.Contest.FrozenTime,
      numberOfProblems: props.submissionsData.Contest.NumberOfProblems,
      teams: teams,
      verdictsWithoutPenalty: verdictsWithoutPenalty,
      currentFrozenSubmission: null as Submission | null,
      savedCurrentFrozenSubmission: null as Submission | null,
      savedCurrentFrozenSubmissionId: null as number | null,
      idOfNextUserRowHighlighted: idOfNextUserRowHighlighted,
      hasUserFinishedSubmissions: false,
      isPressedKeyOn: 0,
      hasNotBeenScrolled: false,
      teamNameToSelect: null as string | null,
      standingHasChangedInLastOperation: false,
      lastPositionInStanding: {} as { [key: string]: string },
    };
  }

  type State = ReturnType<typeof getInitialState>;
  const [state, setState] = React.useState(getInitialState);



  function getSubmissionsWhenFrozen(submissionsData: ContestData, verdictsWithoutPenalty: Array<string>) {
    const duration = submissionsData.Contest.Duration;
    const frozen = submissionsData.Contest.FrozenTime;

    return submissionsData.Submissions
      .filter(submission => submission.timeSubmission >= duration - frozen && submission.timeSubmission < duration)
      .filter(submission => !verdictsWithoutPenalty.includes(submission.Verdict))
      .map(submission => (
        {
          teamName: submission.TeamName,
          timeSubmission: submission.timeSubmission,
          verdict: submission.Verdict,
          problem: submission.Problem
        }
      ))
  };

  const resetTeams = (teams: State["teams"]) => {
    return teams.map(team => {
      team.position = 0;
      team.penalty = 0;
      team.solved = 0;
      for (let j = 0; j < state.numberOfProblems; j++) {
        team.isProblemSolved[j] = 0;
        team.isFirstToSolve[j] = 0;
        team.triesOnProblems[j] = 0;
        team.penaltyOnProblem[j] = 0;
      }

      return team;
    })
  }

  const resetSubmissions = () => {
    setState({ ...state, teams: resetTeams(state.teams) });
  }

  const addSubmissionsTo = (teams: State["teams"], submissions: State["submissions"]) => {
    const problemHasBeenSolved = [];
    for (let i = 0; i < state.numberOfProblems; i++) {
      problemHasBeenSolved.push(0);
    }

    for (const element of submissions) {
      const submission = element;
      if (
        state.verdictsWithoutPenalty.includes(submission.verdict) === true
      ) {
        continue;
      } else if (submission.verdict === "Accepted") {
        // Update accepted problem only if has not been accepted before.
        for (const element of teams) {
          if (element.name === submission.teamName) {
            for (let j = 0; j < state.numberOfProblems; j++) {
              const problemLetter =
                props.submissionsData.Contest.ProblemsIndex[j];
              if (
                problemLetter === submission.problem &&
                element.isProblemSolved[j] === 0
              ) {
                element.isProblemSolved[j] = 1;
                element.penaltyOnProblem[j] = submission.timeSubmission;
                element.penalty +=
                  submission.timeSubmission + element.triesOnProblems[j] * 20;
                element.solved++;
                if (problemHasBeenSolved[j] === 0) {
                  problemHasBeenSolved[j] = 1;
                  element.isFirstToSolve[j] = 1;
                }
                break;
              }
            }
            break;
          }
        }
      } else {
        // Update penalty problem only if has not been accepted before.
        for (const element of teams) {
          if (element.name === submission.teamName) {
            for (let j = 0; j < state.numberOfProblems; j++) {
              const problemLetter =
                props.submissionsData.Contest.ProblemsIndex[j];
              if (
                problemLetter === submission.problem &&
                element.isProblemSolved[j] === 0
              ) {
                element.triesOnProblems[j]++;
                break;
              }
            }
            break;
          }
        }
      }
    }
    return teams;
  }

  const sortTeams = (teams: State["teams"]) => {
    teams.sort((a, b) => (a.solved !== b.solved) ? b.solved - a.solved : a.penalty - b.penalty);
    const teamsSorted = teams;

    let position = 1;
    for (let i = 0; i < teamsSorted.length; i++) {
      if (i > 0 &&
        (teamsSorted[i].solved !== teamsSorted[i - 1].solved ||
          teamsSorted[i].penalty !== teamsSorted[i - 1].penalty)
      ) {
        position++;
      }
      teamsSorted[i].position = position;
    }
    return teamsSorted;
  }

  const sortTeamsByStandingPosition = () => {
    const submissions = state.submissions;
    submissions.sort((a, b) => a.timeSubmission - b.timeSubmission);

    const submissionWhenFrozen = state.submissionWhenFrozen;
    submissionWhenFrozen.sort(function (a, b) {
      return a.timeSubmission - b.timeSubmission;
    });

    setState({
      ...state,
      submissions: submissions,
      submissionWhenFrozen: submissionWhenFrozen,
    });
    const teamsSorted = sortTeams(state.teams);
    setState({ ...state, teams: teamsSorted });
  }

  const addSubmissions = () => {
    const teams = addSubmissionsTo(state.teams, state.submissions);
    setState({ ...state, teams: teams });
  }

  const updateScoreboard = () => {
    resetSubmissions();
    addSubmissions();
    sortTeamsByStandingPosition();
  }

  const updatePositionOfStandings = () => {
    let lastPositionInStanding = {} as State["lastPositionInStanding"];
    for (let i = 0; i < state.teams.length; i++) {
      lastPositionInStanding[i] = state.teams[i].name;
    }
    setState({ ...state, lastPositionInStanding: lastPositionInStanding });
  }

  const standingRemainsStatic = () => {
    for (let i = 0; i < state.teams.length; i++) {
      if (state.lastPositionInStanding[i] !== state.teams[i].name) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    updateScoreboard();
    updatePositionOfStandings();
    cleanSubmissions();
  }, []);

  const getScoreboard = () => {
    return state.teams.map((team, i) => {
      let classNameForThisRow = "";
      if (
        state.isPressedKeyOn === 1 &&
        state.idOfNextUserRowHighlighted === i
      ) {
        if (state.hasUserFinishedSubmissions === true) {
          classNameForThisRow += " scoreboardTableSelectedRowFinished";
        } else {
          classNameForThisRow += " scoreboardTableSelectedRow";
        }
      } else if (
        state.isPressedKeyOn === 0 &&
        state.teamNameToSelect === team.name
      ) {
        if (state.standingHasChangedInLastOperation === false) {
          classNameForThisRow += " scoreboardTableSelectedRowFinished";
        } else {
          classNameForThisRow += " scoreboardTableSelectedRow";
        }
      }
      return (
        <TableItem
          key={team.id}
          index={i}
          team={team}
          numberOfProblems={state.numberOfProblems}
          problemsIndex={props.submissionsData.Contest.ProblemsIndex}
          submissionWhenFrozen={state.submissionWhenFrozen}
          currentFrozenSubmission={state.savedCurrentFrozenSubmission}
          savedCurrentFrozenSubmission={state.currentFrozenSubmission}
          classNameForThisRow={classNameForThisRow}
        />
      );
    });
  }

  const getProblemId = (problemLetter: string) => {
    let problemId = -1;
    for (let h = 0; h < state.numberOfProblems; h++) {
      if (
        props.submissionsData.Contest.ProblemsIndex[h] === problemLetter
      ) {
        problemId = h;
      }
    }
    return problemId;
  }

  const cleanSubmissions = () => {
    const teams = state.teams;
    const submissionWhenFrozen = state.submissionWhenFrozen;
    const newSubmissionWhenFrozen = [];

    for (const submission of submissionWhenFrozen) {
      const problemId = getProblemId(submission.problem);
      if (problemId === -1) {
        continue;
      }
      for (const element of teams) {
        if (
          element.name === submission.teamName &&
          element.isProblemSolved[problemId] === 0
        ) {
          newSubmissionWhenFrozen.push(submission);
          break;
        }
      }
    }
    setState({ ...state, submissionWhenFrozen: newSubmissionWhenFrozen });
  }

  const updateCurrenFrozenSubmission = () => {
    if (state.savedCurrentFrozenSubmission === null) {
      const currentFrozenSubmission = state.currentFrozenSubmission;
      setState({ ...state, savedCurrentFrozenSubmission: currentFrozenSubmission });
    } else {
      setState({ ...state, savedCurrentFrozenSubmission: null });
    }
  }

  const nextSubmission = (idOfNextUserRowHighlighted: number, submissionWhenFrozen: State["submissionWhenFrozen"], teams: State["teams"]) => {
    let submissionToRevealId = -1;
    for (let i = teams.length - 1; i >= 0 && submissionToRevealId === -1; i--) {
      for (let j = 0; j < submissionWhenFrozen.length; j++) {
        const problemId = getProblemId(submissionWhenFrozen[j].problem);
        if (problemId === -1) {
          continue;
        }

        if (
          submissionWhenFrozen[j].teamName === teams[i].name &&
          idOfNextUserRowHighlighted === i
        ) {
          submissionToRevealId = j;
          break;
        }
      }
    }
    return submissionToRevealId;
  }

  const intervalPendingSubmission = useRef(null as number | null);
  const findNextSubmissionToReveal = () => {
    if (state.currentFrozenSubmission !== null) {
      const idToRemove = state.savedCurrentFrozenSubmissionId;
      const submissions = state.submissions;
      const submissionWhenFrozen = state.submissionWhenFrozen;

      if (idToRemove != null && idToRemove < submissionWhenFrozen.length) {
        submissions.push(submissionWhenFrozen[idToRemove]);
        submissionWhenFrozen.splice(idToRemove, 1);
      }

      setState({
        ...state,
        submissions: submissions,
        submissionWhenFrozen: submissionWhenFrozen,
        currentFrozenSubmission: null,
        savedCurrentFrozenSubmission: null,
        savedCurrentFrozenSubmissionId: null,
      });
      updateScoreboard();
      const idOfNextUserRowHighlighted = state.idOfNextUserRowHighlighted;

      if (
        nextSubmission(
          idOfNextUserRowHighlighted,
          submissionWhenFrozen,
          state.teams
        ) === -1 &&
        state.idOfNextUserRowHighlighted >= 0 &&
        standingRemainsStatic() === true
      ) {
        const teamNameToSelect =
          state.teams[state.idOfNextUserRowHighlighted].name;
        setState({
          ...state,
          teamNameToSelect: teamNameToSelect,
          standingHasChangedInLastOperation: false,
        });
      } else if (
        state.idOfNextUserRowHighlighted >= 0 &&
        standingRemainsStatic() === false
      ) {
        const teamNameToSelect =
          state.lastPositionInStanding[
          state.idOfNextUserRowHighlighted
          ];
        updatePositionOfStandings();
        setState({
          ...state,
          teamNameToSelect: teamNameToSelect,
          standingHasChangedInLastOperation: true,
        });
      }

      intervalPendingSubmission.current && clearInterval(intervalPendingSubmission.current);
      return;
    }

    if (state.hasUserFinishedSubmissions === true) {
      const idOfNextUserRowHighlighted =
        state.idOfNextUserRowHighlighted - 1;
      setState({
        ...state,
        hasUserFinishedSubmissions: false,
        idOfNextUserRowHighlighted: idOfNextUserRowHighlighted,
      });
      return;
    }

    cleanSubmissions();

    const submissionWhenFrozen = state.submissionWhenFrozen;
    const submissionToRevealId = nextSubmission(
      state.idOfNextUserRowHighlighted,
      submissionWhenFrozen,
      state.teams
    );

    if (submissionToRevealId !== -1) {
      setState({
        ...state,
        currentFrozenSubmission: submissionWhenFrozen[submissionToRevealId],
        savedCurrentFrozenSubmission:
          submissionWhenFrozen[submissionToRevealId],
        savedCurrentFrozenSubmissionId: submissionToRevealId,
      });
      intervalPendingSubmission.current = setInterval(
        () => updateCurrenFrozenSubmission(),
        500
      );
    } else if (state.idOfNextUserRowHighlighted >= 0) {
      setState({ ...state, hasUserFinishedSubmissions: true });
    }
  }

  const revealUntilTop = (topTeams: number) => {
    let teams = state.teams;
    const submissions = state.submissions;
    const submissionWhenFrozen = state.submissionWhenFrozen;
    let idOfNextUserRowHighlighted = state.idOfNextUserRowHighlighted;

    while (idOfNextUserRowHighlighted >= topTeams) {
      const idToRemove = nextSubmission(
        idOfNextUserRowHighlighted,
        submissionWhenFrozen,
        teams
      );
      if (idToRemove !== -1) {
        submissions.push(submissionWhenFrozen[idToRemove]);
        submissionWhenFrozen.splice(idToRemove, 1);
        teams = resetTeams(teams);
        teams = addSubmissionsTo(teams, submissions);
        teams = sortTeams(teams);
      } else if (idToRemove === -1) {
        idOfNextUserRowHighlighted--;
      }
    }

    updateScoreboard();
    updatePositionOfStandings();
    setState({
      ...state,
      submissions: submissions,
      submissionWhenFrozen: submissionWhenFrozen,
      currentFrozenSubmission: null,
      savedCurrentFrozenSubmission: null,
      savedCurrentFrozenSubmissionId: null,
      idOfNextUserRowHighlighted: idOfNextUserRowHighlighted,
      hasUserFinishedSubmissions: false,
      isPressedKeyOn: 0,
      hasNotBeenScrolled: false,
      teamNameToSelect: null,
      standingHasChangedInLastOperation: false,
    });
  }

  const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "1") {
      // Leave pending Top 10
      revealUntilTop(10);
    } else if (e.key === "2") {
      // Unfroze scoreboard.
      revealUntilTop(0);
    } else if (e.key === "3") {
      if (
        state.isPressedKeyOn === 0 &&
        state.teamNameToSelect !== null
      ) {
        let idOfNextUserRowHighlighted = state.idOfNextUserRowHighlighted;
        if (state.standingHasChangedInLastOperation === false) {
          idOfNextUserRowHighlighted = Math.max(
            idOfNextUserRowHighlighted - 1,
            -1
          );
        }
        setState({
          ...state,
          teamNameToSelect: null,
          standingHasChangedInLastOperation: false,
          idOfNextUserRowHighlighted: idOfNextUserRowHighlighted,
        });
      } else {
        findNextSubmissionToReveal();
        const isPressedKeyOn = 1 - state.isPressedKeyOn;
        setState({
          ...state,
          isPressedKeyOn: isPressedKeyOn,
          hasNotBeenScrolled: false,
        });
        scrollToElementSelected();
      }
    }
  }

  const scrollToElementSelected = () => {
    if (
      state.isPressedKeyOn === 0 &&
      state.idOfNextUserRowHighlighted !== -1 &&
      state.hasNotBeenScrolled === false
    ) {
      const id = state.teams[state.idOfNextUserRowHighlighted].id;
      const element = document.getElementById(id);
      if (element) window.scrollTo(0, element.offsetTop);
      setState({ ...state, hasNotBeenScrolled: true });
    }
  }


  return (
    <div
      id="score"
      className={"scoreboardTable"}
      tabIndex={0}
      onKeyDown={(e) => keyDownHandler(e)}
    >
      <div>
        <Header title={props.submissionsData.Contest.Name} />
        <FlipMove staggerDurationBy="30" duration={900}>
          {getScoreboard()}
        </FlipMove>
      </div>
    </div>
  );
}

export default Scoreboard;
