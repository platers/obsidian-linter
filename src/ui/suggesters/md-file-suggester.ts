import {AbstractInputSuggest, App, TFile} from 'obsidian';

export default class MdFileSuggester extends AbstractInputSuggest<string> {
  constructor(
      app: App,
      public inputEl: HTMLInputElement,
      public valuesToExclude: string[] = [],
  ) {
    super(app, inputEl);
  }

  protected getSuggestions(inputStr: string): string[] {
    const allMdFiles = this.app.vault.getAllLoadedFiles()
        .filter((f): f is TFile => f instanceof TFile && f.path.endsWith('.md'))
        .map((f) => f.path);

    const selected = this.inputEl.getAttribute('fileName');
    const lower = inputStr.toLowerCase();
    return allMdFiles.filter((path) => {
      if (this.valuesToExclude.includes(path) && path !== selected) return false;
      return path.toLowerCase().contains(lower);
    });
  }

  renderSuggestion(filePath: string, el: HTMLElement): void {
    el.setText(filePath);
  }

  selectSuggestion(filePath: string, _evt: MouseEvent | KeyboardEvent): void {
    this.inputEl.setAttribute('fileName', filePath);
    this.setValue(filePath);
    this.inputEl.trigger('input');
    this.close();
  }
}
