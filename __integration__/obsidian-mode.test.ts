import dedent from 'ts-dedent';
import TestLinterPlugin, {IntegrationTestCase} from './main.test';
import {Editor} from 'obsidian';
import expect from 'expect';
import {setWorkspaceItemMode} from './utils.test';
import {moment} from 'obsidian';

const cursorStart = 319;

function modeSetup(plugin: TestLinterPlugin, editor: Editor) {
  plugin.plugin.settings.ruleConfigs['yaml-key-sort'] = {
    'enabled': true,
    'yaml-key-priority-sort-order': '',
    'priority-keys-at-start-of-yaml': false,
    'yaml-sort-order-for-other-keys': 'Ascending Alphabetical',
  };

  editor.setCursor(editor.offsetToPos(cursorStart));
}

function modeAssertions(editor: Editor) {
  expect(editor.getValue()).toBe(dedent`
    ---
    author:
      - Somebody
    citation: unknown
    cover: https:github.com
    datePub: 1993
    device:
      - dsi
    format:
      - epub
    priority: 2
    publisher: Pokemon Publisher
    readingStatus: easy
    related: 
    researchArea:
      - scifi
    status: 
    summary: 
    tags:
      - pokemon
      - monsters
    title: Pokemon
    total: 481
    withProject: 
    ---
    # Heading here...
    ${''}
    Some text here...
    ${''}
  `);

  // one character was added before the cursor
  expect(editor.posToOffset(editor.getCursor())).toBe(cursorStart+1);
}

function edgeCaseSetup(plugin: TestLinterPlugin, _: Editor) {
  plugin.plugin.settings.ruleConfigs['yaml-timestamp'] = {
    'enabled': true,
    'date-created': true,
    'date-created-key': 'created',
    'force-retention-of-create-value': true,
    'date-modified': true,
    'date-modified-key': 'last_modified',
    'format': 'YYYY-MM-DD',
  };
  plugin.plugin.settings.ruleConfigs['proper-ellipsis'] = {
    'enabled': true,
  };
  plugin.plugin.settings.ruleConfigs['consecutive-blank-lines'] = {
    'enabled': true,
  };
  plugin.plugin.settings.ruleConfigs['convert-spaces-to-tabs'] = {
    'enabled': true,
    'tabsize': '4',
  };
  plugin.plugin.settings.ruleConfigs['heading-blank-lines'] = {
    'enabled': true,
    'bottom': true,
    'empty-line-after-yaml': false,
  };
  plugin.plugin.settings.ruleConfigs['paragraph-blank-lines'] = {
    'enabled': true,
  };
  plugin.plugin.settings.ruleConfigs['space-after-list-markers'] = {
    'enabled': true,
  };
  plugin.plugin.settings.ruleConfigs['trailing-spaces'] = {
    'enabled': true,
    'twp-space-line-break': false,
  };
  plugin.plugin.settings.ruleConfigs['convert-bullet-list-markers'] = {
    'enabled': true,
  };
  plugin.plugin.settings.ruleConfigs['remove-empty-lines-between-list-markers-and-checklists'] = {
    'enabled': true,
  };
  plugin.plugin.settings.ruleConfigs['no-bare-urls'] = {
    'enabled': true,
  };
  plugin.plugin.settings.ruleConfigs['emphasis-style'] = {
    'enabled': true,
    'style': 'asterisk',
  };
}

function edgeCaseAssertions(editor: Editor) {
  expect(editor.getValue()).toBe(dedent`
    ---
    aliases:
      - test
    tags:
      - test1
      - test2
    related:
      - "[[test]]"
      - "[[test 2]]"
    date: 2024-05-22
    class: "[[test]]"
    instructor: "[[test]]"
    readings:
      - "[[test]]"
      - "[[test 2#1.1 test chapter]]"
    ${''}
    created: ${moment().format('YYYY-MM-DD')}
    last_modified: ${moment().format('YYYY-MM-DD')}
    ---
    ${''}
    - Focus on XYZ.
    ${''}
    # I. Test:
    ${''}
    ## (Document A, paras [para 2] – [para 8], [para 13] – [para 24]; Document B, para. [3])
    ${''}
    ### a. test (*Document A, para. [para 2])*?
    ${''}
    Lorem ipsum dolor:
    ${''}
    - **test**: **X** v. **Y** *(the allies)* with support from **Y**
    ${''}
    \t- Lorem ipsum dolor sit amet + consectetur adipiscing elit. Morbi vel ipsum ipsum
    - More info ([test](https://www.example.org)):
    ${''}
    \t- „quote […] quote.”
    ${''}
    \t- “quote.”
    ${''}
    \t- “quote.”
    ${''}
    - **test**: X v Y
    ${''}
    - **test:** X v Y
    ${''}
    - (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel ipsum ipsum.)
    ${''}
    - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel ipsum ipsum. (Document A, para. [2])?
    ${''}
    \t- Document A [para 2]: “Lorem [ipsum] dolor sit amet, consectetur adipiscing elit.’,”
    \t- *Ut purus est, laoreet non massa id*, *placerat mollis elit*.
    ${''}
    \t\t- test
    ${''}
    \t\t- More on this
  `);
}

export const obsidianModeTestCases: IntegrationTestCase[] = [
  {
    name: 'Updating YAML in live preview mode does not break YAML and keeps cursor at the expected location',
    filePath: 'obsidian-mode/mode-yaml.md',
    async setup(plugin: TestLinterPlugin, editor: Editor) {
      modeSetup(plugin, editor),
      await setWorkspaceItemMode(plugin.app, false);
    },
    assertions: modeAssertions,
  },
  {
    name: 'Updating YAML in source mode does not break YAML and keeps cursor at the expected location',
    filePath: 'obsidian-mode/mode-yaml.md',
    setup: modeSetup,
    assertions: modeAssertions,
  },
  {
    name: 'Updating YAML in live preview mode does not break YAML when an update is being made to the end of the frontmatter',
    filePath: 'obsidian-mode/edge-case-yaml.md',
    async setup(plugin: TestLinterPlugin, editor: Editor) {
      edgeCaseSetup(plugin, editor),
      await setWorkspaceItemMode(plugin.app, false);
    },
    assertions: edgeCaseAssertions,
  },
  {
    name: 'Updating YAML in source mode does not break YAML when an update is being made to the end of the frontmatter',
    filePath: 'obsidian-mode/edge-case-yaml.md',
    setup: edgeCaseSetup,
    assertions: edgeCaseAssertions,
  },
];
