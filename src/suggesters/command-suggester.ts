import {TextInputSuggest} from './suggest';
import type {App, Command} from 'obsidian';
import {LintCommand} from 'src/rules';

export default class CommandSuggester extends TextInputSuggest<Command> {
  constructor(
    public app: App,
    public inputEl: HTMLInputElement,
    public valuesToExclude: LintCommand[] = [],
  ) {
    super(app, inputEl);
  }

  getSuggestions(input_str: string): Command[] {
    const all_commands = this.app.commands.listCommands();
    if (!all_commands) {
      return [];
    }

    const nonSelectedCommands = all_commands.filter((el: Command) => {
      for (const selectedCommandInfo of this.valuesToExclude) {
        if (selectedCommandInfo.id == el.id &&
          !(this.inputEl.hasAttribute('commandId') && this.inputEl.getAttribute('commandId') == el.id)
        ) {
          return false;
        }
      }

      return true;
    });

    const commands:Command[] = [];
    const lower_input_str = input_str.toLowerCase();
    nonSelectedCommands.forEach((command:Command) => {
      if (command.id.contains(lower_input_str) || command.name.contains(lower_input_str)) {
        commands.push(command);
      }
    });
    return commands;
  }

  renderSuggestion(command: Command, el: HTMLElement): void {
    el.setText(command.name);
  }

  selectSuggestion(command: Command): void {
    this.inputEl.value = command.name;
    this.inputEl.setAttribute('commandId', command.id);
    this.inputEl.trigger('input');
    this.close();
  }
}
