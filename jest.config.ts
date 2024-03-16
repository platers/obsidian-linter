process.env.TZ = 'UTC'; // eslint-disable-line no-undef

// jest.config.ts
import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  transformIgnorePatterns: [
    '"/node_modules/(?!unified-lint-rule)',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
    '!**/__tests__/common.ts',
    '!**/__integration__/*.[jt]s?(x)',
    '!**/test-vault/**/*.[jt]s?(x)',
  ],
};
export default config;
