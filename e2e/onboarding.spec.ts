import { expect, test } from '@playwright/test';

/* Flow 1: register → onboarding (6 steps) → dashboard → check in a habit →
   streak/XP update. */
test('register, complete onboarding, check in a habit, see XP/streak update', async ({ page }) => {
  const email = `e2e_${Date.now()}@example.com`;

  await page.goto('/register');
  await page.fill('#display_name', 'E2E Tester');
  await page.fill('#email', email);
  await page.fill('#password', 'supersecret123');
  await page.click('button[type=submit]');

  // Lands on onboarding.
  await page.waitForURL('**/onboarding');

  // Step 1 — Focus: pick Fitness + Learning.
  await page.getByRole('button', { name: /Fitness/ }).first().click();
  await page.getByRole('button', { name: /Learning/ }).first().click();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 2 — Habits: pick the first two suggested.
  const habitCards = page.locator('button', { hasText: 'XP' });
  await habitCards.nth(0).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 3 — Commitment: defaults are fine.
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 4 — Identity: default selected.
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 5 — Pact: agree, then make the pact.
  await page.getByRole('checkbox', { name: 'I make the pact' }).click();
  await page.getByRole('button', { name: 'Make the pact', exact: true }).click();

  // Step 6 — Done.
  await expect(page.getByRole('heading', { name: /You're in/ })).toBeVisible({ timeout: 10_000 });
  await page.getByRole('button', { name: 'Enter GRIT' }).click();

  // Dashboard.
  await page.waitForURL((url) => url.pathname === '/');
  const firstCheckbox = page.getByRole('checkbox').first();
  await expect(firstCheckbox).toBeVisible();
  await expect(firstCheckbox).toHaveAttribute('aria-checked', 'false');

  await firstCheckbox.click();
  await expect(firstCheckbox).toHaveAttribute('aria-checked', 'true');

  // Streak pill should show at least a 1-day streak after the check-in.
  await expect(page.getByTitle('Current streak')).toContainText('1d', { timeout: 10_000 });
});
