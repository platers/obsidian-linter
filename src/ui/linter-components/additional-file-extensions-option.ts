import {App, Setting} from 'obsidian';
import {getTextInLanguage} from 'src/lang/helpers';
import {AddCustomRow} from '../components/add-custom-row';

export class AdditionalFileExtensionsOption extends AddCustomRow {
  constructor(containerEl: HTMLElement, public additionalFileExtensions: string[], app: App, saveSettings: () => void) {
    super(
        containerEl,
        getTextInLanguage('tabs.general.additional-file-extensions.name'),
        getTextInLanguage('tabs.general.additional-file-extensions.description'),
        null,
        getTextInLanguage('tabs.general.additional-file-extensions.add-input-button-text'),
        app,
        saveSettings,
        ()=>{
          this.additionalFileExtensions.push('');
          this.saveSettings();
          this.addExtensionRow('', this.additionalFileExtensions.length - 1, true);
        });
    this.display();
    this.inputElDiv.addClass('linter-additional-file-extensions-container');
  }

  protected showInputEls(): void {
    this.additionalFileExtensions.forEach((ext, index) => {
      this.addExtensionRow(ext, index);
    });
  }

  private addExtensionRow(extension: string, index: number, focusOnCommand: boolean = false) {
    const setting = new Setting(this.inputElDiv)
        .addText((cb) => {
          cb.setPlaceholder(getTextInLanguage('tabs.general.additional-file-extensions.extension-placeholder'))
              .setValue(extension)
              .onChange((value) => {
                this.additionalFileExtensions[index] = value.trim().toLowerCase();
                this.saveSettings();
              });

          if (focusOnCommand) {
            cb.inputEl.focus();
          }
        })
        .addExtraButton((cb) => {
          cb.setIcon('trash')
              .setTooltip(getTextInLanguage('tabs.general.additional-file-extensions.delete-tooltip'))
              .onClick(() => {
                this.additionalFileExtensions.splice(index, 1);
                this.saveSettings();
                this.resetInputEls();
              });
        });

    setting.settingEl.addClass('linter-no-border');
  }
}
