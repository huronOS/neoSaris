import { z } from "zod";

const Data = z.object({
  contestMetadata: z.object({
    duration: z.number(),
    frozenTime: z.number(),
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
  verdictWithoutPenalty: z.object({}).catchall(z.string()),
  submissions: z.array(
    z.object({
      timeSubmission: z.number(),
      teamName: z.string(),
      problem: z.string(),
      verdict: z.string(),
    })
  ),
});

export const getContestDataWithNeoSarisJSON = rawText => {
  let contestData = {};
  contestData = JSON.parse(rawText);
  console.log("neoSaris JSON, Input Object", contestData);

  const result = Data.safeParse(contestData);
  if (!result.success) {
    console.log("Zod Result", result);
    alert(
      result.error.issues
        .map(issue => {
          return `Error ${issue.code}, for ${issue.path.join(".")} expected ${issue.number}, got ${
            issue.received
          }`;
        })
        .join("\n")
    );
    throw new Error("Invalid neoSaris JSON");
  }
  return contestData;
};
