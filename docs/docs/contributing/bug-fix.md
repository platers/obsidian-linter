# Bug Fixes

Before trying to fix a bug, make sure that you have setup the Linter for local use as described in the [Setup Guide](getting-setup.md).

Once the Linter is setup as a local repo, there are several things that can be done to fix bugs.

## Identify the Cause of the Bug

When a bug has been reported or encountered and you do not know where the bug is, it can be very helpful to try a couple
of things to narrow down what causes the bug.

### Load in Config that Causes the Bug

The first thing that I tend to do once I get a bug report is make sure I have the `data.json` of the person who reported the
issue. Without having this, it can be very hard to reproduce the issue in some cases.

### Start Disabling Rules

Once I have the config loaded, the next step is start disabling rules. I will generally start with 1 rule being disabled at a
time before re-linting the file in question to see if it reproduces the issue in question. I will sometimes just turn off a
bunch of unrelated rules when I am fairly confident that these rules are unrelated.

The end goal of disabling rules is to get down to just 1 rule that causes the issue. If you have to have 2 or more rules
active in order to cause the issue, the bug fix will get a lot tougher.

!!! note "multiple rule bugs"
    When a bug is caused by multiple rules making changes to a file, the only way to currently reproduce the behavior
    is in Obsidian itself. So you need to run `npm run build` once you have added `console.log` statements to
    [rules-runner.ts](https://github.com/platers/obsidian-linter/blob/master/src/rules-runner.ts) to help narrow down what the
    text looks like when it is being processed by each of the rules that are enabled in order to cause the bug.

## Create a Unit Test

If the bug is caused by a single rule, please [add a unit test](testing.md#adding-tests) to the rule's [general test suite](testing.md#general-rule-test-suites).
This will make it easier to tell when the bug is fixed and help make sure that we do not cause the same issue again down the
road.

## Update Code

Now comes the fun part: updating the code to fix the bug. Sometimes this is straight forward and other times this is complex.
The thing that will dictate how hard the fix will be is how complex the rule logic is already.

## Create a Pull Request

Once you have updated the code and the bug is fixed, then [open a pull request](open-a-pr.md).
