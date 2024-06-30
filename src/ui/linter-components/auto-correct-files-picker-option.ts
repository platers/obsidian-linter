import {Setting, Component, App} from 'obsidian';
import {LanguageStringKey, getTextInLanguage} from 'src/lang/helpers';
import {AddCustomRow} from '../components/add-custom-row';
import MdFileSuggester from '../suggesters/md-file-suggester';

export class AutoCorrectFilesPickerOption extends AddCustomRow {
  constructor(containerEl: HTMLElement, parentComponent: Component, public filesPicked: string[], private app: App, saveSettings: () => void, name: LanguageStringKey, description: LanguageStringKey) {
    super(
        containerEl,
        parentComponent,
        getTextInLanguage(name),
        getTextInLanguage(description),
        null,
        'Add another custom file',
        saveSettings,
        ()=>{
          const newPickedFile = '';
          this.filesPicked.push(newPickedFile);
          this.saveSettings();
          this.addPickedFile(newPickedFile, this.filesPicked.length - 1, true);
        });
    this.display();
    this.inputElDiv.addClass('linter-folder-ignore-container');
  }

  protected showInputEls(): void {
    this.filesPicked.forEach((pickedFile, index) => {
      this.addPickedFile(pickedFile, index);
    });
  }

  private addPickedFile(pickedFile: string, index: number, focusOnCommand: boolean = false) {
    const setting = new Setting(this.inputElDiv)
        .addSearch((cb) => {
          new MdFileSuggester(this.app, cb.inputEl, this.filesPicked);
          cb.setPlaceholder(getTextInLanguage('tabs.general.folders-to-ignore.folder-search-placeholder-text'))
              .setValue(pickedFile)
              .onChange((newFolderToIgnore) => {
                // TODO: add the logic for when a file exists and has been selected that we parse that file's contents into the extra words list
                const folderToIgnore = newFolderToIgnore;

                if (folderToIgnore === '' || folderToIgnore === cb.inputEl.getAttribute('fileName')) {
                  this.filesPicked[index] = folderToIgnore;
                  this.saveSettings();
                }
              });

          cb.inputEl.setAttr('tabIndex', index);
          cb.inputEl.addClass('linter-folder-ignore');

          if (focusOnCommand) {
            cb.inputEl.focus();
          }
        })
        .addExtraButton((cb) => {
          cb.setIcon('cross')
              .setTooltip(getTextInLanguage('tabs.general.folders-to-ignore.delete-tooltip'))
              .onClick(() => {
                this.filesPicked.splice(index, 1);
                this.saveSettings();
                this.resetInputEls();
              });
        });

    setting.settingEl.addClass('linter-no-border');
  }
}
