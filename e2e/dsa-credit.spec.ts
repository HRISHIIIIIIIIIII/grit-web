import { expect, test } from '@playwright/test';
import { apiPost, apiRegisterAndLogin } from './helpers';

/* Flow 2: a DSA-linked roadmap topic toggle credits the linked habit for today.
   Arrange the linked roadmap + habit via the API, then act + assert in the UI. */
test('toggling a topic on a DSA-linked roadmap credits the habit on the dashboard', async ({
  page,
}) => {
  const user = await apiRegisterAndLogin('DSA Tester');

  // Import a DSA-linked roadmap.
  const roadmap = await apiPost(user.token, '/roadmaps/import', {
    markdown: '# DSA\n\n## Phase 1: Arrays (Week 1)\n- Two pointers\n- Sliding window',
    is_dsa_linked: true,
  });
  // Create the DSA habit linked to that roadmap.
  await apiPost(user.token, '/habits', {
    name: 'Solve a DSA topic',
    category: 'Learning',
    xp_value: 25,
    linked_roadmap_id: roadmap.id,
  });
  // Mark onboarding complete so the app doesn't redirect to /onboarding.
  await apiPost(user.token, '/onboarding', {
    focus_areas: ['Learning'],
    habits: [],
    daily_target: 3,
    reminder_slot: 'morning',
    intensity: 'hard',
    identity_word: 'Focused',
    pact_accepted: true,
  });

  // Log in via the UI by seeding the refresh token the way the app does.
  await page.goto('/login');
  await page.fill('#email', user.email);
  await page.fill('#password', user.password);
  await page.click('button[type=submit]');
  await page.waitForURL((url) => url.pathname === '/');

  // Go to the roadmap detail and toggle the first topic.
  await page.goto(`/roadmaps/${roadmap.id}`);
  const firstTopic = page.getByRole('checkbox').first();
  await expect(firstTopic).toBeVisible();
  await firstTopic.click();

  // The DSA credit toast appears.
  await expect(page.getByText(/DSA habit credited/)).toBeVisible({ timeout: 10_000 });

  // On the dashboard, the DSA habit is now checked in today.
  await page.goto('/');
  const dsaRow = page.locator('text=Solve a DSA topic').first();
  await expect(dsaRow).toBeVisible();
  // Its row checkbox should be checked.
  const dsaCheckbox = page
    .locator('div', { has: page.getByText('Solve a DSA topic') })
    .getByRole('checkbox')
    .last();
  await expect(dsaCheckbox).toHaveAttribute('aria-checked', 'true', { timeout: 10_000 });
});
