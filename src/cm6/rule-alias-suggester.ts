import {Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, TFile} from 'obsidian';
import LinterPlugin from '../main';
import {getDisabledRules, rules} from '../rules';
import {DISABLED_RULES_KEY, getYamlSectionValue} from '../utils/yaml';
import {getTextInLanguage} from '../lang/helpers';

const openingYAMLIndicator = /^---\n/gm;
const disableRulesKeyWithColon = `${DISABLED_RULES_KEY}:`;

export type ruleInfo = {
  displayName: string,
  name: string,
  alias: string
}

// based on tag suggester, see https://github.com/jmilldotdev/obsidian-frontmatter-tag-suggest/blob/d80bcfb64d96d7fcb908deb5f4b0c9c8041c267c/main.ts
export class RuleAliasSuggest extends EditorSuggest<ruleInfo> {
  ruleInfo: ruleInfo[];

  constructor(public plugin: LinterPlugin) {
    super(plugin.app);

    const allName = getTextInLanguage('all-rules-option');
    this.ruleInfo = [{displayName: allName, name: allName.toLowerCase(), alias: 'all'}];
    for (const rule of rules) {
      const name = rule.getName();
      this.ruleInfo.push({displayName: name, name: name.toLowerCase(), alias: rule.alias});
    }
  }
  inline = false;
  onTrigger(cursor: EditorPosition, editor: Editor, _: TFile): EditorSuggestTriggerInfo | null {
    const lineContents = editor.getLine(cursor.line).toLowerCase();
    const onFrontmatterDisabledRulesLine = lineContents.startsWith(disableRulesKeyWithColon) ||
    this.disabledRulesIsEndOfStartOfFileToCursor(editor.getRange({line: 0, ch: 0}, cursor));

    if (onFrontmatterDisabledRulesLine) {
      this.inline = lineContents.startsWith(disableRulesKeyWithColon);
      const sub = editor.getLine(cursor.line).substring(0, cursor.ch);
      const match = sub.match(/(\S+)$/)?.first().replaceAll('[', '').replaceAll(']', '');
      if (match) {
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
    const [disabledRules, allIncluded]= getDisabledRules(context.editor.getValue());
    if (allIncluded) {
      return [];
    }

    const query = context.query.toLowerCase();
    const suggestions = this.ruleInfo.filter((r: ruleInfo) =>
      (r.name.contains(query) || r.alias.contains(query)) && !disabledRules.includes(r.alias),
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
        suggestedValue = `${suggestedValue},`;
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

  disabledRulesIsEndOfStartOfFileToCursor(range: string): boolean {
    if (!range || !range.length) {
      return false;
    }

    if (range.match(openingYAMLIndicator)?.length != 1) {
      return false;
    }

    const disabledRules = getYamlSectionValue(range + '\n', DISABLED_RULES_KEY)?.trimEnd();
    if (disabledRules === null) {
      return false;
    }

    return range.trimEnd().endsWith(disabledRules);
  }
}
