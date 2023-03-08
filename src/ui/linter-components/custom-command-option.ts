import {Setting, App} from 'obsidian';
import {getTextInLanguage} from 'src/lang/helpers';
import {AddCustomRow} from '../components/add-custom-row';
import CommandSuggester from '../suggesters/command-suggester';

export type LintCommand = { id: string, name: string };

export class CustomCommandOption extends AddCustomRow {
  constructor(containerEl: HTMLElement, public lintCommands: LintCommand[], isMobile: boolean, private app: App, saveSettings: () => void) {
    super(containerEl,
        getTextInLanguage('options.custom-command.name'),
        getTextInLanguage('options.custom-command.description'),
        getTextInLanguage('options.custom-command.warning'),
        getTextInLanguage('options.custom-command.add-input-button-text'),
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
          cb.setPlaceholder(getTextInLanguage('options.custom-command.command-search-placeholder-text'))
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
              .setTooltip(getTextInLanguage('options.custom-command.move-up-tooltip'))
              .onClick(() => {
                this.arrayMove(index, index - 1);
                this.saveSettings();
                this.resetInputEls();
              });
        })
        .addExtraButton((cb) => {
          cb.setIcon('down-chevron-glyph')
              .setTooltip(getTextInLanguage('options.custom-command.move-down-tooltip'))
              .onClick(() => {
                this.arrayMove(index, index + 1);
                this.saveSettings();
                this.resetInputEls();
              });
        })
        .addExtraButton((cb) => {
          cb.setIcon('cross')
              .setTooltip(getTextInLanguage('options.custom-command.delete-tooltip'))
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
