import SentencePerLine from '../src/rules/sentence-per-line';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: SentencePerLine,
  testCases: [
    {
      testName: 'A basic multi-sentence paragraph is split one sentence per line',
      before: dedent`
        This is a sentence. This is another sentence. And a third one here.
      `,
      after: dedent`
        This is a sentence.
        This is another sentence.
        And a third one here.
      `,
    },
    {
      testName: 'A soft-wrapped single sentence is reflowed onto one line',
      before: dedent`
        This sentence was
        soft wrapped across
        three source lines.
      `,
      after: dedent`
        This sentence was soft wrapped across three source lines.
      `,
    },
    {
      testName: 'A sentence that starts with a link is split correctly',
      before: dedent`
        See the start. [The docs](https://example.com) explain it well.
      `,
      after: dedent`
        See the start.
        [The docs](https://example.com) explain it well.
      `,
    },
    {
      testName: 'B2: an initial before a link atom (default options) is not split',
      before: dedent`
        Edited by J. [the source](https://ex.com) and reviewed here.
      `,
      after: dedent`
        Edited by J. [the source](https://ex.com) and reviewed here.
      `,
    },
    {
      testName: 'B3: a regex-metachar terminator inside a masked link never splits it',
      before: dedent`
        Go to [a](https://x.io/p?q=1.2) now. Stop here please.
      `,
      after: dedent`
        Go to [a](https://x.io/p?q=1.2) now.
        Stop here please.
      `,
      options: {
        sentenceTerminators: '.?',
        abbreviationList: [],
      },
    },
    {
      testName: 'Abbreviations, decimals, and versions are not split',
      before: dedent`
        The value is 3.14 per Dr. Smith using v1.2.3 here. It is e.g. quite useful.
      `,
      after: dedent`
        The value is 3.14 per Dr. Smith using v1.2.3 here.
        It is e.g. quite useful.
      `,
    },
    {
      testName: 'Links, wiki links, inline code, and bare URLs are never split inside',
      before: dedent`
        Use [[My Note]] and \`some.code.here\` and https://a.b/c.d often. Done now please.
      `,
      after: dedent`
        Use [[My Note]] and \`some.code.here\` and https://a.b/c.d often.
        Done now please.
      `,
    },
    {
      testName: 'A URL autolink is opaque and a sentence can start with one',
      before: dedent`
        See this here. <https://example.com> is the source link.
      `,
      after: dedent`
        See this here.
        <https://example.com> is the source link.
      `,
    },
    {
      testName: 'A lone URL autolink line is a divider and is not merged into prose',
      before: dedent`
        <https://example.com>
        Some text here. More text here.
      `,
      after: dedent`
        <https://example.com>
        Some text here.
        More text here.
      `,
    },
    {
      testName: 'M2: a "." inside an inline HTML attribute is opaque',
      before: dedent`
        Text <abbr title="e.g. foo. Bar">x</abbr>. Next sentence here.
      `,
      after: dedent`
        Text <abbr title="e.g. foo. Bar">x</abbr>.
        Next sentence here.
      `,
    },
    {
      testName: 'B4: CJK text splits with the CJK terminator set and no spaces',
      before: dedent`
        这是一句。这是另一句。
      `,
      after: dedent`
        这是一句。
        这是另一句。
      `,
      options: {
        sentenceTerminators: '。！？',
      },
    },
    {
      testName: 'B1: a masked table directly adjacent to prose keeps the table and adjacency intact',
      before: dedent`
        | a | b |
        | --- | --- |
        | 1 | 2 |
        Some text here. More text here.
      `,
      after: dedent`
        | a | b |
        | --- | --- |
        | 1 | 2 |
        Some text here.
        More text here.
      `,
    },
    {
      testName: 'B1: an Obsidian comment block directly adjacent to prose is preserved',
      before: dedent`
        %%
        a hidden comment
        %%
        Text one here. Text two here.
      `,
      after: dedent`
        %%
        a hidden comment
        %%
        Text one here.
        Text two here.
      `,
    },
    {
      testName: 'B1: a custom-ignore block directly adjacent to prose is preserved',
      before: dedent`
        <!-- linter-disable -->
        Do not touch this. Really do not.
        <!-- linter-enable -->
        Now reflow this. Yes please do.
      `,
      after: dedent`
        <!-- linter-disable -->
        Do not touch this. Really do not.
        <!-- linter-enable -->
        Now reflow this.
        Yes please do.
      `,
    },
    {
      testName: 'Fenced code, lists, blockquotes, and setext headings are left untouched',
      before: dedent`
        First here. Second here.
        ${''}
        ${'```'}js
        const a = 1. const b = 2.
        ${'```'}
        ${''}
        - item one. still one.
        - item two. still two.
        ${''}
        > Quote one. Quote two.
        ${''}
        Heading
        =======
        Body one here. Body two here.
      `,
      after: dedent`
        First here.
        Second here.
        ${''}
        ${'```'}js
        const a = 1. const b = 2.
        ${'```'}
        ${''}
        - item one. still one.
        - item two. still two.
        ${''}
        > Quote one. Quote two.
        ${''}
        Heading
        =======
        Body one here.
        Body two here.
      `,
    },
    {
      testName: 'A two-space hard break is preserved and not merged across',
      before: 'Line one here.  \nLine two here. Line three here.',
      after: 'Line one here.  \nLine two here.\nLine three here.',
    },
    {
      testName: 'A <br> hard break is preserved and not merged across',
      before: dedent`
        Keep this here.<br>
        Then split this. And this too.
      `,
      after: dedent`
        Keep this here.<br>
        Then split this.
        And this too.
      `,
    },
    {
      testName: 'A backslash hard break is preserved and not merged across',
      before: 'Hold this line.\\\nThen split here. And there too.',
      after: 'Hold this line.\\\nThen split here.\nAnd there too.',
    },
    {
      testName: 'Intra-sentence double spaces and NBSP round-trip (minimal join)',
      before: 'Hello world here. Next  one  here is fine.',
      after: 'Hello world here.\nNext  one  here is fine.',
    },
    {
      testName: 'A trailing newline is preserved',
      before: 'A first one. A second one.\n',
      after: 'A first one.\nA second one.\n',
    },
    {
      testName: 'No trailing newline stays without one',
      before: 'A first one. A second one.',
      after: 'A first one.\nA second one.',
    },
    {
      testName: 'Empty sentence terminators make the rule a no-op',
      before: dedent`
        One sentence here. Two sentences here.
        A soft wrapped
        continuation line.
      `,
      after: dedent`
        One sentence here. Two sentences here.
        A soft wrapped
        continuation line.
      `,
      options: {
        sentenceTerminators: '',
      },
    },
    {
      testName: 'P1: a custom abbreviation list passed as an array suppresses a split',
      before: dedent`
        We are Acme Corp. We always win. The end here.
      `,
      after: dedent`
        We are Acme Corp. We always win.
        The end here.
      `,
      options: {
        abbreviationList: ['corp.'],
      },
    },
    {
      testName: 'P1: without the custom abbreviation the same text does split',
      before: dedent`
        We are Acme Corp. We always win. The end here.
      `,
      after: dedent`
        We are Acme Corp.
        We always win.
        The end here.
      `,
      options: {
        abbreviationList: [],
      },
    },
  ],
});

describe('Sentence per line idempotency', () => {
  const rule = SentencePerLine.getRule();
  const cases: {name: string, text: string, options?: {[k: string]: unknown}}[] = [
    {name: 'basic paragraph', text: 'One here. Two here. Three here.'},
    {
      name: 'soft-wrapped multi line',
      text: 'A sentence that\nwas soft wrapped. Another sentence here.',
    },
    {name: 'two-space hard break', text: 'Keep this.  \nSplit this. And this.'},
    {name: '<br> hard break', text: 'Keep this.<br>\nSplit this. And this.'},
    {
      name: 'table adjacent to prose',
      text: '| a | b |\n| --- | --- |\n| 1 | 2 |\nSome text. More text.',
    },
    {
      name: 'starts with a link',
      text: 'See the start. [docs](https://example.com) explain it well.',
    },
    {name: 'trailing newline', text: 'A first one. A second one.\n'},
  ];

  for (const c of cases) {
    it(c.name, () => {
      const once = rule.apply(c.text, c.options);
      const twice = rule.apply(once, c.options);
      expect(twice).toBe(once);
    });
  }
});
