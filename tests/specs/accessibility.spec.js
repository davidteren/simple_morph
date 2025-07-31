// Accessibility tests for Simple Morph framework
const { test, expect } = require('../fixtures/page-fixtures');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility Tests @accessibility', () => {
  test.beforeEach(async ({ simpleMorphPage }) => {
    // Page is already loaded via fixture
  });

  test.describe('WCAG Compliance', () => {
    test('should pass axe accessibility audit', async ({ simpleMorphPage }) => {
      const accessibilityScanResults = await new AxeBuilder({ page: simpleMorphPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should pass axe audit on mobile', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      const accessibilityScanResults = await new AxeBuilder({ page: simpleMorphPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper color contrast', async ({ simpleMorphPage }) => {
      const accessibilityScanResults = await new AxeBuilder({ page: simpleMorphPage })
        .withTags(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support keyboard navigation through interactive elements', async ({ simpleMorphPage }) => {
      // Start from the top
      await simpleMorphPage.keyboard.press('Tab');
      
      // Should focus on first interactive element (skip link or first nav item)
      let focusedElement = await simpleMorphPage.locator(':focus').first();
      await expect(focusedElement).toBeVisible();
      
      // Tab through several elements
      const tabStops = [];
      for (let i = 0; i < 10; i++) {
        await simpleMorphPage.keyboard.press('Tab');
        const focused = await simpleMorphPage.evaluate(() => {
          const el = document.activeElement;
          return el ? {
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            text: el.textContent?.slice(0, 50)
          } : null;
        });
        if (focused) {
          tabStops.push(focused);
        }
      }
      
      // Should have found interactive elements
      expect(tabStops.length).toBeGreaterThan(5);
      
      // Should include navigation, buttons, and form elements
      const tagNames = tabStops.map(stop => stop.tagName);
      expect(tagNames).toContain('A'); // Links
      expect(tagNames).toContain('BUTTON'); // Buttons
    });

    test('should support keyboard navigation in mobile menu', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      const mobileMenu = simpleMorphPage.locator('.mobile-menu');
      
      // Focus and activate mobile menu toggle
      await mobileMenuToggle.focus();
      await expect(mobileMenuToggle).toBeFocused();
      
      await simpleMorphPage.keyboard.press('Enter');
      await expect(mobileMenu).toHaveClass(/show/);
      
      // Tab should move to menu items
      await simpleMorphPage.keyboard.press('Tab');
      const focusedLink = simpleMorphPage.locator('.mobile-menu a:focus');
      await expect(focusedLink).toBeVisible();
      
      // Escape should close menu and return focus
      await simpleMorphPage.keyboard.press('Escape');
      await expect(mobileMenu).not.toHaveClass(/show/);
      await expect(mobileMenuToggle).toBeFocused();
    });

    test('should support keyboard navigation in forms', async ({ simpleMorphPage }) => {
      const formSection = simpleMorphPage.locator('#forms');
      await formSection.scrollIntoViewIfNeeded();
      
      const nameInput = simpleMorphPage.locator('#name');
      const emailInput = simpleMorphPage.locator('#email');
      const messageTextarea = simpleMorphPage.locator('#message');
      const categorySelect = simpleMorphPage.locator('#category');
      const checkbox = simpleMorphPage.locator('#terms');
      const submitButton = simpleMorphPage.locator('button[type="submit"]');
      
      // Tab through form elements
      await nameInput.focus();
      await expect(nameInput).toBeFocused();
      
      await simpleMorphPage.keyboard.press('Tab');
      await expect(emailInput).toBeFocused();
      
      await simpleMorphPage.keyboard.press('Tab');
      await expect(messageTextarea).toBeFocused();
      
      await simpleMorphPage.keyboard.press('Tab');
      await expect(categorySelect).toBeFocused();
      
      await simpleMorphPage.keyboard.press('Tab');
      await expect(checkbox).toBeFocused();
      
      await simpleMorphPage.keyboard.press('Tab');
      await expect(submitButton).toBeFocused();
    });

    test('should handle Enter and Space keys on buttons', async ({ simpleMorphPage }) => {
      const primaryButton = simpleMorphPage.locator('.button-primary').first();
      
      await primaryButton.focus();
      await expect(primaryButton).toBeFocused();
      
      // Both Enter and Space should work on buttons
      let clickCount = 0;
      await simpleMorphPage.evaluate(() => {
        window.testClickCount = 0;
        document.querySelector('.button-primary').addEventListener('click', () => {
          window.testClickCount++;
        });
      });
      
      await simpleMorphPage.keyboard.press('Enter');
      let count = await simpleMorphPage.evaluate(() => window.testClickCount);
      expect(count).toBe(1);
      
      await simpleMorphPage.keyboard.press('Space');
      count = await simpleMorphPage.evaluate(() => window.testClickCount);
      expect(count).toBe(2);
    });
  });

  test.describe('ARIA Attributes', () => {
    test('should have proper ARIA attributes on mobile menu', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      
      // Should have aria-label
      await expect(mobileMenuToggle).toHaveAttribute('aria-label', 'Toggle mobile menu');
      
      // Should have aria-expanded
      await expect(mobileMenuToggle).toHaveAttribute('aria-expanded', 'false');
      
      // After opening menu
      await mobileMenuToggle.click();
      await expect(mobileMenuToggle).toHaveAttribute('aria-expanded', 'true');
    });

    test('should have proper form labels', async ({ simpleMorphPage }) => {
      const formSection = simpleMorphPage.locator('#forms');
      await formSection.scrollIntoViewIfNeeded();
      
      // All form inputs should have associated labels
      const nameInput = simpleMorphPage.locator('#name');
      const nameLabel = simpleMorphPage.locator('label[for="name"]');
      await expect(nameLabel).toBeVisible();
      await expect(nameLabel).toHaveText('Name');
      
      const emailInput = simpleMorphPage.locator('#email');
      const emailLabel = simpleMorphPage.locator('label[for="email"]');
      await expect(emailLabel).toBeVisible();
      await expect(emailLabel).toHaveText('Email');
      
      const messageTextarea = simpleMorphPage.locator('#message');
      const messageLabel = simpleMorphPage.locator('label[for="message"]');
      await expect(messageLabel).toBeVisible();
      await expect(messageLabel).toHaveText('Message');
    });

    test('should have proper heading hierarchy', async ({ simpleMorphPage }) => {
      // Check heading structure
      const headings = await simpleMorphPage.locator('h1, h2, h3, h4, h5, h6').all();
      const headingLevels = [];
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName);
        const level = parseInt(tagName.charAt(1));
        headingLevels.push(level);
      }
      
      // Should start with h1
      expect(headingLevels[0]).toBe(1);
      
      // Should not skip levels (no h1 -> h3 jumps)
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i];
        const previousLevel = headingLevels[i - 1];
        
        if (currentLevel > previousLevel) {
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        }
      }
    });

    test('should have proper table headers', async ({ simpleMorphPage }) => {
      const tableSection = simpleMorphPage.locator('#tables');
      await tableSection.scrollIntoViewIfNeeded();
      
      const table = simpleMorphPage.locator('table').first();
      const headers = table.locator('th');
      
      // Should have table headers
      const headerCount = await headers.count();
      expect(headerCount).toBeGreaterThan(0);
      
      // Headers should have proper scope (implicit for simple tables)
      const firstHeader = headers.first();
      await expect(firstHeader).toBeVisible();
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ simpleMorphPage }) => {
      const button = simpleMorphPage.locator('.button-primary').first();
      
      await button.focus();
      
      // Should have focus outline
      const outline = await button.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          outlineColor: styles.outlineColor,
          outlineOffset: styles.outlineOffset
        };
      });
      
      // Should have visible outline (not 'none' or '0px')
      expect(outline.outline).not.toBe('none');
      expect(outline.outlineWidth).not.toBe('0px');
    });

    test('should manage focus in modal-like mobile menu', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      const mobileMenu = simpleMorphPage.locator('.mobile-menu');
      
      // Open menu
      await mobileMenuToggle.click();
      await expect(mobileMenu).toHaveClass(/show/);
      
      // Focus should be trapped in menu area
      await simpleMorphPage.keyboard.press('Tab');
      const focusedElement = simpleMorphPage.locator(':focus');
      
      // Should be within mobile menu or toggle
      const isInMenu = await focusedElement.evaluate((el) => {
        const menu = document.querySelector('.mobile-menu');
        const toggle = document.querySelector('.mobile-menu-toggle');
        return menu?.contains(el) || toggle?.contains(el) || el === menu || el === toggle;
      });
      
      expect(isInMenu).toBe(true);
    });

    test('should restore focus after interactions', async ({ simpleMorphPage }) => {
      const tocCloseButton = simpleMorphPage.locator('.toc-close');
      
      if (await tocCloseButton.isVisible()) {
        await tocCloseButton.focus();
        await tocCloseButton.click();
        
        // Focus should move to a reasonable location (not lost)
        const focusedElement = simpleMorphPage.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper document structure', async ({ simpleMorphPage }) => {
      // Should have proper landmarks
      const main = simpleMorphPage.locator('main');
      await expect(main).toBeVisible();
      
      const header = simpleMorphPage.locator('header');
      await expect(header).toBeVisible();
      
      const nav = simpleMorphPage.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should have descriptive link text', async ({ simpleMorphPage }) => {
      const links = simpleMorphPage.locator('a');
      const linkCount = await links.count();
      
      // Check first few links for descriptive text
      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const href = await link.getAttribute('href');
        
        if (href && href !== '#') {
          // Link should have meaningful text (not just "click here" or "read more")
          expect(text?.trim().length).toBeGreaterThan(0);
          expect(text?.toLowerCase()).not.toContain('click here');
          expect(text?.toLowerCase()).not.toContain('read more');
        }
      }
    });

    test('should have proper alt text for images', async ({ simpleMorphPage }) => {
      const images = simpleMorphPage.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // All images should have alt attribute (can be empty for decorative)
        expect(alt).not.toBeNull();
      }
    });
  });

  test.describe('Reduced Motion Support', () => {
    test('should respect prefers-reduced-motion', async ({ simpleMorphPage, reducedMotion }) => {
      // Check that animations are disabled
      const animationDuration = await simpleMorphPage.evaluate(() => {
        const testEl = document.createElement('div');
        testEl.style.animation = 'backgroundShift 20s ease-in-out infinite';
        document.body.appendChild(testEl);
        const duration = window.getComputedStyle(testEl).animationDuration;
        document.body.removeChild(testEl);
        return duration;
      });
      
      expect(animationDuration).toBe('0.01ms');
      
      // Check that transitions are disabled
      const transitionDuration = await simpleMorphPage.evaluate(() => {
        const testEl = document.createElement('div');
        testEl.style.transition = 'all 0.3s';
        document.body.appendChild(testEl);
        const duration = window.getComputedStyle(testEl).transitionDuration;
        document.body.removeChild(testEl);
        return duration;
      });
      
      expect(transitionDuration).toBe('0.01ms');
    });
  });

  test.describe('Language and Internationalization', () => {
    test('should have proper lang attribute', async ({ simpleMorphPage }) => {
      const html = simpleMorphPage.locator('html');
      await expect(html).toHaveAttribute('lang', 'en');
    });

    test('should have proper document title', async ({ simpleMorphPage }) => {
      const title = await simpleMorphPage.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
      expect(title).toContain('Simple Morph');
    });
  });
});
