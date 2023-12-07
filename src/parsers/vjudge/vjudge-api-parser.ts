import axios from "axios";
import { ContestData } from "../../types/contestDataTypes";

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
      params: buildParams(),
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
  const teamName = new Map<string, string>();
  Object.entries(response.participants).forEach((value: any, idx) => {
    teamName.set(value[0], value[1][0]);
  });

  return {
    contestData: {
      duration: duration,
      frozenTimeDuration: frozenTime,
      name: response.title,
      type: "ICPC",
      scoreMode: "absolute",
      penaltyPerSubmission: 20,
    },
    problems: problems,
    contestants: Object.entries(response.participants).map((value: any, idx) => {
      return { id: idx, name: value[1][0] };
    }),
    submissions: response.submissions
      .filter(submission => Math.floor(submission[3] / 60) <= duration)
      .map(submission => {
        return {
          timeSubmitted: Math.floor(submission[3] / 60),
          contestantName: teamName.get(submission[0].toString()),
          problemIndex: problems[submission[1]],
          verdict: submission[2] === 1 ? "ACCEPTED" : "WRONG_ANSWER",
        };
      }),
  };
};

export const getContestDataWithVjudgeAPI = async (frozenTime, contestId, numberOfProblems) => {
  const contestData = await getContestData(frozenTime, contestId, numberOfProblems);
  const JSONobject: ContestData = {
    contestMetadata: contestData.contestData,
    contestants: contestData.contestants,
    problems: contestData.problems.map(letter => {
      return { index: letter };
    }),
    verdicts: {
      accepted: ["ACCEPTED"],
      partiallyAccepted: [],
      wrongAnswerWithPenalty: ["WRONG_ANSWER"],
      wrongAnswerWithoutPenalty: [],
    },
    submissions: contestData.submissions,
  } as ContestData;
  return JSONobject;
};
