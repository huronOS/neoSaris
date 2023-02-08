const verifyObject = contestData => {
  if (contestData == null) {
    throw new Error("contestData is null or undefined!");
  }

  //level 1 objects
  if (contestData.contestMetadata == null) {
    throw new Error("contestData.contestMetadata is null or undefined!");
  }
  if (contestData.contestants == null) {
    throw new Error("contestData.contestants is null or undefined!");
  }
  if (contestData.verdictWithoutPenalty == null) {
    throw new Error("contestData.verdictWithoutPenalty is null or undefined!");
  }
  if (contestData.submissions == null) {
    throw new Error("contestData.submissions is null or undefined!");
  }
  //Check data types
  if (typeof contestData.contestMetadata !== "object") {
    throw new Error("contestData.contestMetadata is not an object!");
  }
  if (contestData.problems == null || !Array.isArray(contestData.problems)) {
    throw new Error("contestData.problems is not an array!");
  }
  if (!Array.isArray(contestData.contestants)) {
    throw new Error("contestData.contestants is not an array!");
  }
  if (typeof contestData.verdictWithoutPenalty !== "object") {
    throw new Error("contestData.verdictWithoutPenalty is not an object!");
  }
  if (!Array.isArray(contestData.submissions)) {
    throw new Error("contestData.submissions is not an array!");
  }

  //Check contestData
  if (
    contestData.contestMetadata.duration == null ||
    typeof contestData.contestMetadata.duration !== "number"
  ) {
    throw new Error("contestData.contestMetadata.Duration is not an number!");
  }
  if (
    contestData.contestMetadata.frozenTime == null ||
    typeof contestData.contestMetadata.frozenTime !== "number"
  ) {
    throw new Error("contestData.contestMetadata.frozenTime is not an number!");
  }
  if (
    contestData.contestMetadata.name == null ||
    typeof contestData.contestMetadata.name !== "string"
  ) {
    throw new Error("contestData.contestMetadata.name is not an string!");
  }
  if (
    contestData.contestMetadata.type == null ||
    typeof contestData.contestMetadata.type !== "string" ||
    contestData.contestMetadata.type !== "ICPC"
  ) {
    throw new Error('contestData.contestMetadata.type is not "ICPC"!');
  }

  //Check contestants
  contestData.contestants.forEach(contestant => {
    if (contestant.id == null || typeof contestant.id !== "number") {
      throw new Error("contestData.contestant.id contain invalid data!");
    }
    if (contestant.name == null || typeof contestant.name !== "string" || contestant.name === "") {
      throw new Error("contestData.contestant.name contain invalid data!");
    }
  });

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
  console.log("neoSaris JSON, Input Object", contestData);
  verifyObject(contestData);
  return contestData;
};
