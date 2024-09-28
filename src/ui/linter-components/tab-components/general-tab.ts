import LinterPlugin from 'src/main';
import {Tab} from './tab';
import {App} from 'obsidian';
import {moment} from 'obsidian';
import {getTextInLanguage} from 'src/lang/helpers';
import {NormalArrayFormats, SpecialArrayFormats, TagSpecificArrayFormats} from 'src/utils/yaml';
import {DropdownRecordInfo, DropdownSetting} from 'src/ui/components/dropdown-setting';
import {NumberInputSetting} from 'src/ui/components/number-input-setting';
import {ToggleSetting} from 'src/ui/components/toggle-setting';
import {FolderIgnoreOption} from '../folder-ignore-option';
import {FilesToIgnoreOption} from '../files-to-ignore-option';
import {AfterFileChangeLintTimes} from 'src/settings-data';

export class GeneralTab extends Tab {
  constructor(navEl: HTMLElement, settingsEl: HTMLElement, isMobile: boolean, plugin: LinterPlugin, private app: App) {
    super(navEl, settingsEl, 'General', isMobile, plugin);
    this.display();
  }

  display(): void {
    let tempDiv = this.contentEl.createDiv();
    this.addSettingSearchInfoForGeneralSettings(new ToggleSetting(tempDiv, 'tabs.general.lint-on-save.name', 'tabs.general.lint-on-save.description', 'lintOnSave', this.plugin));

    tempDiv = this.contentEl.createDiv();
    this.addSettingSearchInfoForGeneralSettings(new ToggleSetting(tempDiv, 'tabs.general.display-message.name', 'tabs.general.display-message.description', 'displayChanged', this.plugin));

    tempDiv = this.contentEl.createDiv();
    this.addSettingSearchInfoForGeneralSettings(new ToggleSetting(tempDiv, 'tabs.general.lint-on-file-change.name', 'tabs.general.lint-on-file-change.description', 'lintOnFileChange', this.plugin));

    tempDiv = this.contentEl.createDiv();
    this.addSettingSearchInfoForGeneralSettings(new ToggleSetting(tempDiv, 'tabs.general.display-lint-on-file-change-message.name', 'tabs.general.display-lint-on-file-change-message.description', 'displayLintOnFileChangeNotice', this.plugin));

    const yamlTimestampTimeOptions: DropdownRecordInfo = {
      isForEnum: true,
      values: [
        AfterFileChangeLintTimes.Never,
        AfterFileChangeLintTimes.After5Seconds,
        AfterFileChangeLintTimes.After10Seconds,
        AfterFileChangeLintTimes.After15Seconds,
        AfterFileChangeLintTimes.After30Seconds,
        AfterFileChangeLintTimes.After1Minute,
      ],
      descriptions: [],
    };

    tempDiv = this.contentEl.createDiv();
    this.addSettingSearchInfoForGeneralSettings(new DropdownSetting(tempDiv, 'tabs.general.timestamp-update-on-file-contents-updated.name', 'tabs.general.timestamp-update-on-file-contents-updated.description', 'lintOnFileContentChangeDelay', this.plugin, yamlTimestampTimeOptions));

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
    this.addSettingSearchInfoForGeneralSettings(new DropdownSetting(tempDiv, 'tabs.general.override-locale.name', 'tabs.general.override-locale.description', 'linterLocale', this.plugin, localeDropdownRecordInfo, async () => {
      await this.plugin.setOrUpdateMomentInstance();
    }));

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
    this.addSettingSearchInfoForGeneralSettings(new DropdownSetting(tempDiv, 'tabs.general.yaml-aliases-section-style.name', 'tabs.general.yaml-aliases-section-style.description', 'commonStyles.aliasArrayStyle', this.plugin, yamlAliasDropdownRecordInfo));

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
    this.addSettingSearchInfoForGeneralSettings(new DropdownSetting(tempDiv, 'tabs.general.yaml-tags-section-style.name', 'tabs.general.yaml-tags-section-style.description', 'commonStyles.tagArrayStyle', this.plugin, yamlTagDropdownRecordInfo));

    const defaultEscapeChars = ['"', '\''];
    const escapeCharDropdownRecordInfo: DropdownRecordInfo = {
      isForEnum: false,
      values: defaultEscapeChars,
      descriptions: defaultEscapeChars,
    };

    tempDiv = this.contentEl.createDiv();
    this.addSettingSearchInfoForGeneralSettings(new DropdownSetting(tempDiv, 'tabs.general.default-escape-character.name', 'tabs.general.default-escape-character.description', 'commonStyles.escapeCharacter', this.plugin, escapeCharDropdownRecordInfo));

    tempDiv = this.contentEl.createDiv();
    this.addSettingSearchInfoForGeneralSettings(new ToggleSetting(tempDiv, 'tabs.general.remove-unnecessary-escape-chars-in-multi-line-arrays.name', 'tabs.general.remove-unnecessary-escape-chars-in-multi-line-arrays.description', 'commonStyles.removeUnnecessaryEscapeCharsForMultiLineArrays', this.plugin));

    tempDiv = this.contentEl.createDiv();
    this.addSettingSearchInfoForGeneralSettings(new NumberInputSetting(tempDiv, 'tabs.general.number-of-dollar-signs-to-indicate-math-block.name', 'tabs.general.number-of-dollar-signs-to-indicate-math-block.description', 'commonStyles.minimumNumberOfDollarSignsToBeAMathBlock', this.plugin));

    const folderIgnoreEl = this.contentEl.createDiv();
    const folderIgnore = new FolderIgnoreOption(folderIgnoreEl, this.plugin.settingsTab.component, this.plugin.settings.foldersToIgnore, this.app, () => {
      void this.plugin.saveSettings();
    });

    this.addSettingSearchInfo(folderIgnoreEl, folderIgnore.name, folderIgnore.description.replaceAll('\n', ' '));

    const filesToIgnoreEl = this.contentEl.createDiv();
    const filesToIgnore = new FilesToIgnoreOption(filesToIgnoreEl, this.plugin.settingsTab.component, this.plugin.settings.filesToIgnore, this.app, () => {
      void this.plugin.saveSettings();
    });

    this.addSettingSearchInfo(filesToIgnoreEl, filesToIgnore.name, filesToIgnore.description.replaceAll('\n', ' '));
  }
}
