import LinterPlugin from 'src/main';
import {Tab} from './tab';
import {Setting} from 'obsidian';
import {moment} from 'obsidian';
import {parseTextToHTMLWithoutOuterParagraph} from 'src/ui/helpers';
import {NormalArrayFormats, SpecialArrayFormats, TagSpecificArrayFormats} from 'src/utils/yaml';

export class GeneralTab extends Tab {
  constructor(navEl: HTMLElement, settingsEl: HTMLElement, isMobile: boolean, plugin: LinterPlugin) {
    super(navEl, settingsEl, 'General', isMobile, plugin);
    this.display();
  }

  display(): void {
    let tempDiv = this.contentEl.createDiv();
    let settingName = 'Lint on save';
    let settingDesc = 'Lint the file on manual save (when `Ctrl + S` is pressed or when `:w` is executed while using vim keybindings)';
    const setting = new Setting(tempDiv)
        .setName(settingName)
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.lintOnSave)
              .onChange(async (value) => {
                this.plugin.settings.lintOnSave = value;
                await this.plugin.saveSettings();
              });
        });

    parseTextToHTMLWithoutOuterParagraph(settingDesc, setting.descEl);

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = 'Display message on lint';
    settingDesc = 'Display the number of characters changed after linting';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.displayChanged)
              .onChange(async (value) => {
                this.plugin.settings.displayChanged = value;
                await this.plugin.saveSettings();
              });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = 'Folders to ignore';
    settingDesc = 'Folders to ignore when linting all files or linting on save. Enter folder paths separated by newlines';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addTextArea((textArea) => {
          textArea
              .setValue(this.plugin.settings.foldersToIgnore.join('\n'))
              .onChange(async (value) => {
                this.plugin.settings.foldersToIgnore = value.split('\n');
                await this.plugin.saveSettings();
              });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    const sysLocale = navigator.language?.toLowerCase();

    tempDiv = this.contentEl.createDiv();
    settingName = 'Override locale';
    settingDesc = 'Set this if you want to use a locale different from the default';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          dropdown.addOption('system-default', `Same as system (${sysLocale})`);
          moment.locales().forEach((locale) => {
            dropdown.addOption(locale, locale);
          });
          dropdown.setValue(this.plugin.settings.linterLocale);
          dropdown.onChange(async (value) => {
            this.plugin.settings.linterLocale = value;
            await this.plugin.setOrUpdateMomentInstance();
            await this.plugin.saveSettings();
          });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    const yamlAliasRecords = [
      // as types is needed to allow for the proper types as options otherwise it assumes it has to be the specific enum value
      NormalArrayFormats.MultiLine as NormalArrayFormats | SpecialArrayFormats,
      NormalArrayFormats.SingleLine,
      SpecialArrayFormats.SingleStringCommaDelimited,
      SpecialArrayFormats.SingleStringToSingleLine,
      SpecialArrayFormats.SingleStringToMultiLine,
    ];

    tempDiv = this.contentEl.createDiv();
    settingName = 'YAML aliases section style';
    settingDesc = 'The style of the YAML aliases section';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          yamlAliasRecords.forEach((aliasRecord) => {
            dropdown.addOption(aliasRecord, aliasRecord);
          });
          dropdown.setValue(this.plugin.settings.commonStyles.aliasArrayStyle);
          dropdown.onChange(async (value) => {
            this.plugin.settings.commonStyles.aliasArrayStyle = value as NormalArrayFormats | SpecialArrayFormats;
            await this.plugin.saveSettings();
          });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    const yamlTagRecords = [
      NormalArrayFormats.MultiLine as TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats,
      NormalArrayFormats.SingleLine,
      SpecialArrayFormats.SingleStringToSingleLine,
      SpecialArrayFormats.SingleStringToMultiLine,
      TagSpecificArrayFormats.SingleLineSpaceDelimited,
      TagSpecificArrayFormats.SingleStringSpaceDelimited,
      SpecialArrayFormats.SingleStringCommaDelimited,
    ];

    tempDiv = this.contentEl.createDiv();
    settingName = 'YAML tags section style';
    settingDesc = 'The style of the YAML tags section';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          yamlTagRecords.forEach((tagRecord) => {
            dropdown.addOption(tagRecord, tagRecord);
          });
          dropdown.setValue(this.plugin.settings.commonStyles.tagArrayStyle);
          dropdown.onChange(async (value) => {
            this.plugin.settings.commonStyles.tagArrayStyle = value as TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats;
            await this.plugin.saveSettings();
          });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    const escapeCharRecords = ['"', '\''];

    tempDiv = this.contentEl.createDiv();
    settingName = 'Default Escape Character';
    settingDesc = 'The default character to use to escape YAML values when a single quote and double quote are not present.';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          escapeCharRecords.forEach((escapeChar) => {
            dropdown.addOption(escapeChar, escapeChar);
          });
          dropdown.setValue(this.plugin.settings.commonStyles.escapeCharacter);
          dropdown.onChange(async (value) => {
            this.plugin.settings.commonStyles.escapeCharacter = value;
            await this.plugin.saveSettings();
          });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = 'Remove Unnecessary Escape Characters when in Multi-Line Array Format';
    settingDesc = 'Escape characters for multi-line YAML arrays don\'t need the same escaping as single-line arrays, so when in multi-line format remove extra escapes that are not necessary';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.commonStyles.removeUnnecessaryEscapeCharsForMultiLineArrays)
              .onChange(async (value) => {
                this.plugin.settings.commonStyles.removeUnnecessaryEscapeCharsForMultiLineArrays = value;
                await this.plugin.saveSettings();
              });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = 'Number of Dollar Signs to Indicate Math Block';
    settingDesc = 'The amount of dollar signs to consider the math content to be a math block instead of inline math';
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addText((textbox) => {
          textbox
              .setValue(this.plugin.settings.commonStyles.minimumNumberOfDollarSignsToBeAMathBlock.toString())
              .onChange(async (value) => {
                let parsedInt = parseInt(value);
                if (isNaN(parsedInt)) {
                  parsedInt = 2;
                }

                this.plugin.settings.commonStyles.minimumNumberOfDollarSignsToBeAMathBlock = parsedInt;
                await this.plugin.saveSettings();
              });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);
  }
}
