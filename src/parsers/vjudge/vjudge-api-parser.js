import axios from "axios";

const buildParams = () => {
  return {
    draw: 1,
  };
};

const buildHeaders = () => {
  return {
    "Content-Type": "text/plain",
  };
};

export const getContestData = async (frozenTime, contestId, numberOfProblems) => {
  const { data: response } = await axios
    .request({
      method: "GET",
      url: `https://vjudge.net/contest/rank/single/${contestId}`,
      headers: buildHeaders(),
      params: buildParams(contestId),
    })
    .catch(error => {
      throw new Error(`Error while making vJudge API request:\n${error.message}`);
    });

  console.log("vJudge API, Contests Response", response);
  if (response == null || Object.keys(response).length === 0) {
    throw new Error("No answer from vJudge. Is this a private contest?");
  }

  // Pre calculate data
  const duration = Math.floor(response.length / 1000 / 60);
  const problems = [...Array(numberOfProblems).keys()].map(idx => {
    return String.fromCharCode("A".charCodeAt(0) + idx);
  });
  const teamName = new Map();
  Object.entries(response.participants).forEach((value, idx) => {
    teamName.set(value[0], value[1][0]);
  });

  return {
    contestData: {
      duration: duration,
      frozenTime: frozenTime,
      name: response.title,
    },
    problemsIndex: problems,
    teams: Object.fromEntries(
      Object.entries(response.participants).map((value, idx) => {
        return [idx, value[1][0]];
      })
    ),
    submissions: response.submissions
      .filter(submission => Math.floor(submission[3] / 60) <= duration)
      .map(submission => {
        return {
          timeSubmission: Math.floor(submission[3] / 60),
          teamName: teamName.get(submission[0].toString()),
          problem: problems[submission[1]],
          verdict: submission[2] === 1 ? "Accepted" : "WRONG",
        };
      }),
  };
};

export const getContestDataWithVjudgeAPI = async (frozenTime, contestId, numberOfProblems) => {
  const contestData = await getContestData(frozenTime, contestId, numberOfProblems);
  const JSONobject = {
    contestMetadata: contestData.contestData,
    teams: contestData.teams,
    problemsIndex: contestData.problemsIndex,
    verdictWithoutPenalty: {
      1: "Compilation error",
    },
    submissions: contestData.submissions,
  };
  return JSONobject;
};
