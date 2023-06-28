# Open a Pull Request

Before opening a pull request, please start of by linting the repository.

## Linting the Repository

Files should be linted prior to creating a pull request. The linter will make sure that the code follows the desired code
style and formats the files as needed. The linter can be run by `npm run lint` or `npm run compile`.

!!! note "Trailing whitespace and empty line preservation"
    The file linter removes trailing spaces and blank lines. If they are essential use `${''}` at the end of a line or by
    itself on a line to preserve trailing whitespace or empty lines.

    ```JavaScript
    const str = dedent`
      line with essential trailing spaces   ${''}
      ${''}
      previous line is completely blank
    `;
    ```
## Run Unit Tests

The next thing to do is to make sure that all tests are passing by running `npm run test`. If any tests fail, please get them
working before opening a pull request.

## Creating a Pull Request

Once all changes have been made, [any applicable tests added](testing.md#should-you-add-a-test), and the
file linting has applied formats and identified no issues, then it is time to create a pull request.

When creating a pull request, please make sure that if it fixes a bug, adds a requested feature, or
implements a suggested refactor, please make sure to include `Fixes #{ISSUE_NUMBER}`. This will help associate
the change with the created issue and it will help make sure that issues are closed when their fixes are merged.

Please include a little bit about what the pull request does in the description of the ticket to help give some context to the developers that review the pull request.
