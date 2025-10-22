import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should allow user to sign up and complete onboarding", async ({ page }) => {
    await page.goto("/signup");

    // Fill signup form
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.fill('input[name="confirmPassword"]', "password123");
    await page.check('input[name="termsAccepted"]');
    
    await page.click('button[type="submit"]');

    // Should redirect to onboarding
    await expect(page).toHaveURL("/onboarding");
    await expect(page.locator("h1")).toContainText("Welcome to Fitness League");

    // Complete onboarding step 1 - Goal selection
    await page.click('text="Build Strength"');
    await page.click('button:has-text("Next")');

    // Complete onboarding step 2 - Experience level
    await page.click('text="Beginner"');
    await page.click('button:has-text("Next")');

    // Complete onboarding step 3 - Biometrics
    await page.fill('input[name="biometrics.age"]', "25");
    await page.selectOption('select[name="biometrics.gender"]', "male");
    await page.fill('input[name="biometrics.height"]', "175");
    await page.fill('input[name="biometrics.weight"]', "70");
    await page.click('button:has-text("Next")');

    // Complete onboarding step 4 - Preferences
    await page.fill('input[name="workoutPreferences.preferredDuration"]', "30");
    await page.fill('input[name="workoutPreferences.weeklyFrequency"]', "3");
    await page.check('input[value="dumbbells"]');
    await page.click('input[value="evening"]');
    await page.click('button:has-text("Next")');

    // Complete onboarding
    await page.click('button:has-text("Complete Setup")');

    // Should redirect to dashboard
    await expect(page).toHaveURL("/");
    await expect(page.locator("h1")).toContainText("Welcome back");
  });

  test("should allow user to login with existing account", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[type="email"]', "demo@fitnessteam.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL("/");
    await expect(page.locator("h1")).toContainText("Welcome back");
  });

  test("should show validation errors for invalid input", async ({ page }) => {
    await page.goto("/login");

    await page.click('button[type="submit"]');

    await expect(page.locator("text=Invalid email address")).toBeVisible();
    await expect(page.locator("text=Password must be at least 6 characters")).toBeVisible();
  });

  test("should allow user to logout", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('input[type="email"]', "demo@fitnessteam.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    // Should be on dashboard
    await expect(page).toHaveURL("/");

    // Click logout
    await page.click('button[aria-label="Logout"]');

    // Should redirect to login
    await expect(page).toHaveURL("/login");
  });
});