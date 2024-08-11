import {TextInputSuggest} from './suggest';
import {App, TFile} from 'obsidian';

export default class MdFileSuggester extends TextInputSuggest<string> {
  constructor(
    public app: App,
    public inputEl: HTMLInputElement,
    public valuesToExclude: string[] = [],
  ) {
    super(app, inputEl);
  }

  getSuggestions(input_str: string): string[] {
    const all_md_files = this.app.vault.getAllLoadedFiles().filter((f) => f instanceof TFile && f.path.endsWith('.md')).map((f) => f.path);
    if (!all_md_files) {
      return [];
    }

    const nonSelectedMdFiles = all_md_files.filter((el: string) => {
      return !this.valuesToExclude.includes(el) || el === this.inputEl.getAttribute('fileName');
    });

    const files: string[] = [];
    const lower_input_str = input_str.toLowerCase();
    nonSelectedMdFiles.forEach((folderPath: string) => {
      if (folderPath.toLowerCase().contains(lower_input_str)) {
        files.push(folderPath);
      }
    });

    return files;
  }

  renderSuggestion(filePath: string, el: HTMLElement): void {
    el.setText(filePath);
  }

  selectSuggestion(filePath: string): void {
    this.inputEl.setAttribute('fileName', filePath);
    this.inputEl.value = filePath;
    this.inputEl.trigger('input');
    this.close();
  }
}
