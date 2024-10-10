import LinterPlugin from 'src/main';
import {Tab} from './tab';
import {Rule} from 'src/rules';
import {BooleanOption, SearchOptionInfo} from 'src/option';
import {Setting} from 'obsidian';

export class RuleTab extends Tab {
  constructor(navEl: HTMLElement, settingsEl: HTMLElement, ruleTypeName: string, private rules: Rule[], isMobile: boolean, plugin: LinterPlugin) {
    super(navEl, settingsEl, ruleTypeName, isMobile, plugin);
    this.display();
  }

  display(): void {
    for (const rule of this.rules) {
      const ruleDiv = this.contentEl.createDiv();
      ruleDiv.id = rule.alias;

      new Setting(ruleDiv).setHeading().settingEl.innerHTML = `<a href="${rule.getURL()}">${rule.getName()}</a>`;

      const optionInfo = [] as SearchOptionInfo[];
      let isFirstOption = true;
      let hideOnLoad = false;
      for (const option of rule.options) {
        option.display(ruleDiv, this.plugin.settings, this.plugin);
        optionInfo.push(option.getSearchInfo());

        if (isFirstOption) {
          isFirstOption = false;
          if (option instanceof BooleanOption) {
            hideOnLoad = !this.plugin.settings.ruleConfigs[option.ruleAlias][option.configKey];
          }
        } else if (hideOnLoad) {
          option.hide();
        }
      }

      this.addSettingSearchInfo(ruleDiv, rule.getName().toLowerCase(), rule.getDescription().toLowerCase(), optionInfo, ruleDiv.id);
    }
  }
}
