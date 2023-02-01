import {Setting} from 'obsidian';
import {getTextInLanguage} from 'src/lang/helpers';
import {AddCustomRow} from '../components/add-custom-row';
export type CustomReplace = {find: string, replace: string, flags: string};

const defaultFlags = 'gm';

export class CustomReplaceOption extends AddCustomRow {
  constructor(containerEl: HTMLElement, public regexes: CustomReplace[], isMobile: boolean, saveSettings: () => void) {
    super(
        containerEl,
        getTextInLanguage('custom-replace-name'),
        getTextInLanguage('custom-replace-description'),
        getTextInLanguage('custom-replace-warning'),
        getTextInLanguage('custom-replace-add-input-button-text'),
        isMobile,
        saveSettings,
        ()=>{
          const newRegex = {find: '', replace: '', flags: defaultFlags};
          this.regexes.push(newRegex);
          this.saveSettings();
          this.addRegex(newRegex, this.regexes.length - 1, true);
        });
    this.display();
  }

  protected showInputEls(): void {
    this.regexes.forEach((regex, index) => {
      this.addRegex(regex, index);
    });
  }

  private addRegex(regex: CustomReplace, index: number, focusOnCommand: boolean = false) {
    new Setting(this.inputElDiv).addText((cb) => {
      cb.setPlaceholder(getTextInLanguage('custom-replace-regex-to-find-placeholder-text'))
          .setValue(regex.find)
          .onChange((value) => {
            this.regexes[index].find = value;
            this.saveSettings();
          });
      cb.inputEl.setAttr('inputIndex', index);
      cb.inputEl.addClass('linter-custom-regex-replacement');

      if (focusOnCommand) {
        cb.inputEl.focus();
      }
    }).addText((cb) => {
      cb.setPlaceholder(getTextInLanguage('custom-replace-flags-placeholder-text'))
          .setValue(regex.flags)
          .onChange((value) => {
            this.regexes[index].flags = value;
            this.saveSettings();
          });
    }).addText((cb) => {
      cb.setPlaceholder(getTextInLanguage('custom-replace-regex-to-replace-placeholder-text'))
          .setValue(regex.replace)
          .onChange((value) => {
            this.regexes[index].replace = value;
            this.saveSettings();
          });
    }).addExtraButton((cb)=>{
      cb.setIcon('cross')
          .setTooltip(getTextInLanguage('custom-replace-delete-tooltip'))
          .onClick(()=>{
            this.regexes.splice(index, 1);
            this.saveSettings();
            this.resetInputEls();
          });
    });
  }
}
