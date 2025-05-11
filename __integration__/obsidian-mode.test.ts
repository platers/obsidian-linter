import TestLinterPlugin, {IntegrationTestCase} from './main.test';
import {Editor, TFile} from 'obsidian';
import expect from 'expect';
import {setWorkspaceItemMode} from './utils.test';
import moment from 'moment';

const cursorStart = 319;

function modeSetup(plugin: TestLinterPlugin, editor: Editor): Promise<void> {
  plugin.plugin.settings.ruleConfigs['yaml-key-sort'] = {
    'enabled': true,
    'yaml-key-priority-sort-order': '',
    'priority-keys-at-start-of-yaml': false,
    'yaml-sort-order-for-other-keys': 'Ascending Alphabetical',
  };

  editor.setCursor(editor.offsetToPos(cursorStart));

  return;
}

function modeAssertions(editor: Editor) {
  // one character was added before the cursor
  expect(editor.posToOffset(editor.getCursor())).toBe(cursorStart+1);
}

function edgeCaseExpectedTextModifications(text: string, file: TFile):string {
  text = text.replace('{{created_date}}', moment(file.stat.ctime ?? '').format('YYYY-MM-DD'));
  text = text.replace('{{modified_date}}', moment().format('YYYY-MM-DD'));

  return text;
}


function edgeCaseSetup(plugin: TestLinterPlugin, _: Editor): Promise<void> {
  plugin.plugin.settings.ruleConfigs['yaml-timestamp'] = {
    'enabled': true,
    'date-created': true,
    'date-created-key': 'created',
    'date-created-source-of-truth': 'file system',
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
    'two-space-line-break': false,
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

  return;
}

function moveToYamlSetup(plugin: TestLinterPlugin, _: Editor): Promise<void> {
  plugin.plugin.settings.ruleConfigs['move-tags-to-yaml'] = {
    'enabled': true,
    'how-to-handle-existing-tags': 'Remove whole tag',
    'tags-to-ignore': '',
  };

  return;
}

export const obsidianModeTestCases: IntegrationTestCase[] = [
  {
    name: 'Updating YAML in live preview mode does not break YAML and keeps cursor at the expected location',
    filePath: 'obsidian-mode/mode-yaml.md',
    async setup(plugin: TestLinterPlugin, editor: Editor) {
      await modeSetup(plugin, editor),
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
      await edgeCaseSetup(plugin, editor),
      await setWorkspaceItemMode(plugin.app, false);
    },
    modifyExpected: edgeCaseExpectedTextModifications,
  },
  {
    name: 'Updating YAML in source mode does not break YAML when an update is being made to the end of the frontmatter',
    filePath: 'obsidian-mode/edge-case-yaml.md',
    setup: edgeCaseSetup,
    modifyExpected: edgeCaseExpectedTextModifications,
  },
  {
    name: 'Moving tag to YAML when just the tag is present works in live preview mode',
    filePath: 'obsidian-mode/move-tag-to-yaml.md',
    async setup(plugin: TestLinterPlugin, editor: Editor) {
      await moveToYamlSetup(plugin, editor),
      await setWorkspaceItemMode(plugin.app, false);
    },
  },
  {
    name: 'Moving tag to YAML when just the tag is present works in source mode',
    filePath: 'obsidian-mode/move-tag-to-yaml.md',
    setup: moveToYamlSetup,
  },
  {
    name: 'Moving tag to YAML when some text and then a tag is present works in live preview mode',
    filePath: 'obsidian-mode/move-tag-to-yaml-2.md',
    async setup(plugin: TestLinterPlugin, editor: Editor) {
      await moveToYamlSetup(plugin, editor),
      await setWorkspaceItemMode(plugin.app, false);
    },
  },
  {
    name: 'Moving tag to YAML when some text and then a tag is present works in source mode',
    filePath: 'obsidian-mode/move-tag-to-yaml-2.md',
    setup: moveToYamlSetup,
  },
];
