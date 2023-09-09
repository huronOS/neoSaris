import { z } from "zod";
import { ContestData } from "../../types/contestDataTypes";

const Data = z.object({
  contestMetadata: z.object({
    duration: z.number(),
    frozenTimeDuration: z.number(),
    name: z.string(),
    type: z.literal("ICPC"),
  }),
  problems: z.array(
    z.object({
      index: z.string(),
      name: z.string().optional(),
    })
  ),
  contestants: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      school: z.string().optional(),
      iconName: z.string().optional(),
    })
  ),
  verdicts: z.object({
    accepted: z.array(z.string()),
    wrongAnswerWithPenalty: z.array(z.string()),
    wrongAnswerWithoutPenalty: z.array(z.string()),
  }),
  submissions: z.array(
    z.object({
      timeSubmitted: z.number(),
      contestantName: z.string(),
      problemIndex: z.string(),
      verdict: z.string(),
    })
  ),
});

export function verifyNeoSarisJSON(contestData: ContestData) {
  const result = Data.safeParse(contestData);
  if (!result.success) {
    console.log("Zod Result", result);
    alert(
      result.error.issues
        .map(issue => {
          return `Error ${issue.code}, for ${issue.path.join(".")}`;
        })
        .join("\n")
    );
    throw new Error("Invalid neoSaris JSON");
  }
  return contestData;
}

export function getContestDataWithNeoSarisJSON(rawText: string) {
  let contestData = JSON.parse(rawText) as ContestData;
  console.log("neoSaris JSON, Input Object", contestData);
  verifyNeoSarisJSON(contestData);
  return contestData;
}
