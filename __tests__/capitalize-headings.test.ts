import CapitalizeHeadings from '../src/rules/capitalize-headings';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: CapitalizeHeadings,
  testCases: [
    {
      testName: 'Ignores not words',
      before: dedent`
        # h1
        ## a c++ lan
        ## this is a sentence.
        ## I can't do this
        ## comma, comma, comma
        ## 1.1 the Header
        ## état
        ## this état
      `,
      after: dedent`
        # H1
        ## A c++ Lan
        ## This is a Sentence.
        ## I Can't Do This
        ## Comma, Comma, Comma
        ## 1.1 The Header
        ## État
        ## This État
      `,
      options: {
        style: 'Title Case',
      },
    },
    {
      testName: 'Ignores tags',
      before: dedent`
        #tag not line
      `,
      after: dedent`
        #tag not line
      `,
      options: {
        style: 'Title Case',
      },
    },
    {
      testName: 'Can capitalize only first letter',
      before: dedent`
        # this Is A Heading
      `,
      after: dedent`
        # This is a heading
      `,
      options: {
        style: 'First letter',
        ignoreCasedWords: false,
      },
    },
    {
      testName: 'Can capitalize only first letter that is a - Z',
      before: dedent`
        # 1. heading attempt
        # 1 John
      `,
      after: dedent`
        # 1. Heading attempt
        # 1 John
      `,
      options: {
        style: 'First letter',
      },
    },
    {
      testName: 'Can capitalize to all caps',
      before: dedent`
        # this Is A Heading
      `,
      after: dedent`
        # THIS IS A HEADING
      `,
      options: {
        style: 'ALL CAPS',
      },
    },
    {
      testName: 'Link in heading is still present with first letter capitalization rules on',
      before: dedent`
        # Heading [[docker]]
        # Heading [docker](docker)
        # Heading ![docker](docker)
      `,
      after: dedent`
        # Heading [[docker]]
        # Heading [docker](docker)
        # Heading ![docker](docker)
      `,
      options: {
        style: 'First letter',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/321
      testName: 'Make sure non-english letters get capitalized when they are the first letter and the rule is set to capitalize the first letter',
      before: dedent`
        # état
      `,
      after: dedent`
        # État
      `,
      options: {
        style: 'First letter',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/484
      testName: 'Make sure that first letter to be capitalized by `First Letter` is preceded by a space or tab',
      before: dedent`
        ### 1.0.0-b.4
        ### b
        # 1.0-b this is a heading
      `,
      after: dedent`
        ### 1.0.0-b.4
        ### B
        # 1.0-b This is a heading
      `,
      options: {
        style: 'First letter',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/518
      testName: `Make sure that 'I' is capitalized by default when First Letter is the style of the header `,
      before: dedent`
        ### It Is I
      `,
      after: dedent`
        ### It is I
      `,
      options: {
        style: 'First letter',
        ignoreCasedWords: false,
      },
    },
    {
      testName: `Make sure that 'First Letter' ignores cased words just because they are cased when ignore cased words is enabled`,
      before: dedent`
        ### This Header is Cased
      `,
      after: dedent`
        ### This Header is Cased
      `,
      options: {
        style: 'First letter',
        ignoreCasedWords: true,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/537
      testName: `Make sure that a heading with dollar signs does not have any added to it`,
      before: dedent`
        # Headline $LR(0)$ Set
      `,
      after: dedent`
        # Headline $LR(0)$ Set
      `,
      options: {
        style: 'First letter',
        ignoreCasedWords: true,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/601
      testName: `Make sure that if the 1st word has a number in it, it will still be considered to be a word and have its first letter capitalized`,
      before: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### lab07 bread maker
      `,
      after: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### Lab07 bread maker
      `,
      options: {
        style: 'First letter',
        ignoreCasedWords: true,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/921
      testName: `Make sure that a header with inline code is properly ignored for capitalization`,
      before: dedent`
        ## \`= durationformat(date(this.day) - date(2023-10-06),"dd")\` th days passed since the Black Shabbat
      `,
      after: dedent`
        ## \`= durationformat(date(this.day) - date(2023-10-06),"dd")\` TH DAYS PASSED SINCE THE BLACK SHABBAT
      `,
      options: {
        style: 'ALL CAPS',
      },
    },
  ],
});
