const verifyObject = contestData => {
  if (contestData == null) {
    throw new Error("contestData is null or undefined!");
  }

  //level 1 objects
  if (contestData.contest == null) {
    throw new Error("contestData.contest is null or undefined!");
  }
  if (contestData.teams == null) {
    throw new Error("contestData.teams is null or undefined!");
  }
  if (contestData.verdictWithoutPenalty == null) {
    throw new Error("contestData.verdictWithoutPenalty is null or undefined!");
  }
  if (contestData.submissions == null) {
    throw new Error("contestData.submissions is null or undefined!");
  }
  //Check data types
  if (typeof contestData.contest !== "object") {
    throw new Error("contestData.contest is not an object!");
  }
  if (typeof contestData.teams !== "object") {
    throw new Error("contestData.teams is not an object!");
  }
  if (typeof contestData.verdictWithoutPenalty !== "object") {
    throw new Error("contestData.verdictWithoutPenalty is not an object!");
  }
  if (!Array.isArray(contestData.submissions)) {
    throw new Error("contestData.contest is not an array!");
  }

  //Check contestData
  if (contestData.contest.duration == null || typeof contestData.contest.duration !== "number") {
    throw new Error("contestData.contest.Duration is not an number!");
  }
  if (
    contestData.contest.frozenTime == null ||
    typeof contestData.contest.frozenTime !== "number"
  ) {
    throw new Error("contestData.contest.frozenTime is not an number!");
  }
  if (
    contestData.contest.numberOfProblems == null ||
    typeof contestData.contest.numberOfProblems !== "number"
  ) {
    throw new Error("contestData.contest.numberOfProblems is not an number!");
  }
  if (
    contestData.contest.problemsIndex == null ||
    !Array.isArray(contestData.contest.problemsIndex)
  ) {
    throw new Error("contestData.contest.problemsIndex is not an array!");
  }
  if (contestData.contest.name == null || typeof contestData.contest.name !== "string") {
    throw new Error("contestData.contest.name is not an string!");
  }

  //Check Teams
  for (const [key, value] of Object.entries(contestData.teams)) {
    if (key == null || typeof key !== "string" || key === "") {
      throw new Error("contestData.contest.teams contain invalid data!");
    }
    if (value == null || typeof value !== "string" || value === "") {
      throw new Error("contestData.contest.teams contain invalid data!");
    }
  }

  //Check VerdictWithoutPenalty
  for (const [key, value] of Object.entries(contestData.verdictWithoutPenalty)) {
    if (key == null || typeof key !== "string" || key === "") {
      throw new Error("contestData.verdictWithoutPenalty contain invalid data!");
    }
    if (value == null || typeof value !== "string" || value === "") {
      throw new Error("contestData.verdictWithoutPenalty contain invalid data!");
    }
  }

  //Check submissions
  contestData.submissions.forEach(submission => {
    console.log(submission);
    if (submission == null) {
      throw new Error(
        `contestData.submissions contains invalid data!\nSubmission is null or undefined\n${JSON.stringify(
          submission
        )}`
      );
    }
    if (submission.timeSubmission == null || typeof submission.timeSubmission !== "number") {
      throw new Error(
        `contestData.submissions contains invalid data!\nSubmission have invalid timeSubmission\n${JSON.stringify(
          submission
        )}`
      );
    }
    if (
      submission.teamName == null ||
      typeof submission.teamName !== "string" ||
      submission.teamName === ""
    ) {
      throw new Error(
        `contestData.submissions contains invalid data!\nSubmission have invalid TeamName\n${JSON.stringify(
          submission
        )}`
      );
    }
    if (
      submission.problem == null ||
      typeof submission.problem !== "string" ||
      submission.teamName === ""
    ) {
      throw new Error(
        `contestData.submissions contains invalid data!\nSubmission have invalid Problem\n${JSON.stringify(
          submission
        )}`
      );
    }
    if (
      submission.verdict == null ||
      typeof submission.verdict !== "string" ||
      submission.teamName === ""
    ) {
      throw new Error(
        `contestData.submissions contains invalid data!\nSubmission have invalid verdict\n${JSON.stringify(
          submission
        )}`
      );
    }
  });
};

export const getContestDataWithNeoSarisJSON = rawText => {
  let contestData = {};
  contestData = JSON.parse(rawText);
  verifyObject(contestData);
  return contestData;
};
