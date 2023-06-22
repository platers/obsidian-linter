import {Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, TFile} from 'obsidian';
import LinterPlugin from '../main';
import {rules} from '../rules';
import {DISABLED_RULES_KEY, getYamlSectionValue} from '../utils/yaml';
// import {disabledRulesKeyRegex} from '../utils/regex';

const openingYAMLIndicator = /^---\n/gm;
const disableRulesKeyWithColon = `${DISABLED_RULES_KEY}:`;

type ruleInfo = {
  displayName: string,
  name: string,
  alias: string
}

// based on tag suggester
export class RuleAliasSuggest extends EditorSuggest<ruleInfo> {
  disabledRules: string[];
  ruleInfo: ruleInfo[];
  ruleNameToAlias: Map<string, string>;

  constructor(public plugin: LinterPlugin) {
    super(plugin.app);

    this.ruleNameToAlias = new Map<string, string>();
    this.ruleInfo = [{displayName: 'All', name: 'all', alias: 'all'}];
    for (const rule of rules) {
      const name = rule.getName();
      this.ruleInfo.push({displayName: name, name: name.toLowerCase(), alias: rule.alias});
    }
  }

  getDisabledRuleOptions(): ruleInfo[] {
    // const disabledRules = getListOfDisabledRulesFromFrontmatter();
    return this.ruleInfo;
  }
  inRange(range: string) {
    if (!range || !range.length) {
      return false;
    }

    console.log(range);
    if (range.match(openingYAMLIndicator)?.length != 1) {
      return false;
    }

    const disabledRules = getYamlSectionValue(range + '\n', DISABLED_RULES_KEY)?.trimEnd();
    if (disabledRules === null) {
      return false;
    }

    return range.trimEnd().endsWith(disabledRules);
  }
  inline = false;
  onTrigger(cursor: EditorPosition, editor: Editor, _: TFile): EditorSuggestTriggerInfo | null {
    console.log('triggered');
    const lineContents = editor.getLine(cursor.line).toLowerCase();
    const onFrontmatterDisabledRulesLine = lineContents.startsWith(disableRulesKeyWithColon) ||
    this.inRange(editor.getRange({line: 0, ch: 0}, cursor));

    if (onFrontmatterDisabledRulesLine) {
      this.inline = lineContents.startsWith(disableRulesKeyWithColon);
      const sub = editor.getLine(cursor.line).substring(0, cursor.ch);
      const match = sub.match(/(\S+)$/)?.first().replaceAll('[', '').replaceAll(']', '');
      if (match) {
        // this.disabledRules = this.getDisabledRuleOptions();
        const matchData = {
          end: cursor,
          start: {
            ch: sub.lastIndexOf(match),
            line: cursor.line,
          },
          query: match,
        };
        return matchData;
      }
    }
    return null;
  }

  getSuggestions(context: EditorSuggestContext): ruleInfo[] {
    console.log('retrieve suggestions', context.query);
    // TODO: get the value from the YAML as it is now...
    const query = context.query.toLowerCase();
    const suggestions = this.ruleInfo.filter((p) =>
      p.name.contains(query) || p.alias.contains(query),
    );

    return suggestions;
  }

  renderSuggestion(suggestion: ruleInfo, el: HTMLElement): void {
    el.addClass('mod-complex');

    const outer = el.createDiv({cls: 'suggestion-content'});
    outer.createDiv({cls: 'suggestion-title'}).setText(`${suggestion.displayName}`);
    outer.createDiv({cls: 'suggestion-note'}).setText(`${suggestion.alias}`);
  }

  selectSuggestion(suggestion: ruleInfo): void {
    if (this.context) {
      let suggestedValue = suggestion.alias;
      if (this.inline) {
        suggestedValue = `${suggestedValue}`;
      } else {
        suggestedValue = `${suggestedValue}\n  -`;
      }

      (this.context.editor as Editor).replaceRange(
          `${suggestedValue} `,
          this.context.start,
          this.context.end,
      );
    }
  }
}
