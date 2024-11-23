import {App, Setting} from 'obsidian';
import {getTextInLanguage} from 'src/lang/helpers';
import {AddCustomRow} from '../components/add-custom-row';
import FolderSuggester from '../suggesters/folder-suggester';

export class FolderIgnoreOption extends AddCustomRow {
  constructor(containerEl: HTMLElement, public foldersToIgnore: string[], app: App, saveSettings: () => void) {
    super(
        containerEl,
        getTextInLanguage('tabs.general.folders-to-ignore.name'),
        getTextInLanguage('tabs.general.folders-to-ignore.description'),
        null,
        getTextInLanguage('tabs.general.folders-to-ignore.add-input-button-text'),
        app,
        saveSettings,
        ()=>{
          const newFolderToIgnore = '';
          this.foldersToIgnore.push(newFolderToIgnore);
          this.saveSettings();
          this.addFolderToIgnore(newFolderToIgnore, this.foldersToIgnore.length - 1, true);
        });
    this.display();
    this.inputElDiv.addClass('linter-folder-ignore-container');
  }

  protected showInputEls(): void {
    this.foldersToIgnore.forEach((folder, index) => {
      this.addFolderToIgnore(folder, index);
    });
  }

  private addFolderToIgnore(folderToIgnore: string, index: number, focusOnCommand: boolean = false) {
    const setting = new Setting(this.inputElDiv)
        .addSearch((cb) => {
          new FolderSuggester(this.app, cb.inputEl, this.foldersToIgnore);
          cb.setPlaceholder(getTextInLanguage('tabs.general.folders-to-ignore.folder-search-placeholder-text'))
              .setValue(folderToIgnore)
              .onChange((newFolderToIgnore) => {
                const folderToIgnore = newFolderToIgnore;

                if (folderToIgnore === '' || folderToIgnore === cb.inputEl.getAttribute('folderName')) {
                  this.foldersToIgnore[index] = folderToIgnore;
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
          cb.setIcon('trash')
              .setTooltip(getTextInLanguage('tabs.general.folders-to-ignore.delete-tooltip'))
              .onClick(() => {
                this.foldersToIgnore.splice(index, 1);
                this.saveSettings();
                this.resetInputEls();
              });
        });

    setting.settingEl.addClass('linter-no-border');
  }
}
