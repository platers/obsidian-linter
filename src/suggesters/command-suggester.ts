import {TextInputSuggest} from './suggest';
import type {App, Command} from 'obsidian';

export default class CommandSuggester extends TextInputSuggest<Command> {
  constructor(
    public app: App,
    public inputEl: HTMLInputElement,
  ) {
    super(app, inputEl);
  }

  getSuggestions(input_str: string): Command[] {
    // @ts-ignore
    const all_commands = this.app.commands.listCommands();
    if (!all_commands) {
      return [];
    }

    const commands:Command[] = [];
    const lower_input_str = input_str.toLowerCase();
    all_commands.forEach((command:Command) => {
      if (command.id.contains(lower_input_str)) {
        commands.push(command);
      }
    });
    return commands;
  }

  renderSuggestion(command: Command, el: HTMLElement): void {
    el.setText(command.name);
  }

  selectSuggestion(command: Command): void {
    this.inputEl.value = command.id;
    this.inputEl.trigger('input');
    this.close();
  }
}
