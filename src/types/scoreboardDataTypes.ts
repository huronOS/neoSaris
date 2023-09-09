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
