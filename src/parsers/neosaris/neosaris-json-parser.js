const verifyObject = contestData => {
  if (contestData == null) {
    throw new Error("contestData is null or undefined!");
  }

  //level 1 objects
  if (contestData.Contest == null) {
    throw new Error("contestData.Contest is null or undefined!");
  }
  if (contestData.Teams == null) {
    throw new Error("contestData.Teams is null or undefined!");
  }
  if (contestData.VerdictWithoutPenalty == null) {
    throw new Error("contestData.VerdictWithoutPenalty is null or undefined!");
  }
  if (contestData.Submissions == null) {
    throw new Error("contestData.Submissions is null or undefined!");
  }
  //Check data types
  if (typeof contestData.Contest !== "object") {
    throw new Error("contestData.Contest is not an object!");
  }
  if (typeof contestData.Teams !== "object") {
    throw new Error("contestData.Teams is not an object!");
  }
  if (typeof contestData.VerdictWithoutPenalty !== "object") {
    throw new Error("contestData.VerdictWithoutPenalty is not an object!");
  }
  if (!Array.isArray(contestData.Submissions)) {
    throw new Error("contestData.Contest is not an array!");
  }

  //Check contestData
  if (contestData.Contest.Duration == null || typeof contestData.Contest.Duration !== "number") {
    throw new Error("contestData.Contest.Duration is not an number!");
  }
  if (
    contestData.Contest.FrozenTime == null ||
    typeof contestData.Contest.FrozenTime !== "number"
  ) {
    throw new Error("contestData.Contest.FrozenTime is not an number!");
  }
  if (
    contestData.Contest.NumberOfProblems == null ||
    typeof contestData.Contest.NumberOfProblems !== "number"
  ) {
    throw new Error("contestData.Contest.NumberOfProblems is not an number!");
  }
  if (
    contestData.Contest.ProblemsIndex == null ||
    !Array.isArray(contestData.Contest.ProblemsIndex)
  ) {
    throw new Error("contestData.Contest.ProblemsIndex is not an array!");
  }
  if (contestData.Contest.Name == null || typeof contestData.Contest.Name !== "string") {
    throw new Error("contestData.Contest.Name is not an string!");
  }

  //Check Teams
  for (const [key, value] of Object.entries(contestData.Teams)) {
    if (key == null || typeof key !== "string" || key === "") {
      throw new Error("contestData.Contest.Teams contain invalid data!");
    }
    if (value == null || typeof value !== "string" || value === "") {
      throw new Error("contestData.Contest.Teams contain invalid data!");
    }
  }

  //Check VerdictWithoutPenalty
  for (const [key, value] of Object.entries(contestData.VerdictWithoutPenalty)) {
    if (key == null || typeof key !== "string" || key === "") {
      throw new Error("contestData.VerdictWithoutPenalty contain invalid data!");
    }
    if (value == null || typeof value !== "string" || value === "") {
      throw new Error("contestData.VerdictWithoutPenalty contain invalid data!");
    }
  }

  //Check submissions
  contestData.Submissions.forEach(submission => {
    console.log(submission);
    if (submission == null) {
      throw new Error(
        `contestData.Submissions contains invalid data!\nSubmission is null or undefined\n${JSON.stringify(
          submission
        )}`
      );
    }
    if (submission.timeSubmission == null || typeof submission.timeSubmission !== "number") {
      throw new Error(
        `contestData.Submissions contains invalid data!\nSubmission have invalid timeSubmission\n${JSON.stringify(
          submission
        )}`
      );
    }
    if (
      submission.TeamName == null ||
      typeof submission.TeamName !== "string" ||
      submission.TeamName === ""
    ) {
      throw new Error(
        `contestData.Submissions contains invalid data!\nSubmission have invalid TeamName\n${JSON.stringify(
          submission
        )}`
      );
    }
    if (
      submission.Problem == null ||
      typeof submission.Problem !== "string" ||
      submission.TeamName === ""
    ) {
      throw new Error(
        `contestData.Submissions contains invalid data!\nSubmission have invalid Problem\n${JSON.stringify(
          submission
        )}`
      );
    }
    if (
      submission.Verdict == null ||
      typeof submission.Verdict !== "string" ||
      submission.TeamName === ""
    ) {
      throw new Error(
        `contestData.Submissions contains invalid data!\nSubmission have invalid verdict\n${JSON.stringify(
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
