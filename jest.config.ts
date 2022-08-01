process.env.TZ = 'UTC'; // eslint-disable-line no-undef

// jest.config.ts
import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  transformIgnorePatterns: [
    '"/node_modules/(?!unified-lint-rule)',
  ],
  moduleNameMapper: {
    'obsidian': '__mocks__/obsidian.ts',
  },
};
export default config;
