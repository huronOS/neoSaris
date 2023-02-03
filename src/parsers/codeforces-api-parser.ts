import axios from "axios";
import { sha512 } from "js-sha512";
import { ContestData } from "./raw-json-parser";

const buildParams = (method: string, contestId: string, groupId: string, apiKey: string, apiSecret: string) => {
  const time = `${Math.floor(Date.now() / 1000)}`;
  const groupCode = groupId;
  const rand = "123456";
  const str = `${rand}/${method}?apiKey=${apiKey}&contestId=${contestId}&groupCode=${groupCode}&time=${time}#${apiSecret}`;
  const hash = sha512(encodeURI(str));
  return {
    groupCode,
    contestId,
    apiKey,
    time,
    apiSig: rand + hash,
  };
};

export const getContestDataWithCodeforcesAPI = async (
  frozenTime: number,
  contestId: string,
  groupId: string,
  apiKey: string,
  apiSecret: string
): Promise<ContestData> => {
  const contestData = await getContestData(frozenTime, contestId, groupId, apiKey, apiSecret);
  const submissions = await getSubmissions(contestData.contestData.Duration, contestId, groupId, apiKey, apiSecret);

  return {
    Contest: contestData.contestData,
    Teams: contestData.teams,
    VerdictWithoutPenalty: { 1: "Compilation error" },
    Submissions: submissions,
  };
};

export const getSubmissions = async (
  duration: number,
  contestId: string,
  groupId: string,
  apiKey: string,
  apiSecret: string
): Promise<ContestData["Submissions"]> => {
  const { data: response } = await axios
    .request({
      method: "GET",
      url: "https://codeforces.com/api/contest.status",
      headers: { "Content-Type": "text/plain" },
      params: buildParams("contest.status", contestId, groupId, apiKey, apiSecret),
    })
    .catch((error) => {
      throw new Error(
        `Error while making codeforces API request:\n${error.message}`
      );
    });

  console.log("Response", response);

  return response.result
    .filter((submission: any) => Math.floor(submission.relativeTimeSeconds / 60) <= duration)
    .map((submission: any) => {
      return {
        timeSubmission: Math.floor(submission.relativeTimeSeconds / 60),
        TeamName:
          submission.author.teamName ||
          submission.author.members[0].handle ||
          "NO_TEAM_NAME",
        Problem: submission.problem.index,
        Verdict: submission.verdict === "OK" ? "Accepted" : "WRONG",
      };
    });
};

export const getContestData = async (
  frozenTime: number,
  contestId: string,
  groupId: string,
  apiKey: string,
  apiSecret: string
) => {
  const { data: response } = await axios
    .request({
      method: "GET",
      url: "https://codeforces.com/api/contest.standings",
      headers: { "Content-Type": "text/plain" },
      params: buildParams(
        "contest.standings",
        contestId,
        groupId,
        apiKey,
        apiSecret
      ),
    })
    .catch((error) => {
      throw new Error(
        `Error while making codeforces API request:\n${error.message}`
      );
    });

  console.log("contest request", response);

  return {
    contestData: {
      Duration: Math.floor(response.result.contest.durationSeconds / 60),
      FrozenTime: frozenTime,
      NumberOfProblems: response.result.problems.length,
      ProblemsIndex: response.result.problems.map((problem: any) => {
        return problem.index;
      }),
      Name: response.result.contest.name,
    },
    teams: Object.fromEntries(
      response.result.rows.map((row: any, index: number) => {
        return [
          index,
          row.party.teamName ?? row.party.members[0].handle ?? "NO_TEAM_NAME",
        ];
      })
    ),
  };
};
