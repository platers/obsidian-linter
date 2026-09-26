import {AbstractInputSuggest, App, TFolder} from 'obsidian';

export default class FolderSuggester extends AbstractInputSuggest<string> {
  constructor(
      app: App,
      public inputEl: HTMLInputElement,
      public valuesToExclude: string[] = [],
  ) {
    super(app, inputEl);
  }

  protected getSuggestions(inputStr: string): string[] {
    const allFolders = this.app.vault.getAllLoadedFiles()
        .filter((f): f is TFolder => f instanceof TFolder && f.path !== '/')
        .map((f) => f.path);

    const selected = this.inputEl.getAttribute('folderName');
    const lower = inputStr.toLowerCase();
    return allFolders.filter((path) => {
      if (this.valuesToExclude.includes(path) && path !== selected) return false;
      return path.toLowerCase().contains(lower);
    });
  }

  renderSuggestion(folderPath: string, el: HTMLElement): void {
    el.setText(folderPath);
  }

  selectSuggestion(folderPath: string, _evt: MouseEvent | KeyboardEvent): void {
    this.inputEl.setAttribute('folderName', folderPath);
    this.setValue(folderPath);
    this.inputEl.trigger('input');
    this.close();
  }
}
