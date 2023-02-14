import axios from "axios";
import fs from "fs";

const buildParams = () => {
  return {
    draw: 1,
  };
};

const buildHeaders = cookie => {
  return {
    "Content-Type": "text/plain",
    Cookie: cookie,
  };
};

export const getContestData = async (frozenTime, contestId, numberOfProblems, cookie) => {
  const { data: response } = await axios
    .request({
      method: "GET",
      url: `https://vjudge.net/contest/rank/single/${contestId}`,
      headers: buildHeaders(cookie),
      params: buildParams(contestId),
    })
    .catch(error => {
      throw new Error(`Error while making vJudge API request:\n${error.message}`);
    });

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
      frozenTimeDuration: frozenTime,
      name: response.title,
      type: "ICPC",
    },
    problems: problems,
    contestants: Object.entries(response.participants).map((value, idx) => {
      return { id: idx, name: value[1][0] };
    }),
    submissions: response.submissions
      .filter(submission => Math.floor(submission[3] / 60) <= duration)
      .map(submission => {
        return {
          timeSubmission: Math.floor(submission[3] / 60),
          teamName: teamName.get(submission[0].toString()),
          problem: problems[submission[1]],
          verdict: submission[2] === 1 ? "ACCEPTED" : "WRONG_ANSWER",
        };
      }),
  };
};

export const getContestDataWithVjudgeAPI = async (
  frozenTime,
  contestId,
  numberOfProblems,
  cookie
) => {
  const contestData = await getContestData(frozenTime, contestId, numberOfProblems, cookie);
  const JSONobject = {
    contestMetadata: contestData.contestData,
    problems: contestData.problems.map(letter => {
      return { index: letter };
    }),
    contestants: contestData.contestants,
    verdicts: {
      accepted: ["ACCEPTED"],
      wrongAnswerWithPenalty: ["WRONG_ANSWER"],
      wrongAnswerWithoutPenalty: [],
    },
    submissions: contestData.submissions,
  };
  return JSONobject;
};

//argv -> [node, script, frozenTime, contestId, numberOfProblems, cookie]
fs.writeFile(
  process.argv[6],
  JSON.stringify(
    await getContestDataWithVjudgeAPI(
      parseInt(process.argv[2]),
      parseInt(process.argv[3]),
      parseInt(process.argv[4]),
      process.argv[5]
    ),
    null,
    2
  ),
  err => {
    if (err) console.log(err);
    else console.log("Archivo generado");
  }
);
