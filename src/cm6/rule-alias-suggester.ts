import {Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, TFile} from 'obsidian';
import LinterPlugin from '../main';
import {getDisabledRules, rules} from '../rules';
import {DISABLED_RULES_KEY, getYamlSectionValue} from '../utils/yaml';

const openingYAMLIndicator = /^---\n/gm;
const disableRulesKeyWithColon = `${DISABLED_RULES_KEY}:`;

export type ruleInfo = {
  displayName: string,
  name: string,
  alias: string
}

// based on tag suggester
export class RuleAliasSuggest extends EditorSuggest<ruleInfo> {
  ruleInfo: ruleInfo[];

  constructor(public plugin: LinterPlugin) {
    super(plugin.app);
    
    this.ruleInfo = [{displayName: 'All', name: 'all', alias: 'all'}];
    for (const rule of rules) {
      const name = rule.getName();
      this.ruleInfo.push({displayName: name, name: name.toLowerCase(), alias: rule.alias});
    }
  }
  inline = false;
  onTrigger(cursor: EditorPosition, editor: Editor, _: TFile): EditorSuggestTriggerInfo | null {
    console.log('triggered');
    const lineContents = editor.getLine(cursor.line).toLowerCase();
    const onFrontmatterDisabledRulesLine = lineContents.startsWith(disableRulesKeyWithColon) ||
    disabledRulesIsEndOfStartOfFileToCursor(editor.getRange({line: 0, ch: 0}, cursor));

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
    return getSuggestions(context.query, context.editor.getValue());
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


// functions exported for testability since mocking obsidian related classes takes a lot of work and can be tedious
export function disabledRulesIsEndOfStartOfFileToCursor(range: string): boolean {
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

export function getSuggestions(query: string, fileText: string): ruleInfo[] {
  let [disabledRules, allIncluded]= getDisabledRules(fileText);
  if (allIncluded) {
    return [];
  }

  query = query.toLowerCase();
  const suggestions = this.ruleInfo.filter((r: ruleInfo) =>
    (r.name.contains(query) || r.alias.contains(query) && !disabledRules.includes(r.alias)),
  );

  return suggestions;
}
