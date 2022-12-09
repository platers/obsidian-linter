import {App, Platform, PluginSettingTab} from 'obsidian';
import LinterPlugin from 'src/main';
import {ruleTypeToRules} from 'src/rules';
import {hideEl} from './helpers';
import {SearchStatus, Tab} from './linter-components/tab-components/tab';
import {GeneralTab} from './linter-components/tab-components/general-tab';
import {RuleTab} from './linter-components/tab-components/rule-tab';
import {CustomTab} from './linter-components/tab-components/custom-tab';
import {TabSearcher} from './linter-components/tab-components/tab-searcher';

export class SettingTab extends PluginSettingTab {
  plugin: LinterPlugin;
  navContainer: HTMLElement;
  navEl: HTMLDivElement;
  settingsEl: HTMLDivElement;
  private tabNameToTab: Map<string, Tab> = new Map<string, Tab>();
  private selectedTab: string = 'General';
  private searchZeroState: HTMLDivElement;
  private tabSearcher: TabSearcher;

  constructor(app: App, plugin: LinterPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;

    containerEl.empty();

    const linterHeader = containerEl.createDiv('linter-setting-title');
    if (Platform.isMobile) {
      linterHeader.addClass('linter-mobile');
    } else {
      linterHeader.createEl('h1').setText('Linter');
    }

    this.navContainer = containerEl.createEl('nav', {cls: 'linter-setting-header'});
    this.navEl = this.navContainer.createDiv('linter-setting-tab-group');
    this.settingsEl = containerEl.createDiv('linter-setting-content');

    this.addTabs(Platform.isMobile);
    this.createSearchZeroState(Platform.isMobile);
    this.generateSearchBar(linterHeader);

    if (this.selectedTab == '') {
      this.tabSearcher.focusOnInput();
    }
  }

  private addTabs(isMobile: boolean) {
    this.addTab(new GeneralTab(this.navEl, this.settingsEl, isMobile, this.plugin));
    for (const [ruleType, rules] of ruleTypeToRules) {
      this.addTab(new RuleTab(this.navEl, this.settingsEl, ruleType, rules, isMobile, this.plugin));
    }
    this.addTab(new CustomTab(this.navEl, this.settingsEl, isMobile, this.app, this.plugin));
  }

  private generateSearchBar(containerEl: HTMLDivElement) {
    this.tabSearcher = new TabSearcher(containerEl, this.searchZeroState, this.tabNameToTab, () => {
      for (const tab of this.tabNameToTab.values()) {
        tab.updateTabDisplayMode(false, SearchStatus.EnteringSearchMode);

        const searchVal = this.tabSearcher.search.getValue();
        if (this.selectedTab == '' && searchVal.trim() != '') {
          this.tabSearcher.searchSettings(searchVal.toLowerCase());
        }

        this.selectedTab = '';
      }
    });
  }

  private createSearchZeroState(isMobile: boolean) {
    this.searchZeroState = this.settingsEl.createDiv();
    hideEl(this.searchZeroState);
    this.searchZeroState.createEl(isMobile ? 'h3' : 'h2', {text: 'No settings match search'}).style.textAlign = 'center';
  }

  private addTab(tab: Tab) {
    tab.navButton.onclick = () => {
      this.onTabClick(tab.name);
    };

    tab.updateTabDisplayMode(this.selectedTab === tab.name, SearchStatus.None);

    this.tabNameToTab.set(tab.name, tab);
  }

  onTabClick(clickedTabName: string) {
    if (this.selectedTab === clickedTabName) {
      return;
    }

    if (this.selectedTab == '') {
      for (const [tabName, tab] of this.tabNameToTab) {
        tab.updateTabDisplayMode(tabName === clickedTabName, SearchStatus.LeavingSearchMode);
      }
    } else {
      hideEl(this.searchZeroState);
      const clickedTab = this.tabNameToTab.get(clickedTabName);
      clickedTab.updateTabDisplayMode(true);

      const previouslySelectedTab = this.tabNameToTab.get(this.selectedTab);
      previouslySelectedTab.updateTabDisplayMode(false);
    }

    this.selectedTab = clickedTabName;
  }
}
