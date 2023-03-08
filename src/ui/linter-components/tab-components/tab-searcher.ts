// based on https://github.com/valentine195/obsidian-settings-search/blob/master/src/main.ts#L294-L308
import {SearchComponent, Setting} from 'obsidian';
import {getTextInLanguage} from 'src/lang/helpers';
import {SearchOptionInfo} from 'src/option';
import {hideEl, unhideEl} from '../../helpers';
import {Tab} from './tab';

export type settingSearchInfo = {containerEl: HTMLDivElement, name: string, description: string, options: SearchOptionInfo[], alias?: string}

export class TabSearcher {
  search: SearchComponent;
  private searchSettingInfo: Map<string, settingSearchInfo[]> = new Map();

  constructor(public containerEl: HTMLDivElement, public searchZeroState: HTMLDivElement, private tabNameToTab: Map<string, Tab>, private onFocus: () => void) {
    for (const [tabName, tab] of tabNameToTab) {
      this.searchSettingInfo.set(tabName, tab.searchSettingInfo);
    }

    this.display();
  }

  display() {
    const searchSetting = new Setting(this.containerEl);
    searchSetting.settingEl.style.border = 'none';
    searchSetting.addSearch((s: SearchComponent) => {
      this.search = s;
    });

    this.search.setPlaceholder(getTextInLanguage('tabs.default-search-bar-text'));

    this.search.inputEl.onfocus = () => {
      this.onFocus();
    };

    this.search.onChange((value: string) => {
      this.searchSettings(value.toLowerCase());
    });
  }

  searchSettings(searchVal: string) {
    const tabsWithSettingsInSearchResults = new Set<string>();
    const showSearchResultAndAddTabToResultList = function(settingContainer: HTMLElement, tabName: string) {
      unhideEl(settingContainer);

      if (!tabsWithSettingsInSearchResults.has(tabName)) {
        tabsWithSettingsInSearchResults.add(tabName);
      }
    };

    for (const [tabName, tabSettings] of this.searchSettingInfo) {
      for (const settingInfo of tabSettings) {
        // check the more common things first and then make sure to search the options since it will be slower to do that
        // Note: we check for an empty string for searchVal to see if the search is essentially empty which will display all rules
        if (searchVal.trim() === '' || settingInfo.alias?.includes(searchVal) || settingInfo.description.includes(searchVal) || settingInfo.name.includes(searchVal)) {
          showSearchResultAndAddTabToResultList(settingInfo.containerEl, tabName);
        } else if (settingInfo.options) {
          for (const optionInfo of settingInfo.options) {
            if (optionInfo.description.toLowerCase().includes(searchVal) || optionInfo.name.toLowerCase().includes(searchVal)) {
              showSearchResultAndAddTabToResultList(settingInfo.containerEl, tabName);

              break;
            } else if (optionInfo.options) {
              for (const optionsForOption of optionInfo.options) {
                if (optionsForOption.description.toLowerCase().includes(searchVal) || optionsForOption.value.toLowerCase().includes(searchVal)) {
                  showSearchResultAndAddTabToResultList(settingInfo.containerEl, tabName);

                  break;
                }
              }
            }

            hideEl(settingInfo.containerEl);
          }
        } else {
          hideEl(settingInfo.containerEl);
        }
      }
    }

    // display any headings that have setting results and hide any that do not
    for (const [tabName, tab] of this.tabNameToTab) {
      if (tabsWithSettingsInSearchResults.has(tabName)) {
        unhideEl(tab.headingEl);
      } else {
        hideEl(tab.headingEl);
      }
    }

    if (tabsWithSettingsInSearchResults.size === 0) {
      unhideEl(this.searchZeroState);
    } else {
      hideEl(this.searchZeroState);
    }
  }

  focusOnInput() {
    this.search.inputEl.focus();
  }
}
