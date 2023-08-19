import LinterPlugin from 'src/main';
import {Tab} from './tab';
import {Setting} from 'obsidian';
import {moment} from 'obsidian';
import {parseTextToHTMLWithoutOuterParagraph} from 'src/ui/helpers';
import {getTextInLanguage} from 'src/lang/helpers';
import {NormalArrayFormats, SpecialArrayFormats, TagSpecificArrayFormats} from 'src/utils/yaml';
import {DropdownRecordInfo, DropdownSetting} from 'src/ui/components/dropdown-setting';
import {NumberInputSetting} from 'src/ui/components/number-input-setting';
import {ToggleSetting} from 'src/ui/components/toggle-setting';

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

    // new ToggleSetting(tempDiv, settingName, settingDesc, 'lintOnSave', this.plugin);

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

    const localeValues = ['system-default'];
    const localeDescriptions = [getTextInLanguage('tabs.general.same-as-system-locale').replace('{SYS_LOCALE}', sysLocale)];
    for (const locale of moment.locales()) {
      localeValues.push(locale);
      localeDescriptions.push(locale);
    }

    const localeDropdownRecordInfo: DropdownRecordInfo = {
      isForEnum: false,
      values: localeValues,
      descriptions: localeDescriptions,
    };

    tempDiv = this.contentEl.createDiv();
    settingName = getTextInLanguage('tabs.general.override-locale.name');
    settingDesc = getTextInLanguage('tabs.general.override-locale.description');
    new DropdownSetting(tempDiv, settingName, settingDesc, 'linterLocale', this.plugin, localeDropdownRecordInfo);

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    const yamlAliasDropdownRecordInfo: DropdownRecordInfo = {
      isForEnum: true,
      values: [
        NormalArrayFormats.MultiLine,
        NormalArrayFormats.SingleLine,
        SpecialArrayFormats.SingleStringCommaDelimited,
        SpecialArrayFormats.SingleStringToSingleLine,
        SpecialArrayFormats.SingleStringToMultiLine,
      ],
      descriptions: [],
    };

    tempDiv = this.contentEl.createDiv();
    settingName = getTextInLanguage('tabs.general.yaml-aliases-section-style.name');
    settingDesc = getTextInLanguage('tabs.general.yaml-aliases-section-style.description');
    new DropdownSetting(tempDiv, settingName, settingDesc, 'commonStyles.aliasArrayStyle', this.plugin, yamlAliasDropdownRecordInfo);

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    const yamlTagDropdownRecordInfo: DropdownRecordInfo = {
      isForEnum: true,
      values: [
        NormalArrayFormats.MultiLine,
        NormalArrayFormats.SingleLine,
        SpecialArrayFormats.SingleStringToSingleLine,
        SpecialArrayFormats.SingleStringToMultiLine,
        TagSpecificArrayFormats.SingleLineSpaceDelimited,
        TagSpecificArrayFormats.SingleStringSpaceDelimited,
        SpecialArrayFormats.SingleStringCommaDelimited,
      ],
      descriptions: [],
    };

    tempDiv = this.contentEl.createDiv();
    settingName = getTextInLanguage('tabs.general.yaml-tags-section-style.name');
    settingDesc = getTextInLanguage('tabs.general.yaml-tags-section-style.description');
    new DropdownSetting(tempDiv, settingName, settingDesc, 'commonStyles.tagArrayStyle', this.plugin, yamlTagDropdownRecordInfo);

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);

    const escapeCharDropdownRecordInfo: DropdownRecordInfo = {
      isForEnum: true,
      values: ['"', '\''],
      descriptions: [],
    };

    tempDiv = this.contentEl.createDiv();
    settingName = getTextInLanguage('tabs.general.default-escape-character.name');
    settingDesc = getTextInLanguage('tabs.general.default-escape-character.description');
    new DropdownSetting(tempDiv, settingName, settingDesc, 'commonStyles.escapeCharacter', this.plugin, escapeCharDropdownRecordInfo);

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
    new NumberInputSetting(tempDiv, settingName, settingDesc, 'commonStyles.minimumNumberOfDollarSignsToBeAMathBlock', this.plugin);

    this.addSettingSearchInfo(tempDiv, settingName, settingDesc);
  }
}
