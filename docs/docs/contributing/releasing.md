# Creating a Release

In order to create a release, there are a couple of steps to go through:

Start by updating the version number in `package.json` and `manifest.json`. Then add a new version entry into `versions.json`.

A version entry in `versions.json` would like something like the following:
```JSON
"{PLUGIN_VERSION}": "{MINIMUM_OBSIDIAN_VERSION}" // i.e. "1.3.4": "0.9.7" 
```
If you are not sure what version to use for `{MINIMUM_OBSIDIAN_VERSION}`, use your current version of Obsidian.

Now that the versions are updated, create a pull request and merge the changes into master. Once that is done
go to the [releases tab](https://github.com/platers/obsidian-linter/releases/latest) and select draft a new release.
Then you can type in the new tag which should be the version of the release (i.e. `1.3.4`) and have it create the tag
on creation of the release. Autofill the release using the option to "Generate release notes". Then attach the
compiled `main.js` and `manifest.json` to the release before publishing the release.
