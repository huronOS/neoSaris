import { z } from "zod";

const Data = z.object({
  Contest: z.object({
    Duration: z.number(),
    FrozenTime: z.number(),
    NumberOfProblems: z.number(),
    ProblemsIndex: z.array(z.string()),
    Name: z.string(),
  }),
  Teams: z.object({
  }).catchall(z.string()),
  VerdictWithoutPenalty: z.object({}).catchall(z.string()),
  Submissions: z.array(
    z.object({
      timeSubmission: z.number(),
      TeamName: z.string(),
      Problem: z.string(),
      Verdict: z.string(),
    }))
});

export type ContestData = z.infer<typeof Data>;
export const getContestDataWithRawData = (rawText: string) => {
  const contestData = JSON.parse(rawText);
  const result = Data.safeParse(contestData);
  if (!result.success) {
    alert(result.error.issues.map((issue) => issue.message).join(""));
    throw new Error("Invalid JSON");
  }

  return result.data;
};
