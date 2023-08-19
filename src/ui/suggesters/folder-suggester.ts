import {TextInputSuggest} from './suggest';
import {App, TFolder} from 'obsidian';

export default class FolderSuggester extends TextInputSuggest<string> {
  constructor(
    public app: App,
    public inputEl: HTMLInputElement,
    public valuesToExclude: string[] = [],
  ) {
    super(app, inputEl);
  }

  getSuggestions(input_str: string): string[] {
    const all_folders = this.app.vault.getAllLoadedFiles().filter((f) => f instanceof TFolder && f.path !== '/').map((f) => f.path);
    if (!all_folders) {
      return [];
    }

    const nonSelectedFolders = all_folders.filter((el: string) => {
      return !this.valuesToExclude.includes(el) || el === this.inputEl.getAttribute('folderExists');
    });

    const folders: string[] = [];
    const lower_input_str = input_str.toLowerCase();
    nonSelectedFolders.forEach((folderPath: string) => {
      if (folderPath.toLowerCase().contains(lower_input_str)) {
        folders.push(folderPath);
      }
    });

    return folders;
  }

  renderSuggestion(folderPath: string, el: HTMLElement): void {
    el.setText(folderPath);
  }

  selectSuggestion(folderPath: string): void {
    this.inputEl.setAttribute('folderName', folderPath);
    this.inputEl.value = folderPath;
    this.inputEl.trigger('input');
    this.close();
  }
}
