import React, { Component } from "react";
import FlipMove from "react-flip-move";
import TableRow from "./TableRow";
import Header from "./Header";
import "./Scoreboard.css";
import { ContestData, Submission } from "../../types/contestDataTypes";
import { Team } from "../../types/scoreboardDataTypes";
var intervalPendingSubmission: number | null = null;

interface IProps {
  submissionsData: ContestData;
}

interface IState {
  submissions: Array<Submission>;
  submissionWhenFrozen: Array<Submission>;
  contestDuration: number;
  contestFrozenTime: number;
  numberOfProblems: number;
  teams: Array<Team>;
  verdictsWithoutPenalty: Array<String>;
  currentFrozenSubmission: Submission | null;
  savedCurrentFrozenSubmission: Submission | null;
  savedCurrentFrozenSubmissionId: number | null;
  idOfNextUserRowHighlighted: number;
  hasUserFinishedSubmissions: boolean;
  isPressedKeyOn: number;
  hasNotBeenScrolled: boolean;
  contestantNameToSelect: string | null;
  standingHasChangedInLastOperation: boolean;
  lastPositionInStanding: Array<string>;
}

class Scoreboard extends Component<IProps, IState> {
  getSubmissions(submissionsData: ContestData) {
    let submissionsOnContest: Array<Submission> = [];
    submissionsData.submissions.forEach(function (submission) {
      if (
        submission.timeSubmitted <
        submissionsData.contestMetadata.duration -
          submissionsData.contestMetadata.frozenTimeDuration
      ) {
        let result: Submission = {} as Submission;
        result.contestantName = submission.contestantName;
        result.timeSubmitted = submission.timeSubmitted;
        result.verdict = submission.verdict;
        result.problemIndex = submission.problemIndex;
        submissionsOnContest.push(result);
      }
    });
    return submissionsOnContest;
  }

  getSubmissionsWhenFrozen(submissionsData: ContestData) {
    let submissionsOnFrozen: Array<Submission> = [];
    submissionsData.submissions.forEach(function (submission) {
      if (
        submission.timeSubmitted >=
          submissionsData.contestMetadata.duration -
            submissionsData.contestMetadata.frozenTimeDuration &&
        submission.timeSubmitted <= submissionsData.contestMetadata.duration
      ) {
        let result: Submission = {} as Submission;
        result.contestantName = submission.contestantName;
        result.timeSubmitted = submission.timeSubmitted;
        result.verdict = submission.verdict;
        result.problemIndex = submission.problemIndex;
        if (submissionsData.verdicts.wrongAnswerWithoutPenalty.includes(result.verdict) === false) {
          submissionsOnFrozen.push(result);
        }
      }
    });
    return submissionsOnFrozen;
  }

  resetTeams(teams: Array<Team>) {
    for (let i = 0; i < teams.length; i++) {
      teams[i].position = 0;
      teams[i].penalty = 0;
      teams[i].solved = 0;
      for (let j = 0; j < this.state.numberOfProblems; j++) {
        teams[i].isProblemSolved[j] = 0;
        teams[i].isFirstToSolve[j] = 0;
        teams[i].triesOnProblems[j] = 0;
        teams[i].penaltyOnProblem[j] = 0;
      }
    }
    return teams;
  }

  resetSubmissions() {
    let teams = this.resetTeams(this.state.teams);
    this.setState({ teams: teams });
  }

  addSubmissionsTo(teams: Array<Team>, submissions: Array<Submission>) {
    let problemHasBeenSolved: Array<number> = [];
    for (let i = 0; i < this.state.numberOfProblems; i++) {
      problemHasBeenSolved.push(0);
    }

    for (let h = 0; h < submissions.length; h++) {
      let submission = submissions[h];
      //Wrong Answer without penalty
      if (
        this.props.submissionsData.verdicts.wrongAnswerWithoutPenalty.includes(submission.verdict)
      ) {
        continue;
      } else if (this.props.submissionsData.verdicts.accepted.includes(submission.verdict)) {
        // Update accepted problem only if has not been accepted before.
        for (let i = 0; i < teams.length; i++) {
          if (teams[i].name === submission.contestantName) {
            for (let j = 0; j < this.state.numberOfProblems; j++) {
              let problemLetter = this.props.submissionsData.problems[j].index;
              if (problemLetter === submission.problemIndex && teams[i].isProblemSolved[j] === 0) {
                teams[i].isProblemSolved[j] = 1;
                teams[i].penaltyOnProblem[j] = submission.timeSubmitted;
                teams[i].penalty += submission.timeSubmitted + teams[i].triesOnProblems[j] * 20;
                teams[i].solved++;
                if (problemHasBeenSolved[j] === 0) {
                  problemHasBeenSolved[j] = 1;
                  teams[i].isFirstToSolve[j] = 1;
                }
                break;
              }
            }
            break;
          }
        }
      } else {
        // Update penalty problem only if has not been accepted before.
        for (let i = 0; i < teams.length; i++) {
          if (teams[i].name === submission.contestantName) {
            for (let j = 0; j < this.state.numberOfProblems; j++) {
              let problemLetter = this.props.submissionsData.problems[j].index;
              if (problemLetter === submission.problemIndex && teams[i].isProblemSolved[j] === 0) {
                teams[i].triesOnProblems[j]++;
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

  sortTeams(teams: Array<Team>) {
    let teamsSorted = teams.sort(function (a, b) {
      if (a.solved !== b.solved) {
        return b.solved - a.solved;
      }
      return a.penalty - b.penalty;
    });

    let position = 1;
    for (var i = 0; i < teamsSorted.length; i++) {
      if (
        i > 0 &&
        (teamsSorted[i].solved !== teamsSorted[i - 1].solved ||
          teamsSorted[i].penalty !== teamsSorted[i - 1].penalty)
      ) {
        position++;
      }
      teamsSorted[i].position = position;
    }
    return teamsSorted;
  }

  sortTeamsByStandingPosition() {
    let submissions = this.state.submissions;
    submissions = submissions.sort(function (a, b) {
      return a.timeSubmitted - b.timeSubmitted;
    });

    let submissionWhenFrozen = this.state.submissionWhenFrozen;
    submissionWhenFrozen = submissionWhenFrozen.sort(function (a, b) {
      return a.timeSubmitted - b.timeSubmitted;
    });

    this.setState({
      submissions: submissions,
      submissionWhenFrozen: submissionWhenFrozen,
    });
    let teamsSorted = this.sortTeams(this.state.teams);
    this.setState({ teams: teamsSorted });
  }

  addSubmissions() {
    let teams = this.addSubmissionsTo(this.state.teams, this.state.submissions);
    this.setState({ teams: teams });
  }

  updateScoreboard() {
    this.resetSubmissions();
    this.addSubmissions();
    this.sortTeamsByStandingPosition();
  }

  updatePositionOfStandings() {
    let lastPositionInStanding: Array<string> = {} as Array<string>;
    for (let i = 0; i < this.state.teams.length; i++) {
      lastPositionInStanding[i] = this.state.teams[i].name;
    }
    this.setState({ lastPositionInStanding: lastPositionInStanding });
  }

  standingRemainsStatic() {
    for (let i = 0; i < this.state.teams.length; i++) {
      if (this.state.lastPositionInStanding[i] !== this.state.teams[i].name) {
        return false;
      }
    }
    return true;
  }

  componentDidMount() {
    this.updateScoreboard();
    this.updatePositionOfStandings();
    this.cleanSubmissions();
  }

  constructor(props: IProps) {
    super(props);
    let teams = props.submissionsData.contestants.map(contestant => {
      let triesOnProblems: Array<number> = [];
      let isProblemSolved: Array<number> = [];
      let penaltyOnProblem: Array<number> = [];
      let isFirstToSolve: Array<number> = [];
      for (let j = 0; j < props.submissionsData.problems.length; j++) {
        isProblemSolved.push(0);
        isFirstToSolve.push(0);
        triesOnProblems.push(0);
        penaltyOnProblem.push(0);
      }

      let result: Team = {} as Team;
      result.position = 0;
      result.name = contestant.name;
      result.id = contestant.id;
      result.penalty = 0;
      result.solved = 0;
      result.isProblemSolved = isProblemSolved;
      result.isFirstToSolve = isFirstToSolve;
      result.triesOnProblems = triesOnProblems;
      result.penaltyOnProblem = penaltyOnProblem;
      return result;
    });

    let submissions = this.getSubmissions(props.submissionsData);
    submissions = submissions.sort(function (a, b) {
      return a.timeSubmitted - b.timeSubmitted;
    });

    let submissionWhenFrozen = this.getSubmissionsWhenFrozen(props.submissionsData);
    submissionWhenFrozen = submissionWhenFrozen.sort(function (a, b) {
      return a.timeSubmitted - b.timeSubmitted;
    });

    let idOfNextUserRowHighlighted = -1;
    if (teams !== null && teams !== undefined) {
      idOfNextUserRowHighlighted = teams.length - 1;
    }

    this.state = {
      submissions: submissions,
      submissionWhenFrozen: submissionWhenFrozen,
      contestDuration: props.submissionsData.contestMetadata.duration,
      contestFrozenTime: props.submissionsData.contestMetadata.frozenTimeDuration,
      numberOfProblems: props.submissionsData.problems.length,
      teams: teams,
      verdictsWithoutPenalty: this.props.submissionsData.verdicts.wrongAnswerWithoutPenalty,
      currentFrozenSubmission: null,
      savedCurrentFrozenSubmission: null,
      savedCurrentFrozenSubmissionId: null,
      idOfNextUserRowHighlighted: idOfNextUserRowHighlighted,
      hasUserFinishedSubmissions: false,
      isPressedKeyOn: 0,
      hasNotBeenScrolled: false,
      contestantNameToSelect: null,
      standingHasChangedInLastOperation: false,
      lastPositionInStanding: [],
    };
  }

  getScoreboard() {
    return this.state.teams.map((team, i) => {
      let classNameForThisRow = "";
      if (this.state.isPressedKeyOn === 1 && this.state.idOfNextUserRowHighlighted === i) {
        if (this.state.hasUserFinishedSubmissions === true) {
          classNameForThisRow += " scoreboardTableSelectedRowFinished";
        } else {
          classNameForThisRow += " scoreboardTableSelectedRow";
        }
      } else if (
        this.state.isPressedKeyOn === 0 &&
        this.state.contestantNameToSelect === team.name
      ) {
        if (this.state.standingHasChangedInLastOperation === false) {
          classNameForThisRow += " scoreboardTableSelectedRowFinished";
        } else {
          classNameForThisRow += " scoreboardTableSelectedRow";
        }
      }
      return (
        <TableRow
          key={team.id}
          //   view={this.state.view}
          index={i}
          team={team}
          numberOfProblems={this.state.numberOfProblems}
          problems={this.props.submissionsData.problems}
          submissionWhenFrozen={this.state.submissionWhenFrozen}
          currentFrozenSubmission={this.state.savedCurrentFrozenSubmission}
          savedCurrentFrozenSubmission={this.state.currentFrozenSubmission}
          classNameForThisRow={classNameForThisRow}
        />
      );
    });
  }

  getProblemId(problemLetter: string) {
    let problemId = -1;
    for (let h = 0; h < this.state.numberOfProblems; h++) {
      if (this.props.submissionsData.problems[h].index === problemLetter) {
        problemId = h;
      }
    }
    return problemId;
  }

  cleanSubmissions() {
    let teams = this.state.teams;
    let submissionWhenFrozen = this.state.submissionWhenFrozen;
    let newSubmissionWhenFrozen: Submission[] = [];

    for (let i = 0; i < submissionWhenFrozen.length; i++) {
      let problemId = this.getProblemId(submissionWhenFrozen[i].problemIndex);
      if (problemId === -1) {
        continue;
      }
      for (let j = 0; j < teams.length; j++) {
        if (
          teams[j].name === submissionWhenFrozen[i].contestantName &&
          teams[j].isProblemSolved[problemId] === 0
        ) {
          newSubmissionWhenFrozen.push(submissionWhenFrozen[i]);
          break;
        }
      }
    }
    this.setState({ submissionWhenFrozen: newSubmissionWhenFrozen });
  }

  updateCurrenFrozenSubmission() {
    if (this.state.savedCurrentFrozenSubmission === null) {
      let currentFrozenSubmission = this.state.currentFrozenSubmission;
      this.setState({ savedCurrentFrozenSubmission: currentFrozenSubmission });
    } else {
      this.setState({ savedCurrentFrozenSubmission: null });
    }
  }

  nextSubmission(
    idOfNextUserRowHighlighted: number,
    submissionWhenFrozen: Array<Submission>,
    teams: Array<Team>
  ) {
    let submissionToRevealId = -1;
    for (let i = teams.length - 1; i >= 0 && submissionToRevealId === -1; i--) {
      for (let j = 0; j < submissionWhenFrozen.length; j++) {
        let problemId = this.getProblemId(submissionWhenFrozen[j].problemIndex);
        if (problemId === -1) {
          continue;
        }

        if (
          submissionWhenFrozen[j].contestantName === teams[i].name &&
          idOfNextUserRowHighlighted === i
        ) {
          submissionToRevealId = j;
          break;
        }
      }
    }
    return submissionToRevealId;
  }

  findNextSubmissionToReveal() {
    if (this.state.currentFrozenSubmission !== null) {
      let idToRemove = this.state.savedCurrentFrozenSubmissionId!;
      let submissions = this.state.submissions;
      let submissionWhenFrozen = this.state.submissionWhenFrozen;

      if (idToRemove < submissionWhenFrozen.length) {
        submissions.push(submissionWhenFrozen[idToRemove]);
        submissionWhenFrozen.splice(idToRemove, 1);
      }

      this.setState({
        submissions: submissions,
        submissionWhenFrozen: submissionWhenFrozen,
        currentFrozenSubmission: null,
        savedCurrentFrozenSubmission: null,
        savedCurrentFrozenSubmissionId: null,
      });
      this.updateScoreboard();
      let idOfNextUserRowHighlighted = this.state.idOfNextUserRowHighlighted;

      if (
        this.nextSubmission(idOfNextUserRowHighlighted, submissionWhenFrozen, this.state.teams) ===
          -1 &&
        this.state.idOfNextUserRowHighlighted >= 0 &&
        this.standingRemainsStatic() === true
      ) {
        let contestantNameToSelect = this.state.teams[this.state.idOfNextUserRowHighlighted].name;
        this.setState({
          contestantNameToSelect: contestantNameToSelect,
          standingHasChangedInLastOperation: false,
        });
      } else if (
        this.state.idOfNextUserRowHighlighted >= 0 &&
        this.standingRemainsStatic() === false
      ) {
        let contestantNameToSelect =
          this.state.lastPositionInStanding[this.state.idOfNextUserRowHighlighted];
        this.updatePositionOfStandings();
        this.setState({
          contestantNameToSelect: contestantNameToSelect,
          standingHasChangedInLastOperation: true,
        });
      }

      clearInterval(intervalPendingSubmission!);
      return;
    }

    if (this.state.hasUserFinishedSubmissions === true) {
      let idOfNextUserRowHighlighted = this.state.idOfNextUserRowHighlighted - 1;
      this.setState({
        hasUserFinishedSubmissions: false,
        idOfNextUserRowHighlighted: idOfNextUserRowHighlighted,
      });
      return;
    }

    this.cleanSubmissions();

    let submissionWhenFrozen = this.state.submissionWhenFrozen;
    let submissionToRevealId = this.nextSubmission(
      this.state.idOfNextUserRowHighlighted,
      submissionWhenFrozen,
      this.state.teams
    );

    if (submissionToRevealId !== -1) {
      this.setState({
        currentFrozenSubmission: submissionWhenFrozen[submissionToRevealId],
        savedCurrentFrozenSubmission: submissionWhenFrozen[submissionToRevealId],
        savedCurrentFrozenSubmissionId: submissionToRevealId,
      });
      intervalPendingSubmission = setInterval(() => this.updateCurrenFrozenSubmission(), 500);
    } else if (this.state.idOfNextUserRowHighlighted >= 0) {
      this.setState({ hasUserFinishedSubmissions: true });
    }
  }

  revealUntilTop(topTeams: number) {
    let teams = this.state.teams;
    let submissions = this.state.submissions;
    let submissionWhenFrozen = this.state.submissionWhenFrozen;
    let idOfNextUserRowHighlighted = this.state.idOfNextUserRowHighlighted;

    while (idOfNextUserRowHighlighted >= topTeams) {
      let idToRemove = this.nextSubmission(idOfNextUserRowHighlighted, submissionWhenFrozen, teams);
      if (idToRemove !== -1) {
        submissions.push(submissionWhenFrozen[idToRemove]);
        submissionWhenFrozen.splice(idToRemove, 1);
        teams = this.resetTeams(teams);
        teams = this.addSubmissionsTo(teams, submissions);
        teams = this.sortTeams(teams);
      } else if (idToRemove === -1) {
        idOfNextUserRowHighlighted--;
      }
    }

    this.updateScoreboard();
    this.updatePositionOfStandings();
    this.setState({
      submissions: submissions,
      submissionWhenFrozen: submissionWhenFrozen,
      currentFrozenSubmission: null,
      savedCurrentFrozenSubmission: null,
      savedCurrentFrozenSubmissionId: null,
      idOfNextUserRowHighlighted: idOfNextUserRowHighlighted,
      hasUserFinishedSubmissions: false,
      isPressedKeyOn: 0,
      hasNotBeenScrolled: false,
      contestantNameToSelect: null,
      standingHasChangedInLastOperation: false,
    });
  }

  keyDownHandler(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.keyCode) {
      case 78: //(N)ext Submission
        if (this.state.isPressedKeyOn === 0 && this.state.contestantNameToSelect !== null) {
          let idOfNextUserRowHighlighted = this.state.idOfNextUserRowHighlighted;
          if (this.state.standingHasChangedInLastOperation === false) {
            idOfNextUserRowHighlighted = Math.max(idOfNextUserRowHighlighted - 1, -1);
          }
          this.setState({
            contestantNameToSelect: null,
            standingHasChangedInLastOperation: false,
            idOfNextUserRowHighlighted: idOfNextUserRowHighlighted,
          });
        } else {
          this.findNextSubmissionToReveal();
          let isPressedKeyOn = 1 - this.state.isPressedKeyOn;
          this.setState({
            isPressedKeyOn: isPressedKeyOn,
            hasNotBeenScrolled: false,
          });
          this.scrollToElementSelected();
        }
        break;

      case 70: //(F)ast Submission
        //TODO: Implement Fast Submission, Reveal all pending solutions until AC or final WA
        console.log("(F)ast Submission, not implemented yet");
        break;

      case 84: //(T)op 10 Standing
        this.revealUntilTop(10);
        break;

      case 85: //(U)nfroze Standing
        this.revealUntilTop(0);
        break;

      case 65: //(A)utomatic Reveal
        //TODO: Implement automatic reveal, every X time reveal next submission
        console.log("(A)utomatic Reveal, not implemented yet");
        break;

      default:
        break;
    }
  }

  scrollToElementSelected() {
    if (
      this.state.isPressedKeyOn === 0 &&
      this.state.idOfNextUserRowHighlighted !== -1 &&
      this.state.hasNotBeenScrolled === false
    ) {
      let targetTeam = this.state.idOfNextUserRowHighlighted - 2;
      try {
        let id = this.state.teams[targetTeam].id;
        let element = document.getElementById(`${id}`);
        document.getElementById("score-FlipMove")!.scrollTo(0, element!.offsetTop);
        this.setState({ hasNotBeenScrolled: true });
      } catch (e) {}
    }
  }

  render() {
    return (
      <div
        id="score"
        className={"scoreboardTable"}
        tabIndex={0}
        onKeyDown={e => this.keyDownHandler(e)}
      >
        <Header title={this.props.submissionsData.contestMetadata.name} />
        <div className="score-FlipMove" id="score-FlipMove">
          <FlipMove ref="flipMove" staggerDurationBy="10" duration={900}>
            {this.getScoreboard()}
          </FlipMove>
        </div>
      </div>
    );
  }
}

export default Scoreboard;
