// Functional tests for Simple Morph JavaScript functionality
const { test, expect } = require('../fixtures/page-fixtures');

test.describe('Functional Tests @functional', () => {
  test.beforeEach(async ({ simpleMorphPage }) => {
    // Page is already loaded via fixture
  });

  test.describe('Mobile Menu Functionality', () => {
    test('should toggle mobile menu on button click', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      const mobileMenu = simpleMorphPage.locator('.mobile-menu');
      
      // Initially menu should be hidden
      await expect(mobileMenu).not.toHaveClass(/show/);
      await expect(mobileMenuToggle).toHaveAttribute('aria-expanded', 'false');
      
      // Click to open menu
      await mobileMenuToggle.click();
      await expect(mobileMenu).toHaveClass(/show/);
      await expect(mobileMenuToggle).toHaveAttribute('aria-expanded', 'true');
      
      // Click to close menu
      await mobileMenuToggle.click();
      await expect(mobileMenu).not.toHaveClass(/show/);
      await expect(mobileMenuToggle).toHaveAttribute('aria-expanded', 'false');
    });

    test('should close mobile menu when clicking outside', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      const mobileMenu = simpleMorphPage.locator('.mobile-menu');
      
      // Open menu
      await mobileMenuToggle.click();
      await expect(mobileMenu).toHaveClass(/show/);
      
      // Click outside menu
      await simpleMorphPage.locator('main').click();
      await expect(mobileMenu).not.toHaveClass(/show/);
    });

    test('should close mobile menu on escape key', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      const mobileMenu = simpleMorphPage.locator('.mobile-menu');
      
      // Open menu
      await mobileMenuToggle.click();
      await expect(mobileMenu).toHaveClass(/show/);
      
      // Press escape
      await simpleMorphPage.keyboard.press('Escape');
      await expect(mobileMenu).not.toHaveClass(/show/);
      
      // Focus should return to toggle button
      await expect(mobileMenuToggle).toBeFocused();
    });

    test('should close mobile menu when resizing to desktop', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      const mobileMenu = simpleMorphPage.locator('.mobile-menu');
      
      // Open menu
      await mobileMenuToggle.click();
      await expect(mobileMenu).toHaveClass(/show/);
      
      // Resize to desktop
      await simpleMorphPage.setViewportSize({ width: 1200, height: 800 });
      await simpleMorphPage.waitForTimeout(100); // Allow resize handler to run
      
      await expect(mobileMenu).not.toHaveClass(/show/);
    });

    test('should use SimpleMorph API to toggle menu', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      const mobileMenu = simpleMorphPage.locator('.mobile-menu');
      
      // Use API to toggle menu
      await simpleMorphPage.evaluate(() => {
        window.SimpleMorph.toggleMobileMenu();
      });
      
      await expect(mobileMenu).toHaveClass(/show/);
      
      // Toggle again to close
      await simpleMorphPage.evaluate(() => {
        window.SimpleMorph.toggleMobileMenu();
      });
      
      await expect(mobileMenu).not.toHaveClass(/show/);
    });
  });

  test.describe('Smooth Scrolling', () => {
    test('should smooth scroll to anchor links', async ({ simpleMorphPage }) => {
      const tocLink = simpleMorphPage.locator('a[href="#buttons"]').first();
      const buttonsSection = simpleMorphPage.locator('#buttons');
      
      // Get initial scroll position
      const initialScrollY = await simpleMorphPage.evaluate(() => window.scrollY);
      
      // Click anchor link
      await tocLink.click();
      
      // Wait for scroll to complete
      await simpleMorphPage.waitForTimeout(1000);
      
      // Check that we scrolled
      const finalScrollY = await simpleMorphPage.evaluate(() => window.scrollY);
      expect(finalScrollY).toBeGreaterThan(initialScrollY);
      
      // Check that target section is in viewport
      const buttonsBox = await buttonsSection.boundingBox();
      const viewportHeight = await simpleMorphPage.evaluate(() => window.innerHeight);
      
      expect(buttonsBox.y).toBeLessThan(viewportHeight);
      expect(buttonsBox.y).toBeGreaterThan(-buttonsBox.height);
    });

    test('should account for navbar height in scroll position', async ({ simpleMorphPage }) => {
      const tocLink = simpleMorphPage.locator('a[href="#typography"]').first();
      
      await tocLink.click();
      await simpleMorphPage.waitForTimeout(1000);
      
      // Check that content is not hidden behind navbar
      const typographySection = simpleMorphPage.locator('#typography');
      const sectionBox = await typographySection.boundingBox();
      const navbarHeight = await simpleMorphPage.evaluate(() => {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'));
      });
      
      expect(sectionBox.y).toBeGreaterThan(navbarHeight);
    });
  });

  test.describe('Form Validation', () => {
    test('should validate required fields on blur', async ({ simpleMorphPage }) => {
      const formSection = simpleMorphPage.locator('#forms');
      await formSection.scrollIntoViewIfNeeded();
      
      const nameInput = simpleMorphPage.locator('#name');
      const emailInput = simpleMorphPage.locator('#email');
      
      // Test valid input
      await nameInput.fill('John Doe');
      await nameInput.blur();
      await expect(nameInput).toHaveClass(/valid/);
      
      // Test invalid input
      await nameInput.fill('');
      await nameInput.blur();
      await expect(nameInput).toHaveClass(/invalid/);
      
      // Test email validation
      await emailInput.fill('invalid-email');
      await emailInput.blur();
      await expect(emailInput).toHaveClass(/invalid/);
      
      await emailInput.fill('test@example.com');
      await emailInput.blur();
      await expect(emailInput).toHaveClass(/valid/);
    });

    test('should clear validation state on focus', async ({ simpleMorphPage }) => {
      const formSection = simpleMorphPage.locator('#forms');
      await formSection.scrollIntoViewIfNeeded();
      
      const nameInput = simpleMorphPage.locator('#name');
      
      // Make field invalid
      await nameInput.fill('');
      await nameInput.blur();
      await expect(nameInput).toHaveClass(/invalid/);
      
      // Focus should clear validation state
      await nameInput.focus();
      await expect(nameInput).not.toHaveClass(/invalid/);
      await expect(nameInput).not.toHaveClass(/valid/);
    });

    test('should prevent form submission with invalid fields', async ({ simpleMorphPage }) => {
      const formSection = simpleMorphPage.locator('#forms');
      await formSection.scrollIntoViewIfNeeded();
      
      const form = simpleMorphPage.locator('form').first();
      const submitButton = form.locator('button[type="submit"]');
      const nameInput = form.locator('#name');
      
      // Try to submit with empty required field
      await submitButton.click();
      
      // Form should not submit, and invalid field should be focused
      await expect(nameInput).toHaveClass(/invalid/);
      await expect(nameInput).toBeFocused();
    });
  });

  test.describe('Table of Contents', () => {
    test('should close TOC when close button is clicked', async ({ simpleMorphPage }) => {
      const toc = simpleMorphPage.locator('nav.toc');
      const closeButton = simpleMorphPage.locator('.toc-close');
      
      // TOC should be visible initially
      await expect(toc).toBeVisible();
      
      // Click close button
      await closeButton.click();
      
      // TOC should be hidden
      await expect(toc).toHaveClass(/hidden/);
    });
  });

  test.describe('Utility Functions', () => {
    test('should provide debounce utility', async ({ simpleMorphPage }) => {
      const result = await simpleMorphPage.evaluate(() => {
        return typeof window.SimpleMorph.utils.debounce === 'function';
      });
      
      expect(result).toBe(true);
    });

    test('should provide viewport detection utility', async ({ simpleMorphPage }) => {
      const result = await simpleMorphPage.evaluate(() => {
        return typeof window.SimpleMorph.utils.isInViewport === 'function';
      });
      
      expect(result).toBe(true);
    });

    test('should detect elements in viewport correctly', async ({ simpleMorphPage }) => {
      const result = await simpleMorphPage.evaluate(() => {
        const heroSection = document.querySelector('.hero-section');
        return window.SimpleMorph.utils.isInViewport(heroSection);
      });
      
      expect(result).toBe(true);
      
      // Scroll down and test element out of viewport
      await simpleMorphPage.evaluate(() => window.scrollTo(0, 2000));
      
      const resultAfterScroll = await simpleMorphPage.evaluate(() => {
        const heroSection = document.querySelector('.hero-section');
        return window.SimpleMorph.utils.isInViewport(heroSection);
      });
      
      expect(resultAfterScroll).toBe(false);
    });
  });

  test.describe('Configuration Access', () => {
    test('should expose configuration object', async ({ simpleMorphPage }) => {
      const config = await simpleMorphPage.evaluate(() => {
        return window.SimpleMorph.config;
      });
      
      expect(config).toHaveProperty('mobileBreakpoint', 768);
      expect(config).toHaveProperty('transitionDuration', 300);
    });
  });
});
