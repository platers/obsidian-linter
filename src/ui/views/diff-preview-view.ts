import {ItemView, WorkspaceLeaf} from 'obsidian';
import DiffMatchPatch from 'diff-match-patch';
import {getTextInLanguage} from '../../lang/helpers';

export const diffPreviewViewType = 'linter-diff-preview';

const largeDiffCharacterThreshold = 300000;
const diffContextLineCount = 3;

type DiffSummary = {
  charsAdded: number;
  charsRemoved: number;
  linesAdded: number;
  linesRemoved: number;
};

type DiffLine = {
  operation: number;
  text: string;
};

type DiffPreviewState = {
  title: string;
  oldText: string;
  newText: string;
  applyAction: () => void;
};

export class DiffPreviewView extends ItemView {
  private previewState: DiffPreviewState | null = null;
  private bodyEl?: HTMLDivElement;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.navigation = false;
    this.icon = 'git-compare';
  }

  getViewType(): string {
    return diffPreviewViewType;
  }

  getDisplayText(): string {
    return getTextInLanguage('notice-text.lint-preview-title');
  }

  async onOpen() {
    this.contentEl.empty();
    this.contentEl.addClass('linter-diff-preview-view');
    this.render();
  }

  setPreview(previewState: DiffPreviewState) {
    this.previewState = previewState;
    this.render();
  }

  private render() {
    if (!this.contentEl) {
      return;
    }

    this.contentEl.empty();
    this.contentEl.addClass('linter-diff-preview-view');

    if (!this.previewState) {
      this.contentEl.createDiv({
        cls: 'linter-diff-preview-empty',
        text: getTextInLanguage('notice-text.no-preview-changes'),
      });
      return;
    }

    const headerEl = this.contentEl.createDiv('linter-diff-preview-header');
    const titleGroupEl = headerEl.createDiv('linter-diff-preview-title-group');
    titleGroupEl.createEl('h3', {text: this.previewState.title});

    const hasChanges = this.previewState.oldText !== this.previewState.newText;
    if (!hasChanges) {
      titleGroupEl.createDiv({
        cls: 'linter-diff-summary',
        text: getTextInLanguage('notice-text.no-preview-changes'),
      });
    }

    const actionsEl = headerEl.createDiv('linter-diff-preview-actions');
    actionsEl.createEl('button', {text: getTextInLanguage('close-button-text')})
        .addEventListener('click', () => {
          this.previewState = null;
          this.render();
        });

    if (hasChanges) {
      const applyButton = actionsEl.createEl('button', {
        attr: {type: 'submit'},
        cls: 'mod-cta',
        text: getTextInLanguage('notice-text.apply-lint-preview'),
      });
      applyButton.addEventListener('click', () => this.applyPreview());
    }

    this.bodyEl = this.contentEl.createDiv('linter-diff-preview-body');
    if (!hasChanges) {
      return;
    }

    if (this.previewState.oldText.length + this.previewState.newText.length > largeDiffCharacterThreshold) {
      this.bodyEl.createEl('p', {text: getTextInLanguage('notice-text.diff-large-file-warning')});
      this.bodyEl.createEl('button', {text: getTextInLanguage('notice-text.show-diff')})
          .addEventListener('click', () => this.renderDiff());
      return;
    }

    this.renderDiff();
  }

  private applyPreview() {
    if (!this.previewState) {
      return;
    }

    const previewState = this.previewState;
    previewState.applyAction();
    this.previewState = {
      ...previewState,
      oldText: previewState.newText,
    };
    this.render();
  }

  private renderDiff() {
    if (!this.previewState || !this.bodyEl) {
      return;
    }

    this.bodyEl.empty();
    const diffs = this.createLineDiff(this.previewState.oldText, this.previewState.newText);
    const summary = this.createSummary(diffs);
    this.bodyEl.createEl('div', {
      text: getTextInLanguage('notice-text.diff-summary')
          .replace('{LINES_ADDED}', summary.linesAdded.toString())
          .replace('{LINES_REMOVED}', summary.linesRemoved.toString())
          .replace('{CHARS_ADDED}', summary.charsAdded.toString())
          .replace('{CHARS_REMOVED}', summary.charsRemoved.toString()),
      cls: 'linter-diff-summary',
    });

    const diffEl = this.bodyEl.createDiv({cls: 'linter-diff'});
    this.renderDiffLines(diffEl, this.createVisibleDiffLines(this.expandDiffs(diffs)));
  }

  private createLineDiff(oldText: string, newText: string): DiffMatchPatch.Diff[] {
    const diffMatchPatch = new DiffMatchPatch.diff_match_patch(); // eslint-disable-line new-cap
    const lineMode = diffMatchPatch.diff_linesToChars_(oldText, newText);
    const diffs = diffMatchPatch.diff_main(lineMode.chars1, lineMode.chars2, false);
    diffMatchPatch.diff_charsToLines_(diffs, lineMode.lineArray);
    return diffs;
  }

  private createSummary(diffs: DiffMatchPatch.Diff[]): DiffSummary {
    return diffs.reduce((summary, [operation, text]) => {
      if (operation === DiffMatchPatch.DIFF_INSERT) {
        summary.charsAdded += text.length;
        summary.linesAdded += this.countLines(text);
      } else if (operation === DiffMatchPatch.DIFF_DELETE) {
        summary.charsRemoved += text.length;
        summary.linesRemoved += this.countLines(text);
      }

      return summary;
    }, {charsAdded: 0, charsRemoved: 0, linesAdded: 0, linesRemoved: 0});
  }

  private countLines(text: string): number {
    if (text === '') {
      return 0;
    }

    const lines = text.split('\n');
    if (lines[lines.length - 1] === '') {
      lines.pop();
    }

    return lines.length;
  }

  private expandDiffs(diffs: DiffMatchPatch.Diff[]): DiffLine[] {
    const lines: DiffLine[] = [];

    for (const [operation, text] of diffs) {
      const splitLines = text.split('\n');
      if (splitLines[splitLines.length - 1] === '') {
        splitLines.pop();
      }

      for (const line of splitLines) {
        lines.push({
          operation,
          text: line,
        });
      }
    }

    return lines;
  }

  private createVisibleDiffLines(lines: DiffLine[]): Array<DiffLine | {skipped: number}> {
    const visibleLines = new Array(lines.length).fill(false);

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].operation === DiffMatchPatch.DIFF_EQUAL) {
        continue;
      }

      const start = Math.max(0, i - diffContextLineCount);
      const end = Math.min(lines.length - 1, i + diffContextLineCount);
      for (let j = start; j <= end; j++) {
        visibleLines[j] = true;
      }
    }

    const result: Array<DiffLine | {skipped: number}> = [];
    let skipped = 0;
    for (let i = 0; i < lines.length; i++) {
      if (visibleLines[i]) {
        if (skipped > 0) {
          result.push({skipped});
          skipped = 0;
        }

        result.push(lines[i]);
      } else {
        skipped++;
      }
    }

    if (skipped > 0) {
      result.push({skipped});
    }

    return result;
  }

  private renderDiffLines(diffEl: HTMLDivElement, lines: Array<DiffLine | {skipped: number}>) {
    for (const line of lines) {
      if ('skipped' in line) {
        diffEl.createDiv({
          cls: 'linter-diff-skip',
          text: getTextInLanguage('notice-text.diff-skipped-lines').replace('{COUNT}', line.skipped.toString()),
        });
        continue;
      }

      const lineEl = diffEl.createDiv({cls: this.diffClass(line.operation)});
      lineEl.createSpan({cls: 'linter-diff-marker', text: this.diffPrefix(line.operation)});
      lineEl.createSpan({cls: 'linter-diff-text', text: line.text});
    }
  }

  private diffClass(operation: number): string {
    if (operation === DiffMatchPatch.DIFF_INSERT) {
      return 'linter-diff-line linter-diff-added';
    } else if (operation === DiffMatchPatch.DIFF_DELETE) {
      return 'linter-diff-line linter-diff-removed';
    }

    return 'linter-diff-line linter-diff-context';
  }

  private diffPrefix(operation: number): string {
    if (operation === DiffMatchPatch.DIFF_INSERT) {
      return '+ ';
    } else if (operation === DiffMatchPatch.DIFF_DELETE) {
      return '- ';
    }

    return '  ';
  }
}
