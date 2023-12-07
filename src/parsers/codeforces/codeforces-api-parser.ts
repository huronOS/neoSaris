import axios from "axios";
import { sha512 } from "js-sha512";
import { ContestData } from "../../types/contestDataTypes";

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
        timeSubmitted: Math.floor(submission.relativeTimeSeconds / 60),
        contestantName:
          submission.author.teamName || submission.author.members[0].handle || "NO_TEAM_NAME",
        problemIndex: submission.problem.index,
        verdict: submission.verdict,
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
      frozenTimeDuration: frozenTime,
      name: response.result.contest.name,
      type: response.result.contest.type,
      scoreMode: "absolute",
      penaltyPerSubmission: 20,
    },
    problems: response.result.problems.map(problem => {
      return { index: problem.index, name: problem.name };
    }),
    contestants: response.result.rows.map((row, index) => {
      return {
        id: index,
        name: row.party.teamName || row.party.members[0].handle || `NO_TEAM_NAME_${index}`,
      };
    }),
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
  const JSONobject: ContestData = {
    contestMetadata: contestData.contestData,
    problems: contestData.problems,
    contestants: contestData.contestants,
    verdicts: {
      accepted: ["OK", "PARTIAL"],
      partiallyAccepted: [],
      wrongAnswerWithPenalty: [
        "FAILED",
        "RUNTIME_ERROR",
        "WRONG_ANSWER",
        "PRESENTATION_ERROR",
        "TIME_LIMIT_EXCEEDED",
        "MEMORY_LIMIT_EXCEEDED",
        "IDLENESS_LIMIT_EXCEEDED",
        "SECURITY_VIOLATED",
        "CRASHED",
        "INPUT_PREPARATION_CRASHED",
        "CHALLENGED",
        "REJECTED",
        "SKIPPED",
      ],
      wrongAnswerWithoutPenalty: ["COMPILATION_ERROR"],
    },
    submissions: submissions,
  };
  return JSONobject;
};
