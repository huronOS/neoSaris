export type ContestMetadata = {
  duration: number; //Duration in minutes
  frozenTimeDuration: number; //Duration of the frozen time in minutes
  name: string; // Title to display for the problem
  type: "ICPC"; // Type of contest to evaluate
};
export type Problem = {
  //0 = first problem, etc.
  index: string; //Letter of the problem
  name?: string; //Actual name of the problem
  //Here we can add subtasks if we need to evaluate IOI contests
};
export type Contestant = {
  id: number; //Unique number to identify this contestant
  name: string; //Name of the contestant
  school?: string; //Name of represented university/school/institution
  iconName?: string; //Id of the icon to display for this contestant
  //For awards, we can include fields about members of the team
};
export type Verdict = {
  accepted: Array<string>; //Name of the accepted verdicts
  //For IOI we can add partial verdict name
  partiallyAccepted: Array<string>; //Name of the partially accepted verdicts
  wrongAnswerWithPenalty: Array<string>; //Name of WA verdicts that causes penalty
  wrongAnswerWithoutPenalty: Array<string>; //Name of of WA verdicts that does not causes penalty
};
export type Submission = {
  timeSubmitted: number; //Floor time in minutes of the submission, relative to the contest start.
  contestantName: string; //Name of the contestant
  problemIndex: string; //Should match problems array
  verdict: string; //Should match a registered verdict
  //For IOI we can add the partial scores
};
export type ContestData = {
  contestMetadata: ContestMetadata;
  problems: Array<Problem>; //Array with an unique index for each problem
  contestants: Array<Contestant>;
  verdicts: Verdict;
  //For awards, we can add an object for different awards (TopRanked, FirstToSolve, Medals)
  submissions: Array<Submission>;
};
