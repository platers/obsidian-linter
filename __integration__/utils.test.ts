import {App, FileView} from 'obsidian';

export const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

export async function setWorkspaceItemMode(app: App, source: boolean) {
  const view: FileView = app.workspace.getActiveFileView();
  if (!view) {
    return;
  }

  const state = view.getState();
  if (Object.hasOwn(state, 'source')) {
    state.source = source;
    await view.setState(state, {history: false});
  }
}
