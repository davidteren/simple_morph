// Page fixtures and utilities for Simple Morph tests
const { test: base, expect } = require('@playwright/test');

// Extend base test with custom fixtures
const test = base.extend({
  // Simple Morph page fixture
  simpleMorphPage: async ({ page }, use) => {
    // Navigate to the main page
    await page.goto('/');
    
    // Wait for Simple Morph to initialize
    await page.waitForFunction(() => window.SimpleMorph !== undefined);
    
    // Wait for animations to settle
    await page.waitForTimeout(500);
    
    await use(page);
  },

  // Mobile viewport fixture
  mobileViewport: async ({ page }, use) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await use(page);
  },

  // Tablet viewport fixture
  tabletViewport: async ({ page }, use) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await use(page);
  },

  // Desktop viewport fixture
  desktopViewport: async ({ page }, use) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await use(page);
  },

  // Reduced motion fixture
  reducedMotion: async ({ page }, use) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await use(page);
  },

  // High contrast fixture
  highContrast: async ({ page }, use) => {
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' });
    await use(page);
  }
});

// Custom expect matchers
expect.extend({
  // Check if element has glassmorphism effect
  async toHaveGlassmorphism(locator) {
    const element = await locator.first();
    const styles = await element.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backdropFilter: computed.backdropFilter,
        background: computed.background,
        border: computed.border
      };
    });

    const hasBackdropFilter = styles.backdropFilter && styles.backdropFilter !== 'none';
    const hasTransparentBg = styles.background.includes('rgba') || styles.background.includes('hsla');
    
    return {
      message: () => `Expected element to have glassmorphism effect`,
      pass: hasBackdropFilter && hasTransparentBg
    };
  },

  // Check if element is properly responsive
  async toBeResponsive(locator, breakpoint = 768) {
    const element = await locator.first();
    const page = element.page();
    
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    const desktopBox = await element.boundingBox();
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(100); // Allow layout to settle
    const mobileBox = await element.boundingBox();
    
    const isResponsive = desktopBox && mobileBox && 
                        (mobileBox.width !== desktopBox.width || 
                         mobileBox.height !== desktopBox.height);
    
    return {
      message: () => `Expected element to be responsive across viewports`,
      pass: isResponsive
    };
  }
});

module.exports = { test, expect };
