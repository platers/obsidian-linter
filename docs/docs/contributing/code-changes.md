# Code Changes

TODO: update this content and break it apart into its own files where it seems best

## Bug Fixes

When fixing a bug, if the bug is specific to one of more rules, please add tests to cover the scenarios where the bug ocurred.
If you are not aware of how to do this, please see [Adding Tests](#adding-tests) below.

It can be helpful to add a test that recreates the bug prior to making changes to the code, then once the failing test case(s) is/are in place, all that is left is to get them to pass without breaking other tests. This may not work for everyone

## Refactoring Code

When planning to refactor large portions of code, please create an issue on the repository before creating a pull request, so that the suggested refactor can be looked at before any work or [proof of concept](#proof-of-concept) is requested. This will help save time for everyone involved.

Once the proof of concept, if requested, or refactor idea gets the green light, feel free to create a [pull request](#issuing-a-pull-request) with the suggested changes present or convert the draft pull request to a regular pull request.

## Linting Files

Files should be linted prior to creating a pull request. The linter will make sure that the code follows the desired codestyle and formats the files as needed. The linter can be run by `npm run lint` or `npm run compile`

Note that linter removes trailing spaces and blank lines. In case if they are essential use the following trick to preserve them

```js
const str = dedent`
  line with essential trailing spaces   ${''}
  ${''}
  previous line is completely blank
`;
```
