## Saris Resolver - ICPC Resolver

![Example image of Saris by Club Algoritmia ESCOM](/public/exampleImage.PNG)

The code of this repository contains a react app that can be used to simulate what happens in the frozen time during a competitive programming competition with the ICPC standard rules.

It is inspired by the [ICPC Resolver](https://tools.icpc.global/resolver/).

The main idea for this project was to have a resolver for any Codeforces contest. This idea has changed, and the resolver can be used with any contest because it depends it can take a JSON input to not on the online judge.
It has also been integrated with the Codeforces API and it can be selected as a source of data and use your own API Keys and API Secrets with the client app.

In order to use this tool, you can either use it online on [saris.huronos.org](https://saris.huronos.org) thanks to the huronOS project, or you can install it locally following the [installation](#Installation) steps.

### Online Judges Integrations

#### Codeforces

Currently, Saris is integrated with the [Codeforces API](https://codeforces.com/apiHelp), but in order to access to private contests, the app will require your own API Key and API Secret. This sensible data is only used on this app (client) and it is only sent vía API request and never stored.

The user which provides the API Key and the API Secret needs to be manager of the contest in order to query the Status of the contest. Also, due to the design of the API, **the status do not provide frozen standings**, so it will be necessary to unfroze the standing for a bit when loading the resolver, and then they can be frozen again.

#### Other OJ

Feel free to add parsers to the [src/parsers](src/parsers/) directory to then be integrated with the React App. Here you can add static parsers (from text to the required JSON format), or API parsers that integrates Saris directly to another online judge.

### Installation

To run this tool first you need to get the repository. You can either download the source code in your computer or run the following command:

`git clone https://github.com/equetzal/SarisResolver.git`

Once you have downloaded the source code you need to install the dependencies of the project with the following command on the root folder of this project:

`npm install`

Once you have run this command, just type next command in the root folder of the project and start using Saris:

`npm start`

### Input - What the tool needs to run the Resolver

The resolver needs a JSON input format that follows object model of [example.json](https://github.com/equetzal/SarisResolver/tree/public/example.json):

```
{
  "Contest": {
    "Duration": 300,
    "FrozenTime": 60,
    "NumberOfProblems": 10,
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
      "timeSubmission":  47,
      "TeamName":  "Moscow IPT Jinotega",
      "Problem":  "A",
      "Verdict":  "Accepted"
    },
    {
      "timeSubmission":  260,
      "TeamName":  "Moscow IPT 1",
      "Problem":  "H",
      "Verdict":  "Wrong answer"
    }
  ]
}
```

**Contest:** The Contest part contains information about the competition such as duration, frozen time, the number of problems and the name of the contest.

**Teams:** In the team’s part the key value is the identifier of the team and it is followed by the name of the team. The key value must be unique for each team and if you want show an image related with that team, you can copy the image to [src/university_logos](https://github.com/galloska/SarisByClubAlgoritmiaESCOM/tree/master/src/university_logos) and rename it to `key.png` where 'key' is the key value in the JSON file for that team.

**VerdictWithoutPenalty:** This includes those verdicts that does not affect penalty time for teams. For example, in some contest a runtime error adds penalty time and in some others this verdict is not considered for a penalty.

**Submissions:** An array containing the submissions of the contest. Each submission must have the time submission in minutes, the team that submitted the solution, the problem that was submitted and the verdict.

Verdicts can be anything you want except the Accepted verdict that must be **Accepted**.

If you have a JSON file with these requirements, then you can run this tool and start revealing the scoreboard.

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
- [ ] Support vjudge API to unfroze standings
- [ ] Support BOCA for LATAM competitions.
