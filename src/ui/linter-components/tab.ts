export class Tab {
  constructor(public tabName: string, public tabIconId: string, public isMobile: boolean) {
    let tabClass = 'linter-desktop';
    if (isMobile) {
      tabClass = 'linter-mobile';
    }

    tabEl.addClass(tabClass);
    setIcon(tabEl.createSpan({cls: 'linter-navigation-item-icon'}), tabNameToTabIconId[tabName], 20);
  }
}
