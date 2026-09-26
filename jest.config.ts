process.env.TZ = 'UTC';  

// jest.config.ts
import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  maxWorkers: 5,

  transformIgnorePatterns: [
    '"/node_modules/(?!unified-lint-rule)',
  ],
  testMatch: [
    '**/__tests__/**/*.ts',
    '!**/__tests__/common.ts',
    '!**/__integration__/*.ts?(x)',
    '!**/test-vault/**/*.ts?(x)',
  ],
};
export default config;
