import axios from "axios"
import { sha512 } from "js-sha512"

const buildParams = () => {
    const time = `${Math.floor(Date.now() / 1000)}`;
    const groupCode = "DVzG4G4yZx"
    const contestId = "422656"
    const apiKey = ""
    const apiSecret = ''
    const rand = "123456"
    const str = `${rand}/contest.status?apiKey=${apiKey}&contestId=${contestId}&groupCode=${groupCode}&time=${time}#${apiSecret}`
    const hash = sha512(encodeURI(str))
    return {
        groupCode,
        contestId,
        apiKey,
        time,
        apiSig: rand + hash,
    }
}

const { data: response } = await axios.request({
    method: "GET",
    url: "https://codeforces.com/api/contest.status",
    data: {},
    headers: {},
    params: buildParams()
});

const submissions = response.result.map((submission) => {
    return {
        "timeSubmission": submission.relativeTimeSeconds,
        "TeamName": submission.author.teamName ?? "NO_TEAM",
        "Problem": submission.problem.index,
        "Verdict": submission.verdict
    }
}
)
