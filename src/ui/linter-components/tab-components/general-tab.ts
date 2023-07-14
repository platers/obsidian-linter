import LinterPlugin from 'src/main';
import {Tab} from './tab';
import {Setting} from 'obsidian';
import {moment} from 'obsidian';
import {parseTextToHTMLWithoutOuterParagraph} from 'src/ui/helpers';
import {getTextInLanguage, LanguageStringKey} from 'src/lang/helpers';
import {NormalArrayFormats, QuoteCharacter, SpecialArrayFormats, TagSpecificArrayFormats} from 'src/utils/yaml';

export class GeneralTab extends Tab {
  constructor(navEl: HTMLElement, settingsEl: HTMLElement, isMobile: boolean, plugin: LinterPlugin) {
    super(navEl, settingsEl, 'General', isMobile, plugin);
    this.display();
  }

  display(): void {
    let tempDiv = this.contentEl.createDiv();
    let settingName = getTextInLanguage('tabs.general.lint-on-save.name');
    let settingDesc = getTextInLanguage('tabs.general.lint-on-save.description');
    let setting = new Setting(tempDiv)
        .setName(settingName)
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.lintOnSave)
              .onChange(async (value) => {
                this.plugin.settings.lintOnSave = value;
                await this.plugin.saveSettings();
              });
        });

    parseTextToHTMLWithoutOuterParagraph(settingDesc, setting.descEl, this.plugin.settingsTab.component);

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = getTextInLanguage('tabs.general.display-message.name');
    settingDesc = getTextInLanguage('tabs.general.display-message.description');
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
    settingName = getTextInLanguage('tabs.general.lint-on-file-change.name');
    settingDesc = getTextInLanguage('tabs.general.lint-on-file-change.description');
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.lintOnFileChange)
              .onChange(async (value) => {
                this.plugin.settings.lintOnFileChange = value;
                await this.plugin.saveSettings();
              });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = getTextInLanguage('tabs.general.display-lint-on-file-change-message.name');
    settingDesc = getTextInLanguage('tabs.general.display-lint-on-file-change-message.description');
    setting = new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addToggle((toggle) => {
          toggle
              .setValue(this.plugin.settings.displayLintOnFileChangeNotice)
              .onChange(async (value) => {
                this.plugin.settings.displayLintOnFileChangeNotice = value;
                await this.plugin.saveSettings();
              });
        });

    parseTextToHTMLWithoutOuterParagraph(settingDesc, setting.descEl, this.plugin.settingsTab.component);

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = getTextInLanguage('tabs.general.folders-to-ignore.name');
    settingDesc = getTextInLanguage('tabs.general.folders-to-ignore.description');
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
    settingName = getTextInLanguage('tabs.general.override-locale.name');
    settingDesc = getTextInLanguage('tabs.general.override-locale.description');
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          dropdown.addOption('system-default', getTextInLanguage('tabs.general.same-as-system-locale').replace('{SYS_LOCALE}', sysLocale));
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
    settingName = getTextInLanguage('tabs.general.yaml-aliases-section-style.name');
    settingDesc = getTextInLanguage('tabs.general.yaml-aliases-section-style.description');
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          yamlAliasRecords.forEach((aliasRecord) => {
            const key = ('enums.' + aliasRecord) as LanguageStringKey;
            dropdown.addOption(aliasRecord, getTextInLanguage(key));
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
    settingName = getTextInLanguage('tabs.general.yaml-tags-section-style.name');
    settingDesc = getTextInLanguage('tabs.general.yaml-tags-section-style.description');
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          yamlTagRecords.forEach((tagRecord) => {
            const key = ('enums.' + tagRecord) as LanguageStringKey;
            dropdown.addOption(tagRecord, getTextInLanguage(key));
          });
          dropdown.setValue(this.plugin.settings.commonStyles.tagArrayStyle);
          dropdown.onChange(async (value) => {
            this.plugin.settings.commonStyles.tagArrayStyle = value as TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats;
            await this.plugin.saveSettings();
          });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    const escapeCharRecords: QuoteCharacter[] = ['"', '\''];

    tempDiv = this.contentEl.createDiv();
    settingName = getTextInLanguage('tabs.general.default-escape-character.name');
    settingDesc = getTextInLanguage('tabs.general.default-escape-character.description');
    new Setting(tempDiv)
        .setName(settingName)
        .setDesc(settingDesc)
        .addDropdown((dropdown) => {
          escapeCharRecords.forEach((escapeChar) => {
            dropdown.addOption(escapeChar, escapeChar);
          });
          dropdown.setValue(this.plugin.settings.commonStyles.escapeCharacter);
          dropdown.onChange(async (value) => {
            this.plugin.settings.commonStyles.escapeCharacter = value as QuoteCharacter;
            await this.plugin.saveSettings();
          });
        });

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    tempDiv = this.contentEl.createDiv();
    settingName = getTextInLanguage('tabs.general.remove-unnecessary-escape-chars-in-multi-line-arrays.name');
    settingDesc = getTextInLanguage('tabs.general.remove-unnecessary-escape-chars-in-multi-line-arrays.description');
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
    settingName = getTextInLanguage('tabs.general.number-of-dollar-signs-to-indicate-math-block.name');
    settingDesc = getTextInLanguage('tabs.general.number-of-dollar-signs-to-indicate-math-block.description');
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
