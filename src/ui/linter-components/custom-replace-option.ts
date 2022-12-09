import {Setting} from 'obsidian';
import {AddCustomRow} from '../components/add-custom-row';
export type CustomReplace = {find: string, replace: string, flags: string};

const defaultFlags = 'gm';

export class CustomReplaceOption extends AddCustomRow {
  constructor(containerEl: HTMLElement, public regexes: CustomReplace[], isMobile: boolean, saveSettings: () => void) {
    super(
        containerEl,
        'Custom Regex Replacement',
        `Custom regex replacement can be used to replace anything that matches the find regex with the replacement value. The replace and find values will need to be valid regex values.`,
        `Use this with caution if you do not know regex. Also, please make sure that you do not use lookbehinds in your regex on iOS mobile as that will cause linting to fail since that is not supported on that platform.`,
        'Add new regex replacement',
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
      cb.setPlaceholder('regex to find')
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
      cb.setPlaceholder('flags')
          .setValue(regex.flags)
          .onChange((value) => {
            this.regexes[index].flags = value;
            this.saveSettings();
          });
    }).addText((cb) => {
      cb.setPlaceholder('regex to replace')
          .setValue(regex.replace)
          .onChange((value) => {
            this.regexes[index].replace = value;
            this.saveSettings();
          });
    }).addExtraButton((cb)=>{
      cb.setIcon('cross')
          .setTooltip('Delete')
          .onClick(()=>{
            this.regexes.splice(index, 1);
            this.saveSettings();
            this.resetInputEls();
          });
    });
  }
}
