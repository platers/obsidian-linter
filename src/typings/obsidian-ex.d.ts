import {Command} from 'obsidian';

export type ObsidianCommandInterface = {
  executeCommandById(id: string): void;
  commands: {
    'editor:save-file': {
      callback(): void;
    };
  };
  listCommands(): Command[];
};

// allows for the removal of the any cast by defining some extra properties for Typescript so it knows these properties exist
declare module 'obsidian' {
  // eslint-disable-next-line no-unused-vars
  interface App {
    commands: ObsidianCommandInterface;
  }
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    CodeMirrorAdapter: {
      commands: {
        save(): void;
      }
    };
  }
}
