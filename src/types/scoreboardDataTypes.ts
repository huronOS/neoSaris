import { Problem, Submission, Verdict } from "./contestDataTypes";

export type Team = {
  position: number;
  penalty: number;
  solved: number;
  isProblemSolved: Array<number>;
  isFirstToSolve: Array<number>;
  triesOnProblems: Array<number>;
  penaltyOnProblem: Array<number>;
  name: string;
  id: number;
};

export type ProblemColumn = {
  key: string;
  index: string;
  width: string;
  problemStatus:
    | "FirstAccepted"
    | "Accepted"
    | "Resolving"
    | "Pending"
    | "WrongAnswer"
    | "NoAttempted";
  displayText: string;
};

export type ProblemStatusType =
  | "FirstAccepted"
  | "Accepted"
  | "Resolving"
  | "Pending"
  | "WrongAnswer"
  | "NoAttempted";

// Every piece of this type is useful because with a forEach on the problem you can get
// the sum of scores (the amount of problems solved if ICPC)
// The sum of penalties
// The tries in that problem,
export type ProblemType = {
  tries: number;
  score: number; // if 0, not solved, if 1, solved, useful like this because it can also represent partial scores
  penalty: number;
  isSolved: boolean;
  isFirstSolved: boolean;
  isFrozen: boolean;
  indexLetter: string;
  nextSubmissionTime: number;
};

export type TeamType = {
  unfrozenSubmissions: Submission[];
  frozenSubmissions: Submission[];
  position: number;
  name: string;
  id: number;
  problems: ProblemType[];
  totalScore: number;
  totalPenalty: number;
  // Required because if we only check frozenSubmissions,
  // teams with no frozen submission would be skipped
  // and that would look clunky
  isDone: boolean;
  movedUp: boolean;
  // If a team had an AC in the last submission, it means that
  hadAC: boolean;
};

export type ScoreboardType = {
  isProblemAlreadySolved: number[];
  // contestMetadata: contestData.contestMetadata,
  verdicts: Verdict;
  problems: Problem[];
  contestDuration: number;
  contestFrozenTimeDuration: number;
  contestTimeOfFreeze: number;
  contestName: string;
  contestType: string;
  firstSolvedArray: string[];
  penaltyPerSubmission: number;
  scoreMode: "ICPC";
};

export type ScoreboardDirectorType = {
  teams: TeamType[];
  scoreboard: ScoreboardType;
  indexOfNextTeam: number;
};
