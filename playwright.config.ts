import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {

  testDir: './tests',

  timeout: 30 * 1000,

  expect: {

    timeout: 5000

  },

  reporter: 'html',

  use: {

    actionTimeout: 0,

    trace: 'on-first-retry',

  },

};

export default config;