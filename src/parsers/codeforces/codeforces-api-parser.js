import axios from "axios";
import { sha512 } from "js-sha512";
import { config } from "dotenv";

config();

const buildParams = (method) => {
  const time = `${Math.floor(Date.now() / 1000)}`;
  const groupCode = process.env.REACT_APP_CF_GROUP_ID;
  const contestId = process.env.REACT_APP_CF_CONTEST_ID;
  const apiKey = process.env.REACT_APP_CF_API_KEY;
  const apiSecret = process.env.REACT_APP_CF_API_SECRET;
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

export const buildJSON = async () => {
  const submissions = await getSubmissions();
  const contestData = await getContestData();
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

export const getSubmissions = async () => {
  const { data: response } = await axios.request({
    method: "GET",
    url: "https://codeforces.com/api/contest.status",
    headers: buildHeaders(),
    params: buildParams("contest.status"),
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

export const getContestData = async () => {
  const { data: response } = await axios.request({
    method: "GET",
    url: "https://codeforces.com/api/contest.standings",
    headers: buildHeaders(),
    params: buildParams("contest.standings"),
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

buildJSON();
