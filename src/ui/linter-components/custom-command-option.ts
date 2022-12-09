import {Setting, App} from 'obsidian';
import {AddCustomRow} from '../components/add-custom-row';
import CommandSuggester from '../suggesters/command-suggester';

export type LintCommand = { id: string, name: string };

export class CustomCommandOption extends AddCustomRow {
  constructor(containerEl: HTMLElement, public lintCommands: LintCommand[], isMobile: boolean, private app: App, saveSettings: () => void) {
    super(containerEl,
        'Custom Commands',
        `Custom commands are Obsidian commands that get run after the linter is finished running its regular rules. This means that they do not run before the YAML timestamp logic runs, so they can cause YAML timestamp to be triggered on the next run of the linter. You may only select an Obsidian command once. **_Note that this currently only works on linting the current file._**`,
        `When selecting an option, make sure to select the option either by using the mouse or by hitting the enter key. Other selection methods may not work and only selections of an actual Obsidian command or an empty string will be saved.`,
        'Add new command',
        isMobile,
        saveSettings,
        () => {
          const newCommand = {id: '', name: ''};
          this.lintCommands.push(newCommand);
          this.saveSettings();
          this.addCommand(newCommand, this.lintCommands.length - 1, true);
        });

    this.display();
  }

  protected showInputEls() {
    this.lintCommands.forEach((command, index) => {
      this.addCommand(command, index);
    });
  }

  private addCommand(command: LintCommand, index: number, focusOnCommand: boolean = false) {
    new Setting(this.inputElDiv)
        .addSearch((cb) => {
          new CommandSuggester(this.app, cb.inputEl, this.lintCommands);
          cb.setPlaceholder('Obsidian command')
              .setValue(command.name)
              .onChange((newCommandName) => {
                const newCommand = {id: cb.inputEl.getAttribute('commandId'), name: newCommandName};

                // make sure that the command is valid before making any attempt to save the value
                if (newCommand.name && newCommand.id) {
                  this.lintCommands[index] = newCommand;
                  this.saveSettings();
                } else if (!newCommand.name && !newCommand.id) { // the value has been cleared out
                  this.lintCommands[index] = newCommand;
                  this.saveSettings();
                }
              });

          cb.inputEl.setAttr('tabIndex', index);
          cb.inputEl.addClass('linter-custom-command');

          if (focusOnCommand) {
            cb.inputEl.focus();
          }
        })
        .addExtraButton((cb) => {
          cb.setIcon('up-chevron-glyph')
              .setTooltip('Move up')
              .onClick(() => {
                this.arrayMove(index, index - 1);
                this.saveSettings();
                this.resetInputEls();
              });
        })
        .addExtraButton((cb) => {
          cb.setIcon('down-chevron-glyph')
              .setTooltip('Move down')
              .onClick(() => {
                this.arrayMove(index, index + 1);
                this.saveSettings();
                this.resetInputEls();
              });
        })
        .addExtraButton((cb) => {
          cb.setIcon('cross')
              .setTooltip('Delete')
              .onClick(() => {
                this.lintCommands.splice(index, 1);
                this.saveSettings();
                this.resetInputEls();
              });
        });
  }

  // TODO: swap this out for something that actually swaps the values of the html elements as well to avoid the need for a refresh of these settings on swap and delete
  private arrayMove(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex === this.lintCommands.length) {
      return;
    }

    const element = this.lintCommands[fromIndex];
    this.lintCommands[fromIndex] = this.lintCommands[toIndex];
    this.lintCommands[toIndex] = element;
  }
}
