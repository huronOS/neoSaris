import axios from "axios";
import { sha512 } from "js-sha512";
import { config } from "dotenv";

config();

const buildParams = (method, contestId, groupId, apiKey, apiSecret) => {
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

const buildHeaders = () => {
  return {
    "Content-Type": "text/plain",
  };
};

export const getContestDataWithCodeforcesAPI = async (
  contestId,
  groupId,
  apiKey,
  apiSecret
) => {
  const submissions = await getSubmissions(
    contestId,
    groupId,
    apiKey,
    apiSecret
  );
  const contestData = await getContestData(
    contestId,
    groupId,
    apiKey,
    apiSecret
  );
  const JSONobject = {
    Contest: contestData.contestData,
    Teams: contestData.teams,
    VerdictWithoutPenalty: {
      1: "Compilation error",
    },
    Submissions: submissions,
  };
  return JSONobject;
};

export const getSubmissions = async (contestId, groupId, apiKey, apiSecret) => {
  const { data: response } = await axios
    .request({
      method: "GET",
      url: "https://codeforces.com/api/contest.status",
      headers: buildHeaders(),
      params: buildParams(
        "contest.status",
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

  return response.result.map((submission) => {
    return {
      timeSubmission: Math.floor(submission.relativeTimeSeconds / 60),
      TeamName: submission.author.teamName || "NO_TEAM",
      Problem: submission.problem.index,
      Verdict: submission.verdict === "OK" ? "Accepted" : "WRONG",
    };
  });
};

export const getContestData = async (contestId, groupId, apiKey, apiSecret) => {
  const { data: response } = await axios
    .request({
      method: "GET",
      url: "https://codeforces.com/api/contest.standings",
      headers: buildHeaders(),
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

  return {
    contestData: {
      Duration: Math.floor(response.result.contest.durationSeconds / 60),
      FrozenTime: 60,
      NumberOfProblems: response.result.problems.length,
      Name: response.result.contest.name,
    },
    teams: Object.fromEntries(
      response.result.rows.map((row, index) => {
        return [index, row.party.teamName];
      })
    ),
  };
};
