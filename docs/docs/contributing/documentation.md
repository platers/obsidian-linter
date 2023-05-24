# Linter Documentation

Documentation can be broken up into two parts: generated documentation and documentation templates.

## Generated Documentation

A lot of the documentation for this plugin is generated. See the [Documentation Templates](#documentation-templates) section to see which files they are and when they should be updated.

If you are looking to update the rules list information like section, examples, descriptions, or options in the Readme or rules documentation, update the rule information in the corresponding rule in `rules.ts`.  

## Documentation Templates

There are currently two documentation templates:

1. [readme_template.md](docs/readme_template.md)
  - This template is used for generating the [README](README.md) file and should be updated for changes that are not rules documentation links and their corresponding sections.
2. [rules_template.md](docs/rules_template.md)
  - This template is used for generating the [rules.md](docs/rules.md) file and should be updated when you want to change the style or escaping of rule information or examples.

You may also want to take a look at `docs.ts` to modify how the generated files are created.

## Generating Documentation

To update the documentation you can run `npm run compile` if you need to compile the code as well or just run `npm run docs` which just generates the documentation.
