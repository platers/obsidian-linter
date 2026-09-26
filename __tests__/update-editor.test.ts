import DiffMatchPatch from 'diff-match-patch';
import type {Editor} from 'obsidian';
import LinterPlugin from '../src/main';

jest.mock('obsidian', () => ({
  ...jest.requireActual<typeof import('../__mocks__/obsidian')>('../__mocks__/obsidian'),
  Plugin: class {},
  PluginSettingTab: class {},
  EditorSuggest: class {},
  ItemView: class {},
}));

function editorStub(docLength: number) {
  const dispatch = jest.fn();
  const readLength = jest.fn(() => docLength);
  const doc = {
    get length() {
      return readLength();
    },
  };
  const editor = {cm: {state: {doc}, dispatch}};
  return {editor: editor as unknown as Editor, dispatch, readLength};
}

describe('updateEditor', () => {
  it('dispatches one batch of original-offset changes when document lengths match', () => {
    const {editor, dispatch, readLength} = editorStub(6);
    const diffs = LinterPlugin.prototype['updateEditor']('abcdef', '!abXYef?', editor);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      changes: [
        {from: 0, insert: '!'},
        {from: 2, to: 4},
        {from: 4, insert: 'XY'},
        {from: 6, insert: '?'},
      ],
      filter: false,
    });
    expect(readLength).toHaveBeenCalledTimes(1);
    expect(diffs).toEqual(new DiffMatchPatch().diff_main('abcdef', '!abXYef?'));
  });

  it.each([3, 8])('replaces the whole document once when its length is %i rather than the diff input length', (docLength) => {
    const oldText = 'a\r\nb';
    const newText = 'A\r\nnew';
    const {editor, dispatch, readLength} = editorStub(docLength);
    const diffs = LinterPlugin.prototype['updateEditor'](oldText, newText, editor);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      changes: {from: 0, to: docLength, insert: newText},
      filter: false,
    });
    expect(readLength).toHaveBeenCalledTimes(1);
    expect(diffs).toEqual(new DiffMatchPatch().diff_main(oldText, newText));
  });

  it('does not dispatch for identical text when the document lengths match', () => {
    const {editor, dispatch, readLength} = editorStub(4);
    const diffs = LinterPlugin.prototype['updateEditor']('same', 'same', editor);

    expect(dispatch).not.toHaveBeenCalled();
    expect(readLength).toHaveBeenCalledTimes(1);
    expect(diffs).toEqual([[DiffMatchPatch.DIFF_EQUAL, 'same']]);
  });

  it('uses the fallback even when the diff is unchanged if the document lengths mismatch', () => {
    const {editor, dispatch, readLength} = editorStub(3);
    const diffs = LinterPlugin.prototype['updateEditor']('a\r\nb', 'a\r\nb', editor);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      changes: {from: 0, to: 3, insert: 'a\r\nb'},
      filter: false,
    });
    expect(readLength).toHaveBeenCalledTimes(1);
    expect(diffs).toEqual([[DiffMatchPatch.DIFF_EQUAL, 'a\r\nb']]);
  });
});
