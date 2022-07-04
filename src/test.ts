import dedent from 'ts-dedent';
import moment from 'moment';
import {rules, Rule, rulesDict, Example, getDisabledRules} from './rules';
import {escapeRegExp, yamlRegex} from './utils';

describe('Examples pass', () => {
  for (const rule of rules) {
    describe(rule.name, () => {
      test.each(rule.examples)('$description', (example: Example) => {
        const options = rule.getDefaultOptions();
        if (example.options) {
          Object.assign(options, example.options);
        }
        expect(rule.apply(example.before, options)).toBe(example.after);
      });
    });
  }
});

describe('Augmented examples pass', () => {
  for (const rule of rules) {
    describe(rule.name, () => {
      test.each(rule.examples)('$description', (example: Example) => {
        const options = rule.getDefaultOptions();
        if (example.options) {
          Object.assign(options, example.options);
        }

        // Add a YAML
        if (rule.type !== 'YAML' && !example.before.match(yamlRegex)) {
          const yaml = dedent`
            ---
            foo: bar
            ---\n\n`;

          const before = yaml + example.before;
          expect(rule.apply(before, options)).toMatch(new RegExp(`${escapeRegExp(yaml)}\n?${escapeRegExp(example.after)}`));
        }
      });
    });
  }
});

describe('Check missing fields', () => {
  test.each(rules)('$name', (rule: Rule) => {
    expect(rule.name).toBeTruthy();
    expect(rule.description).toBeTruthy();
    expect(rule.examples.length).toBeGreaterThan(0);
  });
});

describe('Rules tests', () => {
  describe('Heading blank lines', () => {
    it('Ignores codeblocks', () => {
      const before = dedent`
        ---
        front matter
        ---
        
        # H1
        \`\`\`
        # comment not header
        $$
        a = b
        $$
        \`\`\``;
      const after = dedent`
        ---
        front matter
        ---

        # H1

        \`\`\`
        # comment not header
        $$
        a = b
        $$
        \`\`\``;
      expect(rulesDict['heading-blank-lines'].apply(before)).toBe(after);
    });
    it('Ignores # not in headings', () => {
      const before = dedent`
        Not a header # .
        Line
        \`\`\`
        # comment not header
        a = b
        \`\`\`
        ~~~
        # comment not header
        ~~~
          # tabbed not header
            # space not header
        `;
      const after = dedent`
        Not a header # .
        Line
        \`\`\`
        # comment not header
        a = b
        \`\`\`
        ~~~
        # comment not header
        ~~~
          # tabbed not header
            # space not header
        `;
      expect(rulesDict['heading-blank-lines'].apply(before)).toBe(after);
    });
    it('Works normally', () => {
      const before = dedent`
        # H1
        ## H2
        Line
        ### H3
        `;
      const after = dedent`
        # H1

        ## H2

        Line
        
        ### H3
        `;
      expect(rulesDict['heading-blank-lines'].apply(before)).toBe(after);
    });
  });
  describe('List spaces', () => {
    it('Handles empty bullets', () => {
      const before = dedent`
        Line
        - 1
        - 
        Line
        `;
      const after = dedent`
        Line
        - 1
        - 
        Line
        `;
      expect(rulesDict['space-after-list-markers'].apply(before)).toBe(after);
    });
  });
  describe('Header Increment', () => {
    it('Handles large increments', () => {
      const before = dedent`
        # H1
        #### H4
        ####### H7
        `;
      const after = dedent`
        # H1
        ## H4
        ### H7
        `;
      expect(rulesDict['header-increment'].apply(before)).toBe(after);
    });
    it('Handles change from decrement to regular increment', () => {
      const before = dedent`
        # H1
        ##### H5
        ####### H7
        ###### H6
        ## H2
        `;
      const after = dedent`
        # H1
        ## H5
        ### H7
        ## H6
        ## H2
        `;
      expect(rulesDict['header-increment'].apply(before)).toBe(after);
    });
    it('Handles a variety of changes in header size', () => {
      const before = dedent`
        # H1
        ### H3
        #### H4
        ###### H6
        ## H2
        # H1
        ## H2
        ### H3
        #### H4
        ###### H6
        ##### H5
        ### H3
        `;
      const after = dedent`
        # H1
        ## H3
        ### H4
        #### H6
        ## H2
        # H1
        ## H2
        ### H3
        #### H4
        ##### H6
        ##### H5
        ### H3
        `;
      expect(rulesDict['header-increment'].apply(before)).toBe(after);
    });
  });
  describe('Capitalize Headings', () => {
    it('Ignores not words', () => {
      const before = dedent`
        # h1
        ## a c++ lan
        ## this is a sentence.
        ## I can't do this
        ## comma, comma, comma
        ## 1.1 the Header
        `;
      const after = dedent`
        # h1
        ## A c++ Lan
        ## This is a Sentence.
        ## I Can't Do This
        ## Comma, Comma, Comma
        ## 1.1 The Header
        `;
      const options = Object.assign({
        'Style': 'Title Case',
      }, rulesDict['capitalize-headings'].getDefaultOptions());
      expect(rulesDict['capitalize-headings'].apply(before, options)).toBe(after);
    });
    it('Ignores tags', () => {
      const before = dedent`
        #tag not line
        `;
      const after = dedent`
        #tag not line
        `;
      expect(rulesDict['capitalize-headings'].apply(before, {'Style': 'Title Case'})).toBe(after);
    });
    it('Can capitalize only first letter', () => {
      const before = dedent`
        # this Is A Heading
        `;
      const after = dedent`
        # This is a heading
        `;
      expect(rulesDict['capitalize-headings'].apply(before, {'Style': 'First letter'})).toBe(after);
    });
    it('Can capitalize only first letter that is a - Z', () => {
      const before = dedent`
        # 1. heading attempt
        # 1 John
        `;
      const after = dedent`
        # 1. Heading attempt
        # 1 John
        `;
      expect(rulesDict['capitalize-headings'].apply(before, {'Style': 'First letter'})).toBe(after);
    });
    it('Can capitalize to all caps', () => {
      const before = dedent`
        # this Is A Heading
        `;
      const after = dedent`
        # THIS IS A HEADING
        `;
      expect(rulesDict['capitalize-headings'].apply(before, {'Style': 'ALL CAPS'})).toBe(after);
    });
  });
  describe('File Name Heading', () => {
    it('Handles stray dashes', () => {
      const before = dedent`
      Text 1

      ---
      
      Text 2
        `;
      const after = dedent`
      # File Name
      Text 1
      
      ---
      
      Text 2
        `;
      expect(rulesDict['file-name-heading'].apply(before, {'metadata: file name': 'File Name'})).toBe(after);
    });
  });
});
describe('Paragraph blank lines', () => {
  it('Ignores codeblocks', () => {
    const before = dedent`
    ---
    front matter
    front matter
    ---

    Hello
    World
    \`\`\`python
    # comment not header
    a = b
    c = d
    \`\`\`
    `;
    const after = dedent`
    ---
    front matter
    front matter
    ---

    Hello

    World

    \`\`\`python
    # comment not header
    a = b
    c = d
    \`\`\`
    `;
    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  it('Handles lists', () => {
    const before = dedent`
    Hello
    World
    - 1
    \t- 2
        - 3
    `;
    const after = dedent`
    Hello

    World

    - 1
    \t- 2
        - 3
    `;
    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  // accounts for https://github.com/platers/obsidian-linter/issues/250
  it('Paragraphs that start with numbers are spaced out', () => {
    const before = dedent`
    # Hello world


    123 foo
    123 bar
    `;

    const after = dedent`
    # Hello world

    123 foo

    123 bar
    `;

    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  // accounts for https://github.com/platers/obsidian-linter/issues/250
  it('Paragraphs that start with foreign characters are spaced out', () => {
    const before = dedent`
    # Hello world


    测试 foo
    测试 bar
    `;

    const after = dedent`
    # Hello world

    测试 foo

    测试 bar
    `;

    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  // accounts for https://github.com/platers/obsidian-linter/issues/250
  it('Paragraphs that start with whitespace characters are spaced out', () => {
    const before = dedent`
    # Hello world

     foo
     bar
    `;

    const after = dedent`
    # Hello world

     foo

     bar
    `;

    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  it('Make sure blockquotes are not affected', () => {
    const before = dedent`
    # Hello world

    > blockquote
    > blockquote line 2
    `;

    const after = dedent`
    # Hello world

    > blockquote
    > blockquote line 2
    `;

    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  it('Make sure lists are not affected', () => {
    const before = dedent`
    # Hello world

    > blockquote
    > blockquote line 2
    `;

    const after = dedent`
    # Hello world

    > blockquote
    > blockquote line 2
    `;

    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
  it('Make sure lines ending in a line break are not affected', () => {
    const before = dedent`
    # Hello world


    paragraph line 1 <br>
    paragraph line 2  
    paragraph line 3 <br/>
    paragraph final line


    `;

    const after = dedent`
    # Hello world

    paragraph line 1 <br>
    paragraph line 2  
    paragraph line 3 <br/>
    paragraph final line
    `;

    expect(rulesDict['paragraph-blank-lines'].apply(before)).toBe(after);
  });
});
describe('Consecutive blank lines', () => {
  it('Handles ignores code blocks', () => {
    const before = dedent`
      Line 1


      \`\`\`
      


      \`\`\`
      `;
    const after = dedent`
      Line 1

      \`\`\`



      \`\`\`
      `;
    expect(rulesDict['consecutive-blank-lines'].apply(before)).toBe(after);
  });
});
describe('Convert spaces to tabs', () => {
  it('Basic case', () => {
    const before = dedent`
      - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          - Vestibulum id tortor lobortis, tristique mi quis, pretium metus.
      - Nunc ut arcu fermentum enim auctor accumsan ut a risus.
              - Donec ut auctor dui.
      `;
    const after = dedent`
      - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      \t- Vestibulum id tortor lobortis, tristique mi quis, pretium metus.
      - Nunc ut arcu fermentum enim auctor accumsan ut a risus.
      \t\t- Donec ut auctor dui.
      `;
    expect(rulesDict['convert-spaces-to-tabs'].apply(before, {Tabsize: '4'})).toBe(after);
  });
});

describe('Trailing spaces', () => {
  it('One trailing space removed', () => {
    const before = dedent`
        # H1 
        line with one trailing spaces 
      `;
    const after = dedent`
        # H1
        line with one trailing spaces
      `;
    expect(rulesDict['trailing-spaces'].apply(before)).toBe(after);
  });
  it('Three trailing whitespaces removed', () => {
    const before = dedent`
        # H1   
        line with three trailing spaces   
      `;
    const after = dedent`
        # H1
        line with three trailing spaces
      `;
    expect(rulesDict['trailing-spaces'].apply(before)).toBe(after);
  });
  /* eslint-disable no-mixed-spaces-and-tabs, no-tabs */
  it('Tab-Space-Linebreak removed', () => {
    const before = dedent`
        # H1
        line with trailing tab and spaces    

      `;
    const after = dedent`
        # H1
        line with trailing tab and spaces
        
      `;
    expect(rulesDict['trailing-spaces'].apply(before, {'Style': 'Two Space Linebreak'})).toBe(after);
  });
  /* eslint-enable no-mixed-spaces-and-tabs, no-tabs */
  it('Two Space Linebreak not removed', () => {
    const before = dedent`
        # H1
        line with one trailing spaces  

      `;
    const after = dedent`
        # H1
        line with one trailing spaces  

      `;
    expect(rulesDict['trailing-spaces'].apply(before, {'Style': 'Two Space Linebreak'})).toBe(after);
  });
});

describe('Move Footnotes to the bottom', () => {
  it('Simple case', () => {
    const before = dedent`
    [^alpha]: bravo and charlie.

    Line
    `;
    const after = dedent`
    Line

    [^alpha]: bravo and charlie.
    `;
    expect(rulesDict['move-footnotes-to-the-bottom'].apply(before)).toBe(after);
  });
  it('Multiline footnotes', () => {
    const before = dedent`
    lora ipsala [^note] dolores.

    [^note]: This is not right

        - because the footnote takes more than one paragraph.
        - and linter does only move the first line.

        but not the rest of it

        it will mess up every multiline note instantly

    this is not cool
    `;
    const after = dedent`
    lora ipsala [^note] dolores.

    this is not cool

    [^note]: This is not right

        - because the footnote takes more than one paragraph.
        - and linter does only move the first line.

        but not the rest of it

        it will mess up every multiline note instantly
    `;
    expect(rulesDict['move-footnotes-to-the-bottom'].apply(before)).toBe(after);
  });
  it('Long Document with multiple consecutive footnotes', () => {
    const before = dedent`
   # Part 1
   Graece insolens eloquentiam te mea, te novum possit eam. In pri reque accumsan, quidam noster interpretaris in est.[^1] Sale populo petentium vel eu, eam in alii novum voluptatum, te lorem postulant has.[^2] . In pri reque accumsan, quidam noster interpretaris in est.[^3] Graece insolens eloquentiam te mea, te novum possit eam. In pri reque accumsan, quidam noster interpretaris in est.[^4] Sale populo petentium vel eu, eam in alii novum voluptatum, te lorem postulant has.[^5]

   [^1]: See @JIPPChristKingPaul2015, 50.
   [^2]: Jipp in -@JIPPChristKingPaul2015, 45, says, “Sale populo petentium vel eu, eam in alii novum voluptatum, te lorem postulant has”.
   [^3]: This is from Journal article --@gaventaLouisMartynGalatians2000, 99.
   [^4]: Lorem ipsum dolor sit amet, cibo eripuit consulatu at vim. No quando animal eam, ea timeam ancillae incorrupte usu. Graece insolens eloquentiam te mea, te novum possit eam. In pri reque accumsan, quidam noster interpretaris in es. See @WANRomansIntroductionStudy2021, 45.
   [^5]: See @johnsonTransformationMindMoral2003, 215.

   No hendrerit efficiendi eam. Vim ne ferri populo voluptatum, et usu laboramus scribentur, per illud inermis consetetur id.[^a]

   Eu graeco blandit instructior pro, ut vidisse mediocrem qui. Ex ferri melius evertitur qui. At nec eripuit legimus.[^b] Ut meis solum recusabo eos, usu in[^c] assueverit eloquentiam, has facilis scribentur ea. No hendrerit efficiendi eam. Vim ne ferri populo voluptatum, et usu laboramus scribentur, per illud inermis consetetur id.[^d]

   [^a]: Footnote 1.
   [^b]: Footnote 2.
   [^c]: Wright in -@wrightPaulFreshPerspective2005 says, “Modo omnes neglegentur cu vel.”
   [^d]: Abraham in -@abrahamPostcolonialTheologies2015, says, “Ei eos deleniti electram. Prima prompta partiendo ius ne.”

   # Part 3
   In has assum falli habemus, timeam apeirian forensibus nam no, mutat facer antiopam in pri. Mel et vocent scribentur.[^11]

   > In has assum falli habemus, timeam apeirian forensibus nam no, mutat facer antiopam in pri. Te sea stet deserunt, vel tritani eligendi platonem ut, sea ea fugit iriure. Usu at elaboraret scriptorem signiferumque, cetero reprimique est cu. Ei eos deleniti electram. Prima prompta partiendo ius ne. Modo omnes neglegentur cu vel, nisl illum vel ex. Mel et vocent scribentur.[^21]

   Prima prompta partiendo ius ne. Modo omnes neglegentur cu vel, nisl illum vel ex. Mel et vocent scribentur.[^31]

   Prima prompta partiendo ius ne. Modo omnes neglegentur cu vel, nisl illum vel ex. Mel et vocent scribentur.[^41]

   [^11]: See @JIPPMessianicTheologyNew2020
   [^21]: See @jippDivineVisitationsHospitality2013. Dunn in @dunnRomans181988, says, “Mel et vocent scribentur.”
   [^31]: Abraham in -@abrahamPostcolonialTheologies2015, says, “Ei eos deleniti electram. Prima prompta partiendo ius ne.”
   [^41]: Wright in -@wrightPaulFreshPerspective2005 says, “Modo omnes neglegentur cu vel.”
   `;
    const after = dedent`
   # Part 1
   Graece insolens eloquentiam te mea, te novum possit eam. In pri reque accumsan, quidam noster interpretaris in est.[^1] Sale populo petentium vel eu, eam in alii novum voluptatum, te lorem postulant has.[^2] . In pri reque accumsan, quidam noster interpretaris in est.[^3] Graece insolens eloquentiam te mea, te novum possit eam. In pri reque accumsan, quidam noster interpretaris in est.[^4] Sale populo petentium vel eu, eam in alii novum voluptatum, te lorem postulant has.[^5]

   No hendrerit efficiendi eam. Vim ne ferri populo voluptatum, et usu laboramus scribentur, per illud inermis consetetur id.[^a]

   Eu graeco blandit instructior pro, ut vidisse mediocrem qui. Ex ferri melius evertitur qui. At nec eripuit legimus.[^b] Ut meis solum recusabo eos, usu in[^c] assueverit eloquentiam, has facilis scribentur ea. No hendrerit efficiendi eam. Vim ne ferri populo voluptatum, et usu laboramus scribentur, per illud inermis consetetur id.[^d]

   # Part 3
   In has assum falli habemus, timeam apeirian forensibus nam no, mutat facer antiopam in pri. Mel et vocent scribentur.[^11]

   > In has assum falli habemus, timeam apeirian forensibus nam no, mutat facer antiopam in pri. Te sea stet deserunt, vel tritani eligendi platonem ut, sea ea fugit iriure. Usu at elaboraret scriptorem signiferumque, cetero reprimique est cu. Ei eos deleniti electram. Prima prompta partiendo ius ne. Modo omnes neglegentur cu vel, nisl illum vel ex. Mel et vocent scribentur.[^21]

   Prima prompta partiendo ius ne. Modo omnes neglegentur cu vel, nisl illum vel ex. Mel et vocent scribentur.[^31]

   Prima prompta partiendo ius ne. Modo omnes neglegentur cu vel, nisl illum vel ex. Mel et vocent scribentur.[^41]

   [^1]: See @JIPPChristKingPaul2015, 50.
   [^2]: Jipp in -@JIPPChristKingPaul2015, 45, says, “Sale populo petentium vel eu, eam in alii novum voluptatum, te lorem postulant has”.
   [^3]: This is from Journal article --@gaventaLouisMartynGalatians2000, 99.
   [^4]: Lorem ipsum dolor sit amet, cibo eripuit consulatu at vim. No quando animal eam, ea timeam ancillae incorrupte usu. Graece insolens eloquentiam te mea, te novum possit eam. In pri reque accumsan, quidam noster interpretaris in es. See @WANRomansIntroductionStudy2021, 45.
   [^5]: See @johnsonTransformationMindMoral2003, 215.
   [^a]: Footnote 1.
   [^b]: Footnote 2.
   [^c]: Wright in -@wrightPaulFreshPerspective2005 says, “Modo omnes neglegentur cu vel.”
   [^d]: Abraham in -@abrahamPostcolonialTheologies2015, says, “Ei eos deleniti electram. Prima prompta partiendo ius ne.”
   [^11]: See @JIPPMessianicTheologyNew2020
   [^21]: See @jippDivineVisitationsHospitality2013. Dunn in @dunnRomans181988, says, “Mel et vocent scribentur.”
   [^31]: Abraham in -@abrahamPostcolonialTheologies2015, says, “Ei eos deleniti electram. Prima prompta partiendo ius ne.”
   [^41]: Wright in -@wrightPaulFreshPerspective2005 says, “Modo omnes neglegentur cu vel.”
   `;
    expect(rulesDict['move-footnotes-to-the-bottom'].apply(before)).toBe(after);
  });
  it('Footnote already at the bottom does not add an extra newline', () => {
    const before = dedent`
    Line

    [^alpha]: bravo and charlie.
    `;
    const after = dedent`
    Line

    [^alpha]: bravo and charlie.
    `;
    expect(rulesDict['move-footnotes-to-the-bottom'].apply(before)).toBe(after);
  });
});
describe('yaml timestamp', () => {
  it('Doesn\'t add date created if already there', () => {
    const before = dedent`
    ---
    date created: 2019-01-01
    ---
    `;
    const after = dedent`
    ---
    date created: 2019-01-01
    ---
    `;
    expect(rulesDict['yaml-timestamp'].apply(before, {'Date Created': true, 'Date Created Key': 'date created', 'moment': moment})).toBe(after);
  });
  it('Respects created key', () => {
    const before = dedent`
    ---
    created: 2019-01-01
    ---
    `;
    const after = dedent`
    ---
    created: 2019-01-01
    ---
    `;
    expect(rulesDict['yaml-timestamp'].apply(before, {'Date Created': true, 'Date Created Key': 'created', 'moment': moment})).toBe(after);
  });
  it('Respects modified key when nothing has changed', () => {
    const before = dedent`
    ---
    modified: Wednesday, January 1st 2020, 12:00:00 am
    ---
    `;
    const after = dedent`
    ---
    modified: Wednesday, January 1st 2020, 12:00:00 am
    ---
    `;

    const options = {
      'Date Created': false,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'metadata: file modified time': '2020-01-01T00:00:00-00:00',
      'Current Time': moment('Thursday, January 2nd 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Already Modified': false,
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates modified value when nothing has changed, but date modified is more than 5 seconds different than the file metadata', () => {
    const before = dedent`
    ---
    modified: Wednesday, January 1st 2020, 12:00:00 am
    ---
    `;
    const after = dedent`
    ---
    modified: Thursday, January 2nd 2020, 12:00:00 am
    ---
    `;

    const options = {
      'Date Created': false,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'metadata: file modified time': '2020-01-02T00:00:03-00:00',
      'Current Time': moment('Thursday, January 2nd 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'Already Modified': false,
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates modified value when format has changed', () => {
    const before = dedent`
    ---
    modified: Wednesday, January 1st 2020, 12:00:00 am
    ---
    `;
    const after = dedent`
    ---
    modified: Wednesday, January 1st 2020
    ---
    `;

    const options = {
      'Date Created': false,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'metadata: file modified time': '2020-01-01T00:00:00-00:00',
      'Current Time': moment('Wednesday, January 1st 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Format': 'dddd, MMMM Do YYYY',
      'Already Modified': false,
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates modified key when something has changed outside of the YAML timestamp rule', () => {
    const before = dedent`
    ---
    modified: Wednesday, January 1st 2020, 12:00:00 am
    ---
    `;
    const after = dedent`
    ---
    modified: Saturday, February 1st 2020, 12:00:00 am
    ---
    `;

    const options = {
      'Date Created': false,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'metadata: file modified time': '2020-01-30T00:00:00-00:00',
      'Current Time': moment('Saturday, February 1st 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Already Modified': true,
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates modified key when locale has changed', () => {
    const before = dedent`
    ---
    modified: Wednesday, January 1st 2020, 12:00:00 am
    ---
    `;
    const after = dedent`
    ---
    modified: samedi, février 1er 2020, 12:00:05 am
    ---
    `;

    moment.locale('fr');
    const options = {
      'Date Created': false,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'metadata: file modified time': '2020-02-01T00:00:00-00:00',
      'Current Time': moment('samedi, février 1er 2020, 12:00:05 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Already Modified': false,
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
    moment.locale('en');
  });
  it('Updates modified key when something has changed inside of the YAML timestamp rule', () => {
    const before = dedent`
    ---
    modified: Thursday, January 2nd 2020, 12:00:00 am
    ---
    `;
    const after = dedent`
    ---
    modified: Thursday, January 2nd 2020, 12:00:05 am
    created: Wednesday, January 1st 2020, 12:00:00 am
    ---
    `;

    const options = {
      'Date Created': true,
      'Date Modified': true,
      'Date Created Key': 'created',
      'Date Modified Key': 'modified',
      'metadata: file created time': '2020-01-01T00:00:00-00:00',
      'metadata: file modified time': '2020-01-02T00:00:00-00:00',
      'Current Time': moment('Thursday, January 2nd 2020, 12:00:05 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Already Modified': false,
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates modified key when present, but lacks a value', () => {
    const before = dedent`
    ---
    tag: tag1
    modified: 
    location: "path"
    ---
    `;
    const after = dedent`
    ---
    tag: tag1
    modified: Saturday, February 1st 2020, 12:00:00 am
    location: "path"
    ---
    `;

    const options = {
      'Date Created': false,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'metadata: file modified time': '2020-01-30T00:00:00-00:00',
      'Already Modified': false,
      'Current Time': moment('Saturday, February 1st 2020, 12:00:00 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates created key when present, but lacks a value', () => {
    const before = dedent`
    ---
    tag: tag1
    created: 
    location: "path"
    ---
    `;
    const after = dedent`
    ---
    tag: tag1
    created: Saturday, February 1st 2020, 12:00:00 am
    location: "path"
    ---
    `;

    const options = {
      'Date Created': true,
      'Date Modified': false,
      'Date Created Key': 'created',
      'metadata: file created time': '2020-02-01T00:00:00-00:00',
      'Already Modified': false,
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates created value when format has changed', () => {
    const before = dedent`
    ---
    tag: tag1
    created: Saturday, February 1st 2020, 12:00:00 am
    location: "path"
    ---
    `;
    const after = dedent`
    ---
    tag: tag1
    created: Saturday, February 1st 2020
    location: "path"
    ---
    `;

    const options = {
      'Date Created': true,
      'Date Modified': false,
      'Date Created Key': 'created',
      'metadata: file created time': '2020-02-01T00:00:00-00:00',
      'Format': 'dddd, MMMM Do YYYY',
      'Already Modified': false,
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
  it('Updates created value when locale has changed', () => {
    const before = dedent`
    ---
    tag: tag1
    created: Saturday, February 1st 2020, 12:00:00 am
    location: "path"
    ---
    `;
    const after = dedent`
    ---
    tag: tag1
    created: samedi, février 1er 2020, 12:00:00 am
    location: "path"
    ---
    `;

    moment.locale('fr');
    const options = {
      'Date Created': true,
      'Date Modified': false,
      'Date Created Key': 'created',
      'metadata: file created time': '2020-02-01T00:00:00-00:00',
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'Already Modified': false,
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
    moment.locale('en');
  });
  it('Updates modified value when format has changed causing created value updated', () => {
    const before = dedent`
    ---
    tag: tag1
    modified: Saturday, February 1st 2020, 12:00:00 am
    created: Wednesday, January 1st 2020
    location: "path"
    ---
    `;
    const after = dedent`
    ---
    tag: tag1
    modified: Tuesday, February 4th 2020, 6:00:00 pm
    created: Wednesday, January 1st 2020, 12:00:00 am
    location: "path"
    ---
    `;

    const options = {
      'Date Created': true,
      'Date Modified': true,
      'Date Modified Key': 'modified',
      'Date Created Key': 'created',
      'metadata: file created time': '2020-01-01T00:00:00-00:00',
      'metadata: file modified time': '2020-02-02T00:00:00-00:00',
      'Current Time': moment('Tuesday, February 4th 2020, 6:00:00 pm', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      'Format': 'dddd, MMMM Do YYYY, h:mm:ss a',
      'Already Modified': false,
      'moment': moment,
    };
    expect(rulesDict['yaml-timestamp'].apply(before, options)).toBe(after);
  });
});
describe('Insert yaml attributes', () => {
  it('Inits yaml if it does not exist', () => {
    const before = dedent`
    `;
    const after = dedent`
    ---
    tags:
    ---
    
    `;
    expect(rulesDict['insert-yaml-attributes'].apply(before, {'Text to insert': 'tags:'})).toBe(after);
  });
  // accounts for https://github.com/platers/obsidian-linter/issues/176
  it('Inits yaml when the file has --- in it and no frontmatter', () => {
    const before = dedent`
    # Heading
    Text

    # Heading
    - Text
     - Text
    ---

    `;
    const after = dedent`
    ---
    tags:
    ---
    # Heading
    Text

    # Heading
    - Text
     - Text
    ---

    `;
    expect(rulesDict['insert-yaml-attributes'].apply(before, {'Text to insert': 'tags:'})).toBe(after);
  });
  // accounts for https://github.com/platers/obsidian-linter/issues/157
  it('When a file has tabs at the start of a line in the frontmatter, the yaml insertion still works leaving other tabs as they were', () => {
    const before = dedent`
    ---
    title: this title\thas a tab
    tags:
    \t- test1
    \t- test2
    ---
    `;
    const after = dedent`
    ---
    blob:
    title: this title\thas a tab
    tags:
    \t- test1
    \t- test2
    ---
    `;
    expect(rulesDict['insert-yaml-attributes'].apply(before, {'Text to insert': 'blob:'})).toBe(after);
  });
});

describe('Disabled rules parsing', () => {
  it('No YAML', () => {
    const text = dedent`
      Text
      `;
    expect(getDisabledRules(text)).toEqual([]);
  });
  it('No ignored rules', () => {
    const text = dedent`
      ---
      ---
      Text
      `;
    expect(getDisabledRules(text)).toEqual([]);
  });
  it('Ignore one rule', () => {
    const text = dedent`
      ---
      disabled rules: [ yaml-timestamp ]
      ---
      Text
      `;
    expect(getDisabledRules(text)).toEqual(['yaml-timestamp']);
  });
  it('Ignore some rules', () => {
    const text = dedent`
      ---
      random-rule: true
      disabled rules: [ yaml-timestamp, capitalize-headings ]
      ---
      Text
      `;
    expect(getDisabledRules(text)).toEqual(['yaml-timestamp', 'capitalize-headings']);
  });
  it('Ignored no rules', () => {
    const text = dedent`
      ---
      disabled rules:
      ---
      Text
      `;
    expect(getDisabledRules(text)).toEqual([]);
  });
  it('Ignored all rules', () => {
    const text = dedent`
      ---
      disabled rules: all
      ---
      Text
      `;
    expect(getDisabledRules(text)).toEqual(rules.map((r) => r.alias()));
  });
  it('Works with misformatted yamls', () => {
    const text = dedent`
      ---
      tfratfrat

      
      ---
      `;
    expect(getDisabledRules(text)).toEqual([]);
  });
});

describe('YAML Title', () => {
  it('Keeps unescaped title if possible', () => {
    const before = dedent`
    # Hello world
    `;

    const after = dedent`
    ---
    title: Hello world
    ---
    # Hello world
    `;

    expect(rulesDict['yaml-title'].apply(before, {'Title Key': 'title'})).toBe(after);
  });

  it('Escapes title if it contains colon', () => {
    const before = dedent`
    # Hello: world
    `;

    const after = dedent`
    ---
    title: 'Hello: world'
    ---
    # Hello: world
    `;

    expect(rulesDict['yaml-title'].apply(before, {'Title Key': 'title'})).toBe(after);
  });

  it('Escapes title if it starts with single quote', () => {
    const before = dedent`
    # 'Hello world
    `;

    const after = dedent`
    ---
    title: '''Hello world'
    ---
    # 'Hello world
    `;

    expect(rulesDict['yaml-title'].apply(before, {'Title Key': 'title'})).toBe(after);
  });

  it('Escapes title if it starts with double quote', () => {
    const before = dedent`
    # "Hello world
    `;

    const after = dedent`
    ---
    title: '"Hello world'
    ---
    # "Hello world
    `;

    expect(rulesDict['yaml-title'].apply(before, {'Title Key': 'title'})).toBe(after);
  });

  it('Does not insert line breaks for long title', () => {
    const before = dedent`
    # Very long title 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
    `;

    const after = dedent`
    ---
    title: Very long title 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
    ---
    # Very long title 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
    `;

    expect(rulesDict['yaml-title'].apply(before, {'Title Key': 'title'})).toBe(after);
  });
});

describe('YAML Title Alias', () => {
  it('Creates aliases if missing', () => {
    const before = dedent`
    # Title
    `;

    const after = dedent`
    ---
    aliases:
      # linter-yaml-title-alias
      - Title
    ---
    # Title
    `;

    expect(rulesDict['yaml-title-alias'].apply(before)).toBe(after);
  });

  it('Converts single string alias to array', () => {
    const before = dedent`
    ---
    aliases: other alias
    ---
    # Title
    `;

    const after = dedent`
    ---
    aliases:
      # linter-yaml-title-alias
      - Title
      - other alias
    ---
    # Title
    `;

    expect(rulesDict['yaml-title-alias'].apply(before)).toBe(after);
  });

  it('Adds title before existing aliases array', () => {
    const before = dedent`
    ---
    aliases:
      - alias1
      - alias2
      - alias3
    ---
    # Title
    `;

    const after = dedent`
    ---
    aliases:
      # linter-yaml-title-alias
      - Title
      - alias1
      - alias2
      - alias3
    ---
    # Title
    `;

    expect(rulesDict['yaml-title-alias'].apply(before)).toBe(after);
  });

  it('Converts array in brackets into multiline array', () => {
    const before = dedent`
    ---
    aliases: [alias1, alias2, alias3]
    ---
    # Title
    `;

    const after = dedent`
    ---
    aliases:
      # linter-yaml-title-alias
      - Title
      - alias1
      - alias2
      - alias3
    ---
    # Title
    `;

    expect(rulesDict['yaml-title-alias'].apply(before)).toBe(after);
  });

  it('Updates changed alias', () => {
    const before = dedent`
    ---
    aliases:
      # linter-yaml-title-alias
      - Old Title
    ---
    # New Title
    `;

    const after = dedent`
    ---
    aliases:
      # linter-yaml-title-alias
      - New Title
    ---
    # New Title
    `;

    expect(rulesDict['yaml-title-alias'].apply(before)).toBe(after);
  });

  it('Titles is colon are escaped', () => {
    const before = dedent`
    # Title: With Colon
    `;

    const after = dedent`
    ---
    aliases:
      # linter-yaml-title-alias
      - 'Title: With Colon'
    ---
    # Title: With Colon
    `;

    expect(rulesDict['yaml-title-alias'].apply(before)).toBe(after);
  });
});

describe('Links', () => {
  it('Regular link with spaces stays the same', () => {
    const before = dedent`
    # Hello world

    [This has  spaces in it](File with  spaces.md)
    `;

    const after = dedent`
    # Hello world

    [This has  spaces in it](File with  spaces.md)
    `;

    expect(rulesDict['trailing-spaces'].apply(before)).toBe(after);
  });
  it('Image link with spaces stays the same', () => {
    const before = dedent`
    # Hello world

    ![This has  spaces in it](File with  spaces.png)
    `;

    const after = dedent`
    # Hello world

    ![This has  spaces in it](File with  spaces.png)
    `;

    expect(rulesDict['trailing-spaces'].apply(before)).toBe(after);
  });
  it('Wiki link with spaces stays the same', () => {
    const before = dedent`
    # Hello world

    [[File with  spaces]]
    `;

    const after = dedent`
    # Hello world

    [[File with  spaces]]
    `;

    expect(rulesDict['trailing-spaces'].apply(before)).toBe(after);
  });
  it('Link in heading is still present with first letter capitalization rules on', () => {
    const before = dedent`
    # Heading [[docker]]
    # Heading [docker](docker)
    # Heading ![docker](docker)
    `;

    const after = dedent`
    # Heading [[docker]]
    # Heading [docker](docker)
    # Heading ![docker](docker)
    `;

    expect(rulesDict['capitalize-headings'].apply(before, {'Style': 'First letter'})).toBe(after);
  });
  // accounts for https://github.com/platers/obsidian-linter/issues/236
  it('Link after checkbox is not affected by removing whitespace in links', () => {
    const before = dedent`
    - [ ] [Link text](path/fileName.md)
    - [ ] [[fileName]]
    `;

    const after = dedent`
    - [ ] [Link text](path/fileName.md)
    - [ ] [[fileName]]
    `;

    expect(rulesDict['remove-link-spacing'].apply(before)).toBe(after);
  });
});

describe('Remove Multiple Spaces', () => {
  it('Make sure spaces at the end of the line are ignored', () => {
    const before = dedent`
    # Hello world

    Paragraph contents are here  
    Second paragraph contents here  
    `;

    const after = dedent`
    # Hello world

    Paragraph contents are here  
    Second paragraph contents here  
    `;

    expect(rulesDict['remove-multiple-spaces'].apply(before)).toBe(after);
  });
  it('Make sure spaces at the start of the line are ignored', () => {
    const before = '  Paragraph contents are here\n  Second paragraph here...';

    const after = '  Paragraph contents are here\n  Second paragraph here...';

    expect(rulesDict['remove-multiple-spaces'].apply(before)).toBe(after);
  });
  it('Make sure non-letter followed or preceeded by 2 spaces has them cut down to 1 space', () => {
    const before = dedent`
    # Hello world

    Paragraph contents  (something). Something else  .
    `;

    const after = dedent`
    # Hello world

    Paragraph contents (something). Something else .
    `;

    expect(rulesDict['remove-multiple-spaces'].apply(before)).toBe(after);
  });
  it('Links followed by parentheses do not prevent other removal of multiple spaces in a row', () => {
    const before = dedent`
    [Link text](path/fileName.md) (2 spaces in between  text)
    `;

    const after = dedent`
    [Link text](path/fileName.md) (2 spaces in between text)
    `;

    expect(rulesDict['remove-multiple-spaces'].apply(before)).toBe(after);
  });
});

describe('Remove Hyphenated Line Breaks', () => {
  // accounts for https://github.com/platers/obsidian-linter/issues/241
  it('Make sure text ending in a hyphen followed by a link does not trigger the hyphenated line break rule', () => {
    const before = dedent`
    # Hello world

    Paragraph contents are here- [link text](pathToFile/file.md)
    Paragraph contents are here- [[file]]
    `;

    const after = dedent`
    # Hello world

    Paragraph contents are here- [link text](pathToFile/file.md)
    Paragraph contents are here- [[file]]
    `;

    expect(rulesDict['remove-hyphenated-line-breaks'].apply(before)).toBe(after);
  });
});
