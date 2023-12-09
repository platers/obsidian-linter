import {App, FileView} from 'obsidian';

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
