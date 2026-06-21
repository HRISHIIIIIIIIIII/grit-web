import { defineConfig, devices } from '@playwright/test';

/* E2E config. Assumes the GRIT frontend (5173) and backend (8010) are already
   running with the demo data seeded. Override via E2E_BASE_URL / E2E_API_URL. */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
