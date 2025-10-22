import { test, expect } from "@playwright/test";

test.describe("Profile Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.fill('input[type="email"]', "demo@fitnessteam.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/");
  });

  test("should allow user to view and edit profile", async ({ page }) => {
    await page.goto("/profile");

    // Should show profile form
    await expect(page.locator("h1")).toContainText("Profile");
    await expect(page.locator('input[name="displayName"]')).toBeVisible();
    await expect(page.locator('input[name="biometrics.age"]')).toBeVisible();

    // Update profile information
    await page.fill('input[name="displayName"]', "Updated Name");
    await page.fill('input[name="biometrics.age"]', "26");
    await page.fill('input[name="biometrics.height"]', "180");
    await page.fill('input[name="biometrics.weight"]', "75");

    await page.click('button:has-text("Save Changes")');

    // Should show success message
    await expect(page.locator("text=Profile updated successfully")).toBeVisible();
  });

  test("should allow user to upload avatar", async ({ page }) => {
    await page.goto("/profile");

    // Create a test image file
    const testImage = await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#77e3f8";
        ctx.fillRect(0, 0, 100, 100);
      }
      return canvas.toDataURL();
    });

    // Mock file upload
    await page.setInputFiles('input[type="file"]', {
      name: "test-avatar.png",
      mimeType: "image/png",
      buffer: Buffer.from(testImage.split(",")[1], "base64"),
    });

    await page.click('button:has-text("Upload Avatar")');

    // Should show upload success
    await expect(page.locator("text=Avatar uploaded successfully")).toBeVisible();
  });

  test("should show validation errors for invalid profile data", async ({ page }) => {
    await page.goto("/profile");

    // Enter invalid data
    await page.fill('input[name="biometrics.age"]', "5"); // Too young
    await page.fill('input[name="biometrics.height"]', "50"); // Too short
    await page.fill('input[name="biometrics.weight"]', "10"); // Too light

    await page.click('button:has-text("Save Changes")');

    // Should show validation errors
    await expect(page.locator("text=Must be at least 13 years old")).toBeVisible();
    await expect(page.locator("text=Height must be at least 100cm")).toBeVisible();
    await expect(page.locator("text=Weight must be at least 30kg")).toBeVisible();
  });
});