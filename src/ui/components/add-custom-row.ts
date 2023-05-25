import {Component, Setting} from 'obsidian';
import {parseTextToHTMLWithoutOuterParagraph} from '../helpers';

/**
 * AddCustomRow is meant to be used where you have a setting that needs a name a description, possibly a warning,
 * and a button that allows the user to add another entry.
 */
export abstract class AddCustomRow {
  protected inputElDiv: HTMLDivElement;

  constructor(
    public containerEl: HTMLElement,
    public parentComponent: Component,
    public name: string,
    public description: string,
    public warning: string,
    private addInputBtnText: string,
    protected isMobile: boolean,
    protected saveSettings: () => void,
    private onAddInput: () => void) {
  }

  display() {
    this.containerEl.createEl(this.isMobile ? 'h4' : 'h3', {text: this.name});

    parseTextToHTMLWithoutOuterParagraph(this.description, this.containerEl, this.parentComponent);
    if (this.warning != null) {
      this.containerEl.createEl('p', {text: this.warning, cls: 'mod-warning'});
    }

    new Setting(this.containerEl)
        .addButton((cb)=>{
          cb.setButtonText(this.addInputBtnText)
              .setCta()
              .onClick(() => this.onAddInput());
        });

    this.inputElDiv = this.containerEl.createDiv();
    this.showInputEls();
  }

  protected resetInputEls() {
    this.inputElDiv.empty();
    this.showInputEls();
  }

  protected abstract showInputEls(): void;
}
