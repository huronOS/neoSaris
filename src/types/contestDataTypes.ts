export type ContestData = {
  contestMetadata: {
    duration: Number; //Duration in minutes
    frozenTimeDuration: Number; //Duration of the frozen time in minutes
    name: String; // Title to display for the problem
    type: "ICPC"; // Type of contest to evaluate
    //^ We can add a future type for IOI to identify IOI contests
  };
  problems: Array<{
    //0 = first problem, etc.
    index: String; //Letter of the problem
    name?: String; //Actual name of the problem
    //Here we can add subtasks if we need to evaluate IOI contests
  }>; //Array with an unique index for each problem
  contestants: Array<{
    id: Number; //Unique number to identify this contestant
    name: String; //Name of the contestant
    school?: String; //Name of represented university/school/institution
    iconName?: String; //Id of the icon to display for this contestant
    //For awards, we can include fields about members of the team
  }>;
  verdicts: {
    accepted: Array<String>; //Name of the accepted verdicts
    //For IOI we can add partial verdict name
    wrongAnswerWithPenalty: Array<String>; //Name of WA verdicts that causes penalty
    wrongAnswerWithoutPenalty: Array<String>; //Name of of WA verdicts that does not causes penalty
  };
  //For awards, we can add an object for different awards (TopRanked, FirstToSolve, Medals)
  submissions: Array<{
    timeSubmission: Number; //Floor time in minutes of the submission, relative to the contest start.
    teamName: String; //Name of the contestant
    problem: String; //Should match problems array
    verdict: String; //Should match a registered verdict
    //For IOI we can add the partial scores
  }>;
};
