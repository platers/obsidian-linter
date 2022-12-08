import { setIcon } from 'obsidian';
import { hideEl, unhideEl } from '../helpers';
import {Tab} from './tab';

type TabContentInfo = {content: HTMLDivElement, heading: HTMLElement, navButton: HTMLElement}

export class TabManager {
  navContainer: HTMLElement;
  navEl: HTMLDivElement;
  settingsEl: HTMLDivElement;
  private tabContent: Map<string, TabContentInfo> = new Map<string, TabContentInfo>();
  private selectedTab: string = 'General';
  constructor(public containerEl: HTMLElement, public isMobile: boolean) {}

  display() {
    this.navContainer = this.containerEl.createEl('nav', {cls: 'linter-setting-header'});
    this.navEl = this.navContainer.createDiv('linter-setting-tab-group');
    this.settingsEl = this.containerEl.createDiv('linter-setting-content');
  }

  addTab(tabName: string, tabIconId: string, generateTabContent?: (el: HTMLElement, tabName: string) => void) {
    // createTabAndContent(tabName: string, navEl: HTMLElement, containerEl: HTMLElement, generateTabContent?: (el: HTMLElement, tabName: string) => void) {
      const displayTabContent = this.selectedTab === tabName;
      const tabEl = this.navEl.createDiv('linter-navigation-item');
  
      let tabClass = 'linter-desktop';
      if (this.isMobile) {
        tabClass = 'linter-mobile';
      }
  
      tabEl.addClass(tabClass);
      setIcon(tabEl.createSpan({cls: 'linter-navigation-item-icon'}), tabIconId, 20);
      tabEl.createSpan().setText(tabName);
  
      tabEl.onclick = () => {
        if (this.selectedTab == tabName) {
          return;
        }
  
        tabEl.addClass('linter-navigation-item-selected');
        const tab = this.tabContent.get(tabName);
        unhideEl(tab.content);
  
        if (this.selectedTab != '') {
          const tabInfo = this.tabContent.get(this.selectedTab);
          tabInfo.navButton.removeClass('linter-navigation-item-selected');
          hideEl(tabInfo.content);
        } else {
          hideEl(this.searchZeroState);
  
  
          for (const settingTab of this.searchSettingInfo) {
            for (const setting of settingTab[1]) {
              unhideEl(setting.containerEl);
            }
          }
  
          for (const tabInfo of this.tabContent) {
            const tab = tabInfo[1];
            hideEl(tab.heading);
            if (tabName !== tabInfo[0]) {
              hideEl(tab.content);
            }
          }
        }
  
        this.selectedTab = tabName;
      };
  
      const tabContent = this.settingsEl.createDiv('linter-tab-settings');
  
      const tabHeader = tabContent.createEl('h2', {text: tabName + ' Settings'});
      hideEl(tabHeader);
  
      tabContent.id = tabName.toLowerCase().replace(' ', '-');
      if (!displayTabContent) {
        hideEl(tabContent);
      } else {
        tabEl.addClass('linter-navigation-item-selected');
      }
  
      if (generateTabContent) {
        generateTabContent(tabContent, tabName);
      }
  
      this.tabContent.set(tabName, {content: tabContent, heading: tabHeader, navButton: tabEl});
    }
  }
}
