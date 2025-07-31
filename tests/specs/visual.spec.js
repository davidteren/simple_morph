// Visual regression tests for Simple Morph framework
const { test, expect } = require('../fixtures/page-fixtures');

test.describe('Visual Tests @visual', () => {
  test.beforeEach(async ({ simpleMorphPage }) => {
    // Page is already loaded via fixture
  });

  test('should render homepage correctly on desktop', async ({ simpleMorphPage }) => {
    await simpleMorphPage.setViewportSize({ width: 1920, height: 1080 });
    await simpleMorphPage.waitForLoadState('networkidle');
    
    // Wait for animations to settle
    await simpleMorphPage.waitForTimeout(1000);
    
    await expect(simpleMorphPage).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('should render homepage correctly on tablet', async ({ simpleMorphPage }) => {
    await simpleMorphPage.setViewportSize({ width: 768, height: 1024 });
    await simpleMorphPage.waitForLoadState('networkidle');
    await simpleMorphPage.waitForTimeout(1000);
    
    await expect(simpleMorphPage).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('should render homepage correctly on mobile', async ({ simpleMorphPage }) => {
    await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
    await simpleMorphPage.waitForLoadState('networkidle');
    await simpleMorphPage.waitForTimeout(1000);
    
    await expect(simpleMorphPage).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('should render glassmorphism effects correctly', async ({ simpleMorphPage }) => {
    // Test navbar glassmorphism
    const navbar = simpleMorphPage.locator('.navbar');
    await expect(navbar).toHaveScreenshot('navbar-glass.png');
    
    // Test card glassmorphism
    const card = simpleMorphPage.locator('.card').first();
    await expect(card).toHaveScreenshot('card-glass.png');
    
    // Test glass utility classes
    const glassElement = simpleMorphPage.locator('.glass').first();
    await expect(glassElement).toHaveScreenshot('glass-utility.png');
    
    const glassStrongElement = simpleMorphPage.locator('.glass-strong').first();
    await expect(glassStrongElement).toHaveScreenshot('glass-strong-utility.png');
  });

  test('should render buttons correctly', async ({ simpleMorphPage }) => {
    const buttonSection = simpleMorphPage.locator('#buttons');
    await buttonSection.scrollIntoViewIfNeeded();
    
    await expect(buttonSection).toHaveScreenshot('buttons-section.png');
    
    // Test button hover states
    const primaryButton = simpleMorphPage.locator('.button-primary').first();
    await primaryButton.hover();
    await expect(primaryButton).toHaveScreenshot('button-primary-hover.png');
    
    const secondaryButton = simpleMorphPage.locator('.button-secondary').first();
    await secondaryButton.hover();
    await expect(secondaryButton).toHaveScreenshot('button-secondary-hover.png');
  });

  test('should render forms correctly', async ({ simpleMorphPage }) => {
    const formSection = simpleMorphPage.locator('#forms');
    await formSection.scrollIntoViewIfNeeded();
    
    await expect(formSection).toHaveScreenshot('forms-section.png');
    
    // Test form validation states
    const nameInput = simpleMorphPage.locator('#name');
    await nameInput.fill('Test User');
    await nameInput.blur();
    await expect(nameInput).toHaveScreenshot('input-valid.png');
    
    await nameInput.fill('');
    await nameInput.blur();
    await expect(nameInput).toHaveScreenshot('input-invalid.png');
  });

  test('should render tables correctly', async ({ simpleMorphPage }) => {
    const tableSection = simpleMorphPage.locator('#tables');
    await tableSection.scrollIntoViewIfNeeded();
    
    await expect(tableSection).toHaveScreenshot('tables-section.png');
  });

  test('should render alerts correctly', async ({ simpleMorphPage }) => {
    const alertSection = simpleMorphPage.locator('#alerts');
    await alertSection.scrollIntoViewIfNeeded();
    
    await expect(alertSection).toHaveScreenshot('alerts-section.png');
  });

  test('should render navigation correctly', async ({ simpleMorphPage }) => {
    const navSection = simpleMorphPage.locator('#navigation');
    await navSection.scrollIntoViewIfNeeded();
    
    await expect(navSection).toHaveScreenshot('navigation-section.png');
  });

  test('should render typography correctly', async ({ simpleMorphPage }) => {
    const typographySection = simpleMorphPage.locator('#typography');
    await typographySection.scrollIntoViewIfNeeded();
    
    await expect(typographySection).toHaveScreenshot('typography-section.png');
  });

  test('should handle reduced motion preference', async ({ simpleMorphPage, reducedMotion }) => {
    await simpleMorphPage.waitForLoadState('networkidle');
    
    // Check that animations are disabled
    const backgroundAnimation = await simpleMorphPage.evaluate(() => {
      const body = document.body;
      const beforeStyles = window.getComputedStyle(body, '::before');
      return beforeStyles.animationDuration;
    });
    
    expect(backgroundAnimation).toBe('0.01ms');
    
    await expect(simpleMorphPage).toHaveScreenshot('homepage-reduced-motion.png', {
      fullPage: true
    });
  });

  test('should render correctly in high contrast mode', async ({ simpleMorphPage, highContrast }) => {
    await simpleMorphPage.waitForLoadState('networkidle');
    await simpleMorphPage.waitForTimeout(1000);
    
    await expect(simpleMorphPage).toHaveScreenshot('homepage-high-contrast.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });
});
