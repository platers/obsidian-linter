import {Component, Setting} from 'obsidian';
import {parseTextToHTMLWithoutOuterParagraph} from '../helpers';

/**
 * AddCustomRefreshableRow is meant to be used where you have a setting that needs a name a description, possibly a warning,
 * a button that allows the user to add another entry, and an option to refresh the whole set of content.
 */
export abstract class AddCustomRefreshableRow {
  protected inputElDiv: HTMLDivElement;

  constructor(
    public containerEl: HTMLElement,
    public parentComponent: Component,
    public name: string,
    public description: string,
    public warning: string,
    private addInputTooltip: string,
    private refreshBtnTooltip: string,
    protected saveSettings: () => void,
    private onAddInput: () => void,
    private onRefresh: () => Promise<void>) {
  }

  display() {
    this.containerEl.createDiv({cls: 'setting-item-name', text: this.name});

    const descriptionAndWarningContainer = this.containerEl.createDiv({cls: 'setting-item-description'});

    parseTextToHTMLWithoutOuterParagraph(this.description, descriptionAndWarningContainer.createEl('p', {cls: 'custom-row-description'}), this.parentComponent);

    new Setting(this.containerEl)
        .addButton((cb)=>{
          cb.setIcon('plus-with-circle')
              .setTooltip(this.addInputTooltip)
              .onClick(() => this.onAddInput());
          cb.buttonEl.addClass('clickable-icon');
        }).addButton((cb)=>{
          cb.setIcon('reset')
              .setTooltip(this.refreshBtnTooltip)
              .onClick(() => this.onRefresh());
          cb.buttonEl.addClass('clickable-icon');
        })
        .setClass('linter-border-bottom')
        .setDesc(this.warning ?? '')
        .descEl.addClass('mod-warning');

    this.inputElDiv = this.containerEl.createDiv();
    this.showInputEls();
  }

  protected resetInputEls() {
    this.inputElDiv.empty();
    this.showInputEls();
  }

  protected abstract showInputEls(): void;
}
