import {AbstractInputSuggest, App, Command} from 'obsidian';
import {LintCommand} from '../linter-components/custom-command-option';

export default class CommandSuggester extends AbstractInputSuggest<Command> {
  constructor(
      app: App,
      public inputEl: HTMLInputElement,
      public valuesToExclude: LintCommand[] = [],
      initial: LintCommand | null = null,
  ) {
    super(app, inputEl);

    if (initial) {
      this.selectSuggestion(initial, null);
    }
  }

  protected getSuggestions(inputStr: string): Command[] {
    const allCommands = this.app.commands.listCommands() ?? [];
    const selectedId = this.inputEl.getAttribute('commandId');
    const lower = inputStr.toLowerCase();

    return allCommands.filter((cmd) => {
      const alreadySelected = this.valuesToExclude.some((sel) => sel.id === cmd.id);
      if (alreadySelected && cmd.id !== selectedId) return false;
      return cmd.id.contains(lower) || cmd.name.toLowerCase().contains(lower);
    });
  }

  renderSuggestion(command: Command, el: HTMLElement): void {
    el.setText(command.name);
  }

  selectSuggestion(command: Command, _evt: MouseEvent | KeyboardEvent | null): void {
    this.inputEl.setAttribute('commandId', command.id);
    this.setValue(command.name);
    this.inputEl.trigger('input');
    this.close();
  }
}
