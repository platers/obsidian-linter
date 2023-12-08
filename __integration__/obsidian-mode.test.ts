import dedent from 'ts-dedent';
import TestLinterPlugin, {IntegrationTestCase} from './main.test';
import {Editor} from 'obsidian';
import expect from 'expect';
import {setWorkspaceItemMode} from './utils.test';

const cursorStart = 319;

function commonSetup(plugin: TestLinterPlugin, editor: Editor) {
  plugin.plugin.settings.ruleConfigs['yaml-key-sort'] = {
    'enabled': true,
    'yaml-key-priority-sort-order': '',
    'priority-keys-at-start-of-yaml': false,
    'yaml-sort-order-for-other-keys': 'Ascending Alphabetical',
  };

  editor.setCursor(editor.offsetToPos(cursorStart));
}

function assertions(editor: Editor) {
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

export const obsidianModeTestCases: IntegrationTestCase[] = [
  {
    name: 'Updating YAML in live preview mode does not break YAML and keeps cursor at the expected location',
    filePath: 'obsidian-mode/mode-yaml.md',
    async setup(plugin: TestLinterPlugin, editor: Editor) {
      commonSetup(plugin, editor),
      await setWorkspaceItemMode(plugin.app, false);
    },
    assertions,
  },
  {
    name: 'Updating YAML in source mode does not break YAML and keeps cursor at the expected location',
    filePath: 'obsidian-mode/mode-yaml.md',
    setup: commonSetup,
    assertions,
  },
];
