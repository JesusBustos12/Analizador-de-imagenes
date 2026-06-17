import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to login and show errors on empty submit', async ({ page }) => {
    // Navigate to root, should redirect to login
    await page.goto('/');
    await expect(page).toHaveURL(/.*\/login/);

    // Try submitting empty form
    await page.click('button:has-text("Autenticar")');

    // Wait for the zod error to show up in the UI
    await expect(page.locator('text=Credenciales inválidas')).toBeVisible({ timeout: 5000 });
  });

  test('should allow user to toggle between login and register', async ({ page }) => {
    await page.goto('/login');
    
    // Click register link
    await page.click('text=Solicitar Acceso');
    await expect(page).toHaveURL(/.*\/register/);

    // Click login link
    await page.click('text=Iniciar Sesión');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
