process.env.TZ = 'UTC';

// jest.config.ts
import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  transformIgnorePatterns: [
    '"/node_modules/(?!unified-lint-rule)',
  ],
};
export default config;
