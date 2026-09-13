import {existsSync, readFileSync, writeFileSync} from 'fs';
import {moment} from 'obsidian';
import dedent from 'ts-dedent';
import {rules} from '../src/rules';
import {RulesRunner} from '../src/rules-runner';
import {DEFAULT_SETTINGS, LinterSettings} from '../src/settings-data';
import {setLanguage} from '../src/lang/helpers';
import {parseCustomReplacements} from '../src/utils/strings';
import '../src/rules-registry';

// A change to how rules see the document is only safe if the document they produce does not
// change. This lints a corpus and writes the result of each document to a file, so that the same
// corpus can be linted with and without the change and the two files compared. Set DUMP_PATH to
// write the dump; without it this still runs every document and only checks that none of them
// blow up in a way that is not recorded.
//
//   DUMP_PATH=/tmp/new.txt npx jest __tests__/zz-runner-diff.test.ts
//   git stash push -- src/
//   DUMP_PATH=/tmp/old.txt npx jest __tests__/zz-runner-diff.test.ts
//   git stash pop
//   diff /tmp/old.txt /tmp/new.txt
//
// Check the stash actually reverted something. Comparing code against itself passes and means
// nothing.

const largeFixturePath = 'Introduction.to.a.Self.Managed.Life.md';
const largeFixtureLineCount = 600;

let misspellings: Map<string, string>;

/**
 * Turns every rule on, so that the dump covers as much of the linter as one run can.
 *
 * The runner reads the enabled flag off a rule's config before doing anything with it, so every
 * rule needs an entry whether or not the defaults mention it.
 * @return {LinterSettings} Settings with every rule enabled and every time dependent input fixed
 */
function settingsWithEveryRuleEnabled(): LinterSettings {
  const settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as LinterSettings;

  settings.ruleConfigs = {};
  for (const rule of rules) {
    const config = Object.assign(rule.getDefaultOptions(), DEFAULT_SETTINGS.ruleConfigs[rule.settingsKey] ?? {});
    // a rule builds its options by assigning the settings over the defaults its options class
    // declares, and assigning an undefined value wins, so an option the settings have no value for
    // has to be left out rather than passed through as undefined
    for (const key of Object.keys(config)) {
      if (config[key] === undefined) {
        delete config[key];
      }
    }

    config.enabled = true;
    settings.ruleConfigs[rule.settingsKey] = config;
  }

  settings.logLevel = 'ERROR';

  return settings;
}

function lint(text: string, settings: LinterSettings): string {
  return new RulesRunner().lintText({
    oldText: text,
    fileInfo: {name: 'note', createdAtFormatted: '2025-05-11T19:34:17-04:00', modifiedAtFormatted: '2025-05-31T12:38:50-04:00', path: 'note.md'},
    settings,
    momentLocale: 'en',
    getCurrentTime: () => moment('2025-05-31T12:38:50-04:00'),
    defaultMisspellings: misspellings,
  });
}

type corpusDocument = {name: string, text: string};

// Each of these targets something that broke while the masking was being worked on, so that a
// change that reintroduces one of those failures shows up in the diff rather than in a bug report.
const adversarialDocuments: corpusDocument[] = [
  {
    name: 'an anchor tag wrapping a bare url',
    text: 'See <a href="https://example.com/a">https://example.com/a</a> for more.\n',
  },
  {
    name: 'frontmatter followed by a thematic break',
    text: '---\ntitle: a title\n---\n\n---\n\nbody\n',
  },
  {
    name: 'a templater command containing markdown',
    text: 'before\n\n<% tp.file.include("[[a note]]") %>\n\n<% "# not a heading" %>\n\nafter\n',
  },
  {
    name: 'nested emphasis reporting overlapping positions',
    text: '*)*g**\n',
  },
  {
    name: 'nested blockquotes with empty lines in them',
    text: '> > a\n> >\n> > b\n>\n> c\n\nafter\n',
  },
  {
    name: 'nested lists',
    text: '- one\n  - two\n    - three\n1. first\n   1. second\n\nafter\n',
  },
  {
    name: 'a checklist next to a blank line',
    text: '- [ ] a task\n\n- [x] another task\n  - [ ] a nested task\n\nafter\n',
  },
  {
    name: 'a heading ending in several punctuation characters',
    text: '# Heading!!!\n\nbody\n\n## Another one...\n\nmore\n',
  },
  {
    name: 'footnotes referenced out of order',
    text: 'a[^2] and b[^1].\n\n[^1]: the first note\n\n[^2]: the second note\n\nafter\n',
  },
  {
    name: 'a document that is only whitespace',
    text: '   \n\t\n   \n',
  },
  {
    name: 'the empty document',
    text: '',
  },
  {
    name: 'a custom ignore section wrapping content the rules would otherwise change',
    text: 'before\n\n<!-- linter-disable -->\n#  a heading   \n-   an item\n<!-- linter-enable -->\n\nafter\n',
  },
  {
    name: 'a table next to a thematic break',
    text: '| a | b |\n| --- | --- |\n| 1 | 2 |\n---\nafter\n',
  },
  {
    name: 'math blocks and inline math sharing a line',
    text: 'text $$x = 1$$ more\n\n$$\ny = 2\n$$\n\nafter\n',
  },
  {
    name: 'code fences with and without a language',
    text: '```\nplain\n```\n\n```js\nconst a = 1;\n```\n\n~~~\ntilde\n~~~\n',
  },
  {
    name: 'wiki links and tags next to urls',
    text: 'A [[wiki link]] and #a-tag and https://example.com/b and [a link](https://example.com/c).\n',
  },
  // Whether a rule may change the whitespace touching an ignored region depends on whether the
  // placeholder that used to stand in for that region would itself have satisfied whatever the
  // rule matches on. Two rules that look alike disagree about it, so the boundary needs documents
  // of its own rather than being left to turn up inside some larger case.
  {
    name: 'runs of spaces on both sides of ignored constructs',
    text: 'text  [a link](https://example.com)  more  `inline code`  and  [[a wiki link]]  and  #a-tag  end\n',
  },
  {
    name: 'punctuation separated from ignored constructs by a space',
    text: 'see [a link](https://example.com) , and `code` ; and [[a wiki]] ! and ( spaced )\n',
  },
  {
    name: 'ignored constructs sitting directly against each other',
    text: '`one``two` and [[a]][[b]] and $x$$y$ end\n',
  },
  {
    name: 'a list item whose text runs up against ignored constructs',
    text: '-  an item  with  `code`  in it\n-  [a link](https://example.com)  after  two  spaces\n',
  },
  {
    // masking a list collapsed it to a single line, which moves where a line starts, and the rule
    // that collapses runs of spaces declines to touch a line beginning with a blockquote marker
    name: 'blockquote markers and lists sharing a run of spaces',
    text: '>  quoted  text\n\n-  a list  item\n   -  nested  item\n\n>  after  the  list\n>  more  quoted  text\n',
  },
  {
    name: 'a mix of the constructs the rules tend to fight over',
    text: dedent`
      ---
      title: a title
      tags: [one, two]
      ---
      ${''}
      # Heading!!
      ${''}
      > a quote
      >
      > more quote
      ${''}
      - a list
        - nested
      ${''}
      \`\`\`js
      const a = 1;
      \`\`\`
      ${''}
      Some *emphasis* and **strong** and \`code\` and [a link](https://example.com).
    `,
  },
];

function buildCorpus(): corpusDocument[] {
  const corpus: corpusDocument[] = [];

  for (const rule of rules) {
    let index = 0;
    for (const example of rule.examples) {
      corpus.push({name: `${rule.alias} example ${index++}`, text: example.before});
    }
  }

  corpus.push(...adversarialDocuments);

  // untracked, so the dump is smaller when it is missing rather than the run failing
  if (existsSync(largeFixturePath)) {
    const text = readFileSync(largeFixturePath, 'utf8').split('\n').slice(0, largeFixtureLineCount).join('\n');
    corpus.push({name: `the first ${largeFixtureLineCount} lines of ${largeFixturePath}`, text});
  }

  return corpus;
}

describe('the linter produces the same documents it did before', () => {
  beforeAll(() => {
    setLanguage('en');
    misspellings = parseCustomReplacements(readFileSync('src/utils/default-misspellings.md', 'utf8'));
  });

  it('lints the corpus', () => {
    const settings = settingsWithEveryRuleEnabled();
    const corpus = buildCorpus();
    const lines: string[] = [];

    let index = 0;
    for (const document of corpus) {
      let output: string;
      try {
        output = lint(document.text, settings);
      } catch (error) {
        // a rule that refuses a document is a result like any other, and one that starts or stops
        // refusing it is a difference worth seeing
        output = `THREW: ${error instanceof Error ? error.message : String(error)}`;
      }

      lines.push(`${index++}\u0001${document.name}\u0001${JSON.stringify(output)}`);
    }

    if (process.env.DUMP_PATH) {
      writeFileSync(process.env.DUMP_PATH, lines.join('\n') + '\n');
    }

    expect(lines.length).toBe(corpus.length);
  });
});
