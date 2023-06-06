# Debug Settings

The debug settings are designed to help the user get their settings and do some debugging on their own. It can also help developers determine the cause of an issue as well.

## Log Level

This is the type of logs to actually keep track of.
Here are the different levels along with what types of logs they pertain to:

| Level | Types of Logs |
| ----- | ------------- |
| silent | No error logs are logged,but notices will be displayed |
| error | Error logs that prevent the Linter from functioning |
| warn | Warnings about potential issues that might just be nothing, but could be a problem |
| info | Logs that let you know that high level things happened like the plugin loaded, unloaded, set the moment locale to a specific value, etc. |
| debug | Logs that help when debugging the Linter in order to figure out what is going on in the Linter |
| trace | Logs that help figure out what areas of code were hit |

!!! Note "Level Recommendation"
    Use either error or warn for your log level unless you are looking into a bug or looking for info to include on a bug report.

## Linter Config

This the Linter's settings. It makes the values in the `data.json` easier to access. This value should ve provided on all bug reports.

## Collecting Logs in the Linter

If you encounter an error or are hitting some kind of performance issue and would like to help determine what th problem is, you can collect logs when linting a single file on save or single file lint.

!!! Note "Logs Present"
    The log that are kept track of are based on the value of [Log Level](#log-level).

!!! Info "Log Reporting"
    The logs that will be stored are entirely local. They are not sent anywhere and have to be copied by a user to a bug report in order for those working on the Linter to know.
