import { test, expect } from '@playwright/test';

test('has the proper title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/^Sarasi Institute$/);
});

test('has the correct heading', async ({ page }) => {
    await page.goto('/');

    await expect(
        page.getByRole('heading', { name: /.*Sarasi Institute.*/ })
    ).toBeVisible();
});
