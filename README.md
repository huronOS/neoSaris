## ICPC Resolver - Saris by Club Algoritmia ESCOM

The code of this repository contains a react app that can be used locally to simulate what happens in the frozen time during a competitive programming competition.

It is inspired by the [ICPC Resolver](https://icpc.baylor.edu/icpctools/resolver/Resolver.pdf).

The main idea for this project was to have a resolver for any Codeforces contest. This idea has changed, and the resolver can be used with any contest because it depends on a JSON input and not on the online judge.

In order to run this tool, you need to follow the [installation](#Installation) steps.

### Installation

To run this tool first you need to get the repository. You can either download the source code in your computer or run the following command:

`git clone https://github.com/galloska/SarisForCodeforces.git`

Once you have downloaded the source code you need to install the dependencies of the project with the following command on the root folder of this project:

`npm install`

Once you have run this command, just type next command in the root folder of the project and start using Saris:

`npm start`

### Input - What the tool needs to run the Resolver

The resolver (Saris) needs a JSON file in the [src/log](https://github.com/galloska/SarisForCodeforces/tree/master/src/logs) folder with the following format:

```
{
  "Contest": {
		"Duration": 300,
		"FrozenTime": 60,
		"NumberOfProblems": 10
	},
	"Teams": {
    "1": "Red Panda",
		"2": "Moscow IPT 1",
		"3": "Moscow IPT Jinotega",
    .
    .
    .
  },
  "VerdictWithoutPenalty": {
    "1": "Compilation error",
    .
    .
    .
  },
  "Submissions": [
    {
      "timeSubmission":  47,
      "TeamName":  "Moscow IPT Jinotega",
      "Problem":  "A",
      "Verdict":  "Accepted"
    },
    .
    .
    .
    {
  		"timeSubmission":  260,
  		"TeamName":  "Moscow IPT 1",
  		"Problem":  "H",
  		"Verdict":  "Wrong answer"
	  }
	]
}
```

Contest: The Contest part contains information about the competition such as duration, frozen time and the number of problems.

Teams: In the team’s part the key value is the identifier of the team and it is followed by the name of the team. The key value must be unique for each team and if you want show an image related with that team, you can copy the image to [src/university_logos](https://github.com/galloska/SarisForCodeforces/tree/master/src/university_logos) and rename it to `key.png` where 'key' is the key value in the JSON file for that team.

VerdictWithoutPenalty: This includes those verdicts that does not affect penalty time for teams. For example, in some contest a runtime error adds penalty time and in some others this verdict is not considered for a penalty.

Submissions: An array containing the submissions of the contest. Each submission must have the time submission in minutes, the team that submitted the solution, the problem that was submitted and the verdict.

Verdicts can be anything you want except the Accepted verdict that must be "Accepted".

If you have a JSON file with these requirements, then you can run this tool and start revealing the scoreboard.

### Special commands

There are some commands that you need to type that make this tool to work. The commands are the following ones:

Enter: If you click enter for the first time then the UI goes to the next pending submission from bottom to top, and highlited it to let know the user that is the current pending submission the score is going to reveal.

If it is the second time you type the enter key, then it reveals current pending submission.

Ctrl + Delete: Reveals the final standings.

Ctrl + Back space: Reveals standing until the top 10. That means the top 10 will be in the frozen stage and then you can go one by one revealing the results.
