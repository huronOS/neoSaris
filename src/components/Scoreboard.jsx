import React, { Component } from "react";
import FlipMove from "react-flip-move";
import TableItem from "./TableItem";
import Header from "./Header";
import "./Scoreboard.css";
var intervalPendingSubmission = null;

class Scoreboard extends Component {
  getSubmissions(submissionsData) {
    let submissionsOnContest = [];
    submissionsData.Submissions.forEach(function (submission) {
      if (
        submission.timeSubmission <
        submissionsData.Contest.Duration - submissionsData.Contest.FrozenTime
      ) {
        let result = {};
        result.teamName = submission.TeamName;
        result.timeSubmission = submission.timeSubmission;
        result.verdict = submission.Verdict;
        result.problem = submission.Problem;
        submissionsOnContest.push(result);
      }
    });
    return submissionsOnContest;
  }

  getSubmissionsWhenFrozen(submissionsData, verdictsWithoutPenalty) {
    let submissionsOnFrozen = [];
    submissionsData.Submissions.forEach(function (submission) {
      if (
        submission.timeSubmission >=
          submissionsData.Contest.Duration - submissionsData.Contest.FrozenTime &&
        submission.timeSubmission < submissionsData.Contest.Duration
      ) {
        let result = {};
        result.teamName = submission.TeamName;
        result.timeSubmission = submission.timeSubmission;
        result.verdict = submission.Verdict;
        result.problem = submission.Problem;
        if (verdictsWithoutPenalty.includes(result.verdict) === false) {
          submissionsOnFrozen.push(result);
        }
      }
    });
    return submissionsOnFrozen;
  }

  resetTeams(teams) {
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

  addSubmissionsTo(teams, submissions) {
    let problemHasBeenSolved = [];
    for (let i = 0; i < this.state.numberOfProblems; i++) {
      problemHasBeenSolved.push(0);
    }

    for (let h = 0; h < submissions.length; h++) {
      let submission = submissions[h];
      if (this.state.verdictsWithoutPenalty.includes(submission.verdict) === true) {
        continue;
      } else if (submission.verdict === "Accepted") {
        // Update accepted problem only if has not been accepted before.
        for (let i = 0; i < teams.length; i++) {
          if (teams[i].name === submission.teamName) {
            for (let j = 0; j < this.state.numberOfProblems; j++) {
              let problemLetter = this.props.submissionsData.Contest.ProblemsIndex[j];
              if (problemLetter === submission.problem && teams[i].isProblemSolved[j] === 0) {
                teams[i].isProblemSolved[j] = 1;
                teams[i].penaltyOnProblem[j] = submission.timeSubmission;
                teams[i].penalty += submission.timeSubmission + teams[i].triesOnProblems[j] * 20;
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
          if (teams[i].name === submission.teamName) {
            for (let j = 0; j < this.state.numberOfProblems; j++) {
              let problemLetter = this.props.submissionsData.Contest.ProblemsIndex[j];
              if (problemLetter === submission.problem && teams[i].isProblemSolved[j] === 0) {
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

  sortTeams(teams) {
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
      return a.timeSubmission - b.timeSubmission;
    });

    let submissionWhenFrozen = this.state.submissionWhenFrozen;
    submissionWhenFrozen = submissionWhenFrozen.sort(function (a, b) {
      return a.timeSubmission - b.timeSubmission;
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
    let lastPositionInStanding = {};
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

  /*componentDidUpdate() {
	setTimeout(() => {
		if (this.state.isPressedKeyOn === 0 && this.state.teamNameToSelect !== null) {
			let idOfNextUserRowHighlighted = this.state.idOfNextUserRowHighlighted;
			if (this.state.standingHasChangedInLastOperation === false) {
			  idOfNextUserRowHighlighted = Math.max(idOfNextUserRowHighlighted - 1, -1);
			}
			this.setState({
			  teamNameToSelect: null,
			  standingHasChangedInLastOperation: false,
			  idOfNextUserRowHighlighted: idOfNextUserRowHighlighted
			});
		  }
		  else {
			this.findNextSubmissionToReveal();
			let isPressedKeyOn = 1 - this.state.isPressedKeyOn;
			this.setState({
			  isPressedKeyOn: isPressedKeyOn,
			  hasNotBeenScrolled: false
			});
			this.scrollToElementSelected();
		  }
	}, 3000);
  }*/

  componentDidMount() {
    this.updateScoreboard();
    this.updatePositionOfStandings();
    this.cleanSubmissions();
  }

  constructor(props) {
    super(props);
    let teams = Object.entries(props.submissionsData.Teams).map((team, i) => {
      let triesOnProblems = [];
      let isProblemSolved = [];
      let penaltyOnProblem = [];
      let isFirstToSolve = [];
      for (let j = 0; j < props.submissionsData.Contest.NumberOfProblems; j++) {
        isProblemSolved.push(0);
        isFirstToSolve.push(0);
        triesOnProblems.push(0);
        penaltyOnProblem.push(0);
      }

      let result = {};
      result.position = 0;
      result.name = team[1];
      result.id = team[0];
      result.penalty = 0;
      result.solved = 0;
      result.isProblemSolved = isProblemSolved;
      result.isFirstToSolve = isFirstToSolve;
      result.triesOnProblems = triesOnProblems;
      result.penaltyOnProblem = penaltyOnProblem;
      return result;
    });

    let verdictsWithoutPenalty = Object.entries(props.submissionsData.VerdictWithoutPenalty).map(
      verdict => {
        return verdict[1];
      }
    );

    let submissions = this.getSubmissions(props.submissionsData);
    submissions = submissions.sort(function (a, b) {
      return a.timeSubmission - b.timeSubmission;
    });

    let submissionWhenFrozen = this.getSubmissionsWhenFrozen(
      props.submissionsData,
      verdictsWithoutPenalty
    );
    submissionWhenFrozen = submissionWhenFrozen.sort(function (a, b) {
      return a.timeSubmission - b.timeSubmission;
    });

    let idOfNextUserRowHighlighted = -1;
    if (teams !== null && teams !== undefined) {
      idOfNextUserRowHighlighted = teams.length - 1;
    }

    this.state = {
      submissions: submissions,
      submissionWhenFrozen: submissionWhenFrozen,
      contestDuration: props.submissionsData.Contest.Duration,
      contestFrozenTime: props.submissionsData.Contest.FrozenTime,
      numberOfProblems: props.submissionsData.Contest.NumberOfProblems,
      teams: teams,
      verdictsWithoutPenalty: verdictsWithoutPenalty,
      currentFrozenSubmission: null,
      savedCurrentFrozenSubmission: null,
      savedCurrentFrozenSubmissionId: null,
      idOfNextUserRowHighlighted: idOfNextUserRowHighlighted,
      hasUserFinishedSubmissions: false,
      isPressedKeyOn: 0,
      hasNotBeenScrolled: false,
      teamNameToSelect: null,
      standingHasChangedInLastOperation: false,
      lastPositionInStanding: {},
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
      } else if (this.state.isPressedKeyOn === 0 && this.state.teamNameToSelect === team.name) {
        if (this.state.standingHasChangedInLastOperation === false) {
          classNameForThisRow += " scoreboardTableSelectedRowFinished";
        } else {
          classNameForThisRow += " scoreboardTableSelectedRow";
        }
      }
      return (
        <TableItem
          key={team.id}
          view={this.state.view}
          index={i}
          team={team}
          numberOfProblems={this.state.numberOfProblems}
          problemsIndex={this.props.submissionsData.Contest.ProblemsIndex}
          submissionWhenFrozen={this.state.submissionWhenFrozen}
          currentFrozenSubmission={this.state.savedCurrentFrozenSubmission}
          savedCurrentFrozenSubmission={this.state.currentFrozenSubmission}
          classNameForThisRow={classNameForThisRow}
        />
      );
    });
  }

  getProblemId(problemLetter) {
    let problemId = -1;
    for (let h = 0; h < this.state.numberOfProblems; h++) {
      if (this.props.submissionsData.Contest.ProblemsIndex[h] === problemLetter) {
        problemId = h;
      }
    }
    return problemId;
  }

  cleanSubmissions() {
    let teams = this.state.teams;
    let submissionWhenFrozen = this.state.submissionWhenFrozen;
    let newSubmissionWhenFrozen = [];

    for (let i = 0; i < submissionWhenFrozen.length; i++) {
      let problemId = this.getProblemId(submissionWhenFrozen[i].problem);
      if (problemId === -1) {
        continue;
      }
      for (let j = 0; j < teams.length; j++) {
        if (
          teams[j].name === submissionWhenFrozen[i].teamName &&
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

  nextSubmission(idOfNextUserRowHighlighted, submissionWhenFrozen, teams) {
    let submissionToRevealId = -1;
    for (let i = teams.length - 1; i >= 0 && submissionToRevealId === -1; i--) {
      for (let j = 0; j < submissionWhenFrozen.length; j++) {
        let problemId = this.getProblemId(submissionWhenFrozen[j].problem);
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

  findNextSubmissionToReveal() {
    if (this.state.currentFrozenSubmission !== null) {
      let idToRemove = this.state.savedCurrentFrozenSubmissionId;
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
        let teamNameToSelect = this.state.teams[this.state.idOfNextUserRowHighlighted].name;
        this.setState({
          teamNameToSelect: teamNameToSelect,
          standingHasChangedInLastOperation: false,
        });
      } else if (
        this.state.idOfNextUserRowHighlighted >= 0 &&
        this.standingRemainsStatic() === false
      ) {
        let teamNameToSelect =
          this.state.lastPositionInStanding[this.state.idOfNextUserRowHighlighted];
        this.updatePositionOfStandings();
        this.setState({
          teamNameToSelect: teamNameToSelect,
          standingHasChangedInLastOperation: true,
        });
      }

      clearInterval(intervalPendingSubmission);
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

  revealUntilTop(topTeams) {
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
      teamNameToSelect: null,
      standingHasChangedInLastOperation: false,
    });
  }

  keyDownHandler(e) {
    if (e.keyCode === 8 && e.ctrlKey === true) {
      // Leave pending Top 10
      this.revealUntilTop(10);
    } else if (e.keyCode === 46 && e.ctrlKey === true) {
      // Unfroze scoreboard.
      this.revealUntilTop(0);
    } else if (e.keyCode === 13) {
      if (this.state.isPressedKeyOn === 0 && this.state.teamNameToSelect !== null) {
        let idOfNextUserRowHighlighted = this.state.idOfNextUserRowHighlighted;
        if (this.state.standingHasChangedInLastOperation === false) {
          idOfNextUserRowHighlighted = Math.max(idOfNextUserRowHighlighted - 1, -1);
        }
        this.setState({
          teamNameToSelect: null,
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
    }
  }

  scrollToElementSelected() {
    if (
      this.state.isPressedKeyOn === 0 &&
      this.state.idOfNextUserRowHighlighted !== -1 &&
      this.state.hasNotBeenScrolled === false
    ) {
      let id = this.state.teams[this.state.idOfNextUserRowHighlighted].id;
      let element = document.getElementById(id);
      window.scrollTo(0, element.offsetTop);
      this.setState({ hasNotBeenScrolled: true });
    }
  }

  render() {
    return (
      <div
        id="score"
        className={"scoreboardTable"}
        tabIndex="0"
        onKeyDown={e => this.keyDownHandler(e)}
      >
        <div>
          <Header title={this.props.submissionsData.Contest.Name} />
          <FlipMove ref="flipMove" staggerDurationBy="30" duration={900}>
            {this.getScoreboard()}
          </FlipMove>
        </div>
      </div>
    );
  }
}

export default Scoreboard;
