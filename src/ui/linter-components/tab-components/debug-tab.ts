import log from 'loglevel';
import LinterPlugin from 'src/main';
import {Tab} from './tab';
import {Setting} from 'obsidian';
import {TextBoxFull} from 'src/ui/components/text-box-full';
import {parseTextToHTMLWithoutOuterParagraph} from 'src/ui/helpers';
import {logsFromLastRun} from 'src/utils/logger';
import {IssueReporter} from '../issue-reporter';

const logLevels = Object.keys(log.levels);
const logLevelInts = Object.values(log.levels);
const baseIssueURL = 'https://github.com/plater/obsidian-linter/issues/new?';

export class DebugTab extends Tab {
  constructor(navEl: HTMLElement, settingsEl: HTMLElement, isMobile: boolean, plugin: LinterPlugin) {
    super(navEl, settingsEl, 'Debug', isMobile, plugin);
    this.display();
  }

  display(): void {
    let tempDiv = this.contentEl.createDiv();
    let settingName = 'Log Level';
    let settingDesc = 'The types of logs that will be allowed to be logged by the service. The default is ERROR.';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          logLevels.forEach((logLevel, index) => {
            dropdown.addOption(logLevelInts[index], logLevel);
          });
          // set value only takes strings so I have to cast the log level to type string in order to get it to work properly
          dropdown.setValue(this.plugin.settings.logLevel + '');
          dropdown.onChange(async (value) => {
            let parsedInt = parseInt(value);
            if (isNaN(parsedInt)) {
              parsedInt = log.levels.ERROR;
            }

            this.plugin.settings.logLevel = parsedInt;
            await this.plugin.saveSettings();
          });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = 'Linter Config';
    settingDesc = 'The contents of the data.json for the Linter as of the setting page loading';
    const configDisplay = new TextBoxFull(tempDiv, settingName, settingDesc);
    configDisplay.inputEl.setText(JSON.stringify(this.plugin.settings, null, 2));

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = 'Collect logs when linting on save and linting the current file';
    settingDesc = 'Goes ahead and collects logs when you `Lint on save` and linting the current file. These logs can be helpful for debugging and create bug reports.';
    const setting = new Setting(tempDiv)
        .setName(settingName)
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.recordLintOnSaveLogs)
              .onChange(async (value) => {
                this.plugin.settings.recordLintOnSaveLogs = value;
                await this.plugin.saveSettings();
              });
        });

    parseTextToHTMLWithoutOuterParagraph(settingDesc, setting.descEl);

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = 'Linter Logs';
    settingDesc = 'The logs from the last `Lint on save` or the last lint current file run if enabled.';
    const logDisplay = new TextBoxFull(tempDiv, settingName, settingDesc);
    logDisplay.inputEl.setText(logsFromLastRun.join('\n'));

    parseTextToHTMLWithoutOuterParagraph(settingDesc, setting.descEl);

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = 'Linter Reporter';
    settingDesc = 'Allows the user to report feature requests and bugs to github by generating a link that can be used to open an issue.';
    new IssueReporter(tempDiv, configDisplay);
    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);
  }

  buildGithubIssueInfo(): string {
    //     const issue_url = baseIssueURL + new URLSearchParams({
    //     title: `Bug: `,
    //     body: `# User report\n**Description:** \n\n\n\n---\n# Debug Data (no need to alter this)\n${Array.from(Object.entries({
    //         service_version: $settings.service_settings[tab].version,
    //         obsidian_version: navigator.userAgent,
    //     })).map((x) => `**${x[0]}**: ${JSON.stringify(x[1])}`).join("\n")}`,
    //     labels: `bug`
    // })});

    const issue_url = baseIssueURL + new URLSearchParams({
      title: `Bug: `,
      body: `## Describe the Bug\nTODO: ADD FORM INFO HERE \n## How to Reproduce\n\n\n---\n# Debug Data (no need to alter this)\n${Array.from(Object.entries({
        service_version: this.plugin.manifest.version,
        obsidian_version: navigator.userAgent,
      })).map((x) => `**${x[0]}**: ${JSON.stringify(x[1])}`).join('\n')}`,
      labels: `bug`,
    });

    return '';
  }
}
