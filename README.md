# Saris Resolver - ICPC Resolver

![Example image of Saris by Club Algoritmia ESCOM](/public/exampleImage.PNG)

The code of this repository contains a react app that can be used to simulate what happens in the frozen time during a competitive programming competition with the ICPC standard rules.

It is inspired by the [ICPC Resolver](https://tools.icpc.global/resolver/). This application is a fork of the original (and abandoned) [SarisByAlgoritmiaESCOM](https://github.com/galloska) created by [galloska](https://github.com/galloska). So, this project took that work and started working with integrations to be easy to use.

## How to Use

This tool is available on **[saris.huronos.org](https://saris.huronos.org)** thanks to the huronOS project who is providing the hosting.
You can either use it online as a web client, or you can install it locally following the [installation](#Installation) steps.

## Online Judges Integrations

Currently, Saris uses a data format described on the following subsection. But it have some integrations with:

- Codeforces
- vJudge

So that saris automatically parse data (from API or another data syntax) to the required Saris Raw Data format.

### Raw Data

The resolver needs a JSON input format that follows object model of [example.json](https://github.com/equetzal/SarisResolver/tree/public/example.json):

```json
{
  "Contest": {
    "Duration": 300,
    "FrozenTime": 60,
    "NumberOfProblems": 10,
    "ProblemsIndex": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    "Name": "Trial Contest"
  },
  "Teams": {
    "1": "Red Panda",
    "2": "Moscow IPT 1",
    "3": "Moscow IPT Jinotega"
  },
  "VerdictWithoutPenalty": {
    "1": "Compilation error"
  },
  "Submissions": [
    {
      "timeSubmission": 47,
      "TeamName": "Moscow IPT Jinotega",
      "Problem": "A",
      "Verdict": "Accepted"
    },
    {
      "timeSubmission": 260,
      "TeamName": "Moscow IPT 1",
      "Problem": "H",
      "Verdict": "Wrong answer"
    },
    {
      "timeSubmission": 270,
      "TeamName": "Moscow IPT 1",
      "Problem": "A",
      "Verdict": "Accepted"
    }
  ]
}
```

**Contest:** The Contest part contains information about the competition such as duration, frozen time, the number of problems and the name of the contest.

**Teams:** In the team’s part the key value is the identifier of the team and it is followed by the name of the team. The key value must be unique for each team and if you want show an image related with that team, you can copy the image to [src/university_logos](https://github.com/galloska/SarisByClubAlgoritmiaESCOM/tree/master/src/university_logos) and rename it to `key.png` where 'key' is the key value in the JSON file for that team.

**VerdictWithoutPenalty:** This includes those verdicts that does not affect penalty time for teams. For example, in some contest a runtime error adds penalty time and in some others this verdict is not considered for a penalty.

**Submissions:** An array containing the submissions of the contest. Each submission must have the time submission in minutes, the team that submitted the solution, the problem that was submitted and the verdict.

Verdicts can be anything you want except the Accepted verdict that must be **Accepted**.

### Codeforces

Currently, Saris is integrated with the [Codeforces API](https://codeforces.com/apiHelp). This integration will let you access **private contests** (public contests integration is WIP), and parse their responses to the Saris format, allowing you to unfreeze the standing.

To do this, the app will require an API Key and API Secret of a **manager** user of the **private group** you want to access.
We know this is sensible data, so these keys are only used on this react app as a client (they only live in your browser), and they are only sent to codeforces via their API.
You can verify this on the [implementation](./src/parsers/codeforces/codeforces-api-parser.js).

#### IMPORTANT

- The user which provides the API Key and the API Secret needs to be manager of the contest in order to query the Status of the contest.
- Also, due to the design of the API, **the status do not provide unfrozen standings**, so it will be necessary to unfroze the standing for a bit when loading the resolver, and then they can be frozen again.

### vJudge

Currently, vJudge does not provide a public API but it does have an API for its own frontend which can be accessed by foreign applications.

#### Public contests

To unfreeze the public contests just use the contestId, and Saris will prepare the standing.
Note that currently vJudge do not froze standings, so you might only want to use Saris with vJudge when revealing prizes.

#### Private contests

Unfortunately vJudge API does not provide an authentication method, it requires of the user _cookies_ in order to provide a response for **private contests**. We cannot integrate a foreign cookie in our requests as that would be a violation almost all browsers security policies. But a local client (node) which is not ran within a browser, can use the cookie to request the API.

To do this, please:

1. Download the repo as `git clone https://github.com/equetzal/SarisResolver`
2. Make sure to be logged in vJudge, and to be manager of the private contest you want to unfreeze.
3. Go to the rank page of the contest, press `ctrl + shift + i` to open the page inspector.
4. Open the network tab and reload the page.
5. Look for the last request with the number of the contest which endpoint is `https://vjudge.net/contest/rank/single/`
6. Check the request headers, and copy the `cookie` header.
7. Go to the repository and replace the values for this command:
   ```bash
   node src/parsers/vjudge/vjudge-api-parser-private.js $FROZEN_TIME_MINUTES $CONTEST_ID $NUMBER_OF_PROBLEMS "$COOKIE" $OUTPUT_FILE
   ```
   It's important to notice that the cookie must be a string to work.
8. Open the `$OUPUT_FILE` you specified, and you'll find the Raw Data required to run Saris.
9. Copy and paste all the content of the Raw Data, on the Saris Raw Data source.
10. Click on `Start Dancing`

### Other OJ

Feel free to add parsers to the [src/parsers](src/parsers/) directory to then be integrated with the React App. Here you can add static parsers (from text to the required JSON format), or API parsers that integrates Saris directly to another online judge.

### Local Installation

To run this tool first you need to get the repository. You can either download the source code in your computer or run the following command:

`git clone https://github.com/equetzal/SarisResolver.git`

Once you have downloaded the source code you need to install the dependencies of the project with the following command on the root folder of this project:

`npm install`

Once you have run this command, just type next command in the root folder of the project and start using Saris:

`npm start`

### Special commands

There are some commands that you need to type that make this tool to work. The commands are the following ones:

**Enter:** If you click enter for the first time then the UI goes to the next pending submission from bottom to top, and highlited it to let the user know that is the current pending submission the score is going to reveal.

If it is the second time you type the enter key, then it reveals the current pending submission.

**Ctrl + Delete:** Reveals the final standings.

**Ctrl + Back space:** Reveals standing until the top 10. That means the top 10 will be in the frozen stage and then you can go one by one revealing the results.

### Contribute!

This project is open for contributions, currently there's some goals planned:

- [x] Support Codeforces API
- [ ] Fully refactor the project to use React functional components
- [ ] Migrate the project to Typescript
- [ ] Support IOI-like contests (partial scoring)
- [x] Support vjudge API to unfroze standings
- [ ] Support BOCA for LATAM competitions.
