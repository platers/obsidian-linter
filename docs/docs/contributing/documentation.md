# Linter Documentation

The documentation for the Linter is broken up into a couple of different categories: manually created, template, and generated.

## Manually Created Documentation

Manually created documentation is documentation that lives in the `docs/docs` folder and is not generated. These files are
created and added to the `mkdocs` setup in order to allow them to be hosted with the rest of the documentation for the Linter.
Some examples of manually created documentation include this page and all of the other pages under the "Contributing" heading.

## Generated Documentation

A lot of the documentation for this plugin is generated. See the [Documentation Templates](#documentation-templates) 
section to see which files they are and when they should be updated.

If you are looking to update the rules list information like section, examples, descriptions, or options in the README
or rules documentation, update the rule information in the corresponding rule file located in `src/rules/`.

To update how rules have their information displayed, you will want to update the logic in the `generateDocs` method in 
[docs.ts](https://github.com/platers/obsidian-linter/blob/master/src/docs.ts).

## Additional Information for Rules and Rule Types

Sometimes there is a need to clarify how a rule works, why a rule works the way that it does, or some general things to keep in
mind about specific rule types.

### Additional Information for Rules

Additional info for rules are located under `docs/additional-info/rules/`. The file names are the same as the rule alias for
the rule that they are supposed to add additional information for. Info added in these files generally are used to help clarify
how a rule works or limitations to that specific rule. It can also warn users not to use specific rules with each other.

### Additional Information for Rule Types

Additional info for rules are located under `docs/additional-info/rule-types/`. The file names are the same as the rule type
when lowercased. Info added in these files generally include limitations and things to keep in mind.

## Documentation Templates

Currently there is 1 template file used for generating documentation with:

1. [readme_template.md](https://github.com/platers/obsidian-linter/blob/master/docs/readme_template.md)
  - This template is used for generating the [README](https://github.com/platers/obsidian-linter/blob/master/README.md) file and should be updated for changes that are not rules documentation links and their corresponding sections.

You may also want to take a look at [docs.ts](https://github.com/platers/obsidian-linter/blob/master/src/docs.ts) to modify how the generated files are created.

## Generating Documentation

Before trying to generate documentation, make sure that you have setup the Linter for local use as described in the [Setup Guide](getting-setup.md).

Once that is done, to update the documentation you can run `npm run compile` if you need to compile the code as well or
just run `npm run docs` which just generates the documentation.

!!! note "Not seeing changes to docs?"
    If you run `npm run docs`, but do not see any changes to any of the generated files, try running `npm run build` and then
    try again. The changes may not have been built since they were made.
