import {App, Component, Platform, PluginSettingTab} from 'obsidian';
import LinterPlugin from 'src/main';
import {RuleType, ruleTypeToRules} from 'src/rules';
import {hideEl} from './helpers';
import {SearchStatus, Tab} from './linter-components/tab-components/tab';
import {GeneralTab} from './linter-components/tab-components/general-tab';
import {RuleTab} from './linter-components/tab-components/rule-tab';
import {CustomTab} from './linter-components/tab-components/custom-tab';
import {TabSearcher} from './linter-components/tab-components/tab-searcher';
import {DebugTab} from './linter-components/tab-components/debug-tab';
import {getTextInLanguage} from 'src/lang/helpers';

export class SettingTab extends PluginSettingTab {
  navContainer: HTMLElement;
  tabNavEl: HTMLDivElement;
  settingsContentEl: HTMLDivElement;
  component: Component;
  private tabNameToTab: Map<string, Tab> = new Map<string, Tab>();
  private selectedTab: string = 'General';
  private searchZeroState: HTMLDivElement;
  private tabSearcher: TabSearcher;

  constructor(app: App, public plugin: LinterPlugin) {
    super(app, plugin);
    this.component = new Component();
  }

  display(): void {
    const {containerEl} = this;

    this.component.load();
    containerEl.empty();
    const linterHeader = containerEl.createDiv('linter-setting-title');
    if (Platform.isMobile) {
      linterHeader.addClass('linter-mobile');
    } else {
      linterHeader.createEl('h1').setText(getTextInLanguage('linter-title'));
    }

    this.navContainer = containerEl.createEl('nav', {cls: 'linter-setting-header'});
    this.tabNavEl = this.navContainer.createDiv('linter-setting-tab-group');
    this.settingsContentEl = containerEl.createDiv('linter-setting-content');
    this.addTabs(Platform.isMobile);
    this.createSearchZeroState(Platform.isMobile);
    this.generateSearchBar(linterHeader);

    if (this.selectedTab == '') {
      this.tabSearcher.focusOnInput();
    }
  }

  hide(): void {
    this.component.unload();
  }

  private addTabs(isMobile: boolean) {
    this.addTab(new GeneralTab(this.tabNavEl, this.settingsContentEl, isMobile, this.plugin, this.app));

    for (const ruleType of Object.values(RuleType)) {
      this.addTab(new RuleTab(this.tabNavEl, this.settingsContentEl, ruleType, ruleTypeToRules.get(ruleType), isMobile, this.plugin));
    }

    this.addTab(new CustomTab(this.tabNavEl, this.settingsContentEl, isMobile, this.app, this.plugin));
    this.addTab(new DebugTab(this.tabNavEl, this.settingsContentEl, isMobile, this.plugin));
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
    this.searchZeroState = this.settingsContentEl.createDiv();
    hideEl(this.searchZeroState);
    this.searchZeroState.createEl(isMobile ? 'h3' : 'h2', {text: getTextInLanguage('empty-search-results-text')}).style.textAlign = 'center';
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
