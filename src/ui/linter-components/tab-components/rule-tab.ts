import LinterPlugin from 'src/main';
import {Tab} from './tab';
import {Rule} from 'src/rules';
import {SearchOptionInfo} from 'src/option';

export class RuleTab extends Tab {
  constructor(navEl: HTMLElement, settingsEl: HTMLElement, ruleTypeName: string, private rules: Rule[], isMobile: boolean, plugin: LinterPlugin) {
    super(navEl, settingsEl, ruleTypeName, isMobile, plugin);
    this.display();
  }

  display(): void {
    for (const rule of this.rules) {
      const ruleDiv = this.contentEl.createDiv();
      ruleDiv.id = rule.alias;
      ruleDiv.createEl(this.isMobile ? 'h4' : 'h3', {}, (el) => {
        el.innerHTML = `<a href="${rule.getURL()}">${rule.getName()}</a>`;
      });

      const optionInfo = [] as SearchOptionInfo[];
      for (const option of rule.options) {
        option.display(ruleDiv, this.plugin.settings, this.plugin);
        optionInfo.push(option.getSearchInfo());
      }

      this.addSettingSearchInfo(ruleDiv, rule.getName().toLowerCase(), rule.getDescription().toLowerCase(), optionInfo, ruleDiv.id);
    }
  }
}
