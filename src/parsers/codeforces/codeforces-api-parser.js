import axios from "axios";
import { sha512 } from "js-sha512";

const buildParams = ({
  method,
  contestId,
  isPrivate = false,
  groupId = "",
  apiKey = "",
  apiSecret = "",
}) => {
  if (!isPrivate) {
    return {
      contestId,
    };
  }
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

export const getSubmissions = async ({
  duration,
  contestId,
  isPrivate = false,
  groupId = "",
  apiKey = "",
  apiSecret = "",
}) => {
  const { data: response } = await axios
    .request({
      method: "GET",
      url: "https://codeforces.com/api/contest.status",
      headers: buildHeaders(),
      params: buildParams({
        method: "contest.status",
        contestId,
        isPrivate,
        groupId,
        apiKey,
        apiSecret,
      }),
    })
    .catch(error => {
      throw new Error(`Error while making codeforces API request:\n${error.message}`);
    });

  console.log("Codeforces API, Submissions Response", response);

  return response.result
    .filter(submission => Math.floor(submission.relativeTimeSeconds / 60) <= duration)
    .map(submission => {
      return {
        timeSubmission: Math.floor(submission.relativeTimeSeconds / 60),
        teamName:
          submission.author.teamName || submission.author.members[0].handle || "NO_TEAM_NAME",
        problem: submission.problem.index,
        verdict: submission.verdict === "OK" ? "Accepted" : "WRONG",
      };
    });
};

export const getContestData = async ({
  frozenTime = 60,
  contestId,
  isPrivate = false,
  groupId = "",
  apiKey = "",
  apiSecret = "",
}) => {
  const { data: response } = await axios
    .request({
      method: "GET",
      url: "https://codeforces.com/api/contest.standings",
      headers: buildHeaders(),
      params: buildParams({
        method: "contest.standings",
        contestId,
        isPrivate,
        groupId,
        apiKey,
        apiSecret,
      }),
    })
    .catch(error => {
      throw new Error(`Error while making codeforces API request:\n${error.message}`);
    });

  console.log("Codeforces API, Contest Information Response", response);

  return {
    contestData: {
      duration: Math.floor(response.result.contest.durationSeconds / 60),
      frozenTime: frozenTime,
      name: response.result.contest.name,
      type: response.result.contest.type,
    },
    problems: response.result.problems.map(problem => {
      return { index: problem.index, name: problem.name };
    }),
    teams: Object.fromEntries(
      response.result.rows.map((row, index) => {
        return [index, row.party.teamName || row.party.members[0].handle || "NO_TEAM_NAME"];
      })
    ),
  };
};

export const getContestDataWithCodeforcesAPI = async ({
  frozenTime,
  contestId,
  isPrivate = false,
  groupId = "",
  apiKey = "",
  apiSecret = "",
}) => {
  const contestData = await getContestData({
    frozenTime,
    contestId,
    isPrivate,
    groupId,
    apiKey,
    apiSecret,
  });
  const submissions = await getSubmissions({
    duration: contestData.contestData.duration,
    contestId,
    isPrivate,
    groupId,
    apiKey,
    apiSecret,
  });
  const JSONobject = {
    contestMetadata: contestData.contestData,
    problems: contestData.problems,
    teams: contestData.teams,
    verdictWithoutPenalty: {
      1: "Compilation error",
    },
    submissions: submissions,
  };
  return JSONobject;
};
