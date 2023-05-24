# Issuing PRs, Proof of Concept, and Creating a Release

## Issuing a Pull Request

Once all changes have been made, any applicable tests added, and the linter has applied formats and identified no issues, then it is time to create a pull request.

When creating a pull request, please make sure that if it fixes a bug, adds a requested feature, or implements a suggested refactor, please make sure to include `Fixes #{ISSUE_NUMBER}`. This will help associate the change with the created issue and it will help make sure that issues are closed when their fixes are merged.

Please include a little bit about what the pull request does in the description of the ticket to help give some context to the developers that review the pull request.

### Proof of Concept

A proof of concept may be requested which should be a small example of the refactor that will be created. It should be created as a draft pull request.

These types of pull requests should give an idea of the suggested change without spending the time needed to convert all code to use the suggestion. It can help display the strengths and weaknesses of the suggested change.

## Creating a Release

In order to create a release, there are a couple of steps to go through:

Start by updating the version number in `package.json` and `manifest.json`. Then add a new version entry into `versions.json`.

A version entry in `versions.json` would like something like the following:
```JSON
"{PLUGIN_VERSION}": "{MINIMUM_OBSIDIAN_VERSION}" // i.e. "1.3.4": "0.9.7" 
```
If you are not sure what version to use for `{MINIMUM_OBSIDIAN_VERSION}`, use your current version of Obsidian.

Now that the versions are updated, create a pull request and merge the changes into master. Once that is done go to the [releases tab](https://github.com/platers/obsidian-linter/releases/latest) and select draft a new release. Then you can type in the new tag which should be the version of the release (i.e. `1.3.4`) and have it create the tag on creation of the release. Auto fill the release using the option to "Generate release notes". Then attach the compiled `main.js` and `manifest.json` to the release before publishing the release.
