import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import { baseURL } from './playwright.config';

// Visual review (tasks.md 17.1): screenshots of every screen at phone and desktop width, against the
// running stack. They are evidence for a human or agent to look at, not an assertion suite, and they
// never run as part of `npm run e2e`. `SCREENS_DIR` overrides the output folder.
export const screensDir =
  process.env['SCREENS_DIR'] ??
  path.join(
    __dirname,
    '..',
    'openspec',
    'changes',
    'add-mvp1-core-tracking',
    'evidence',
    'screens',
  );

export default defineConfig({
  testDir: './e2e/screens',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: { baseURL },
  projects: [
    { name: 'phone', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'wide',
      use: { ...devices['Desktop Chrome'], viewport: { width: 2048, height: 1152 } },
    },
  ],
});
