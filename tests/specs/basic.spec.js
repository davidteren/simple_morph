// Basic test to verify Playwright setup
const { test, expect } = require('@playwright/test');

test.describe('Basic Tests', () => {
  test('should load the Simple Morph homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Simple Morph/);
    
    // Check that the main heading is visible
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Simple Morph');
    
    // Check that Simple Morph JavaScript is loaded
    const simpleMorphLoaded = await page.evaluate(() => {
      return typeof window.SimpleMorph === 'object';
    });
    expect(simpleMorphLoaded).toBe(true);
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check that navbar is visible
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();
    
    // Check that navigation links exist
    const navLinks = page.locator('.navbar a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should have glassmorphism effects', async ({ page }) => {
    await page.goto('/');
    
    // Check that glass elements exist
    const glassElements = page.locator('.glass');
    const glassCount = await glassElements.count();
    expect(glassCount).toBeGreaterThan(0);
    
    // Check that navbar has glassmorphism
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();
  });
});
