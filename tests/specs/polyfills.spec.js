// Polyfill tests for Simple Morph framework
const { test, expect } = require('../fixtures/page-fixtures');

test.describe('Polyfill Tests @polyfills', () => {
  test.beforeEach(async ({ page }) => {
    // Load page with polyfills
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Load polyfills
    await page.addScriptTag({ path: '../polyfills/simple-morph-polyfills.js' });
    
    // Wait for polyfills to initialize
    await page.waitForFunction(() => window.SimpleMorphPolyfills !== undefined);
  });

  test.describe('Feature Detection', () => {
    test('should detect browser features correctly', async ({ page }) => {
      const features = await page.evaluate(() => window.SimpleMorphPolyfills.features);
      
      expect(features).toHaveProperty('backdropFilter');
      expect(features).toHaveProperty('customProperties');
      expect(features).toHaveProperty('smoothScroll');
      expect(features).toHaveProperty('intersectionObserver');
      expect(features).toHaveProperty('matchMedia');
      expect(features).toHaveProperty('classList');
      
      console.log('Browser features:', features);
    });
  });

  test.describe('Backdrop-filter Fallback', () => {
    test('should apply fallback styles when backdrop-filter is not supported', async ({ page }) => {
      // Simulate missing backdrop-filter support
      await page.addStyleTag({
        content: `
          * {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
        `
      });
      
      // Reload polyfills to trigger fallback
      await page.reload();
      await page.addScriptTag({ path: '../polyfills/simple-morph-polyfills.js' });
      await page.waitForFunction(() => window.SimpleMorphPolyfills !== undefined);
      
      // Check that fallback styles are applied
      const navbar = page.locator('.navbar');
      const background = await navbar.evaluate((el) => {
        return window.getComputedStyle(el).background;
      });
      
      // Should have fallback background
      expect(background).toContain('rgba');
    });

    test('should maintain visual hierarchy with fallbacks', async ({ page }) => {
      // Glass elements should still be distinguishable
      const glassElement = page.locator('.glass').first();
      const glassStrongElement = page.locator('.glass-strong').first();
      
      await expect(glassElement).toBeVisible();
      await expect(glassStrongElement).toBeVisible();
      
      // Should have different opacity levels
      const glassOpacity = await glassElement.evaluate((el) => {
        const bg = window.getComputedStyle(el).background;
        const match = bg.match(/rgba\([^,]+,[^,]+,[^,]+,([^)]+)\)/);
        return match ? parseFloat(match[1]) : 1;
      });
      
      const glassStrongOpacity = await glassStrongElement.evaluate((el) => {
        const bg = window.getComputedStyle(el).background;
        const match = bg.match(/rgba\([^,]+,[^,]+,[^,]+,([^)]+)\)/);
        return match ? parseFloat(match[1]) : 1;
      });
      
      expect(glassStrongOpacity).toBeGreaterThan(glassOpacity);
    });
  });

  test.describe('CSS Custom Properties Fallback', () => {
    test('should apply fallback values when custom properties are not supported', async ({ page }) => {
      // Simulate missing custom properties support by removing them
      await page.addStyleTag({
        content: `
          :root {
            --accent-primary: initial !important;
            --accent-secondary: initial !important;
          }
        `
      });
      
      // Check that elements still have proper styling
      const primaryButton = page.locator('.button-primary').first();
      const background = await primaryButton.evaluate((el) => {
        return window.getComputedStyle(el).background;
      });
      
      // Should have fallback gradient or color
      expect(background).toBeTruthy();
      expect(background).not.toBe('none');
    });

    test('should maintain color scheme with fallbacks', async ({ page }) => {
      const successAlert = page.locator('.alert-success').first();
      const warningAlert = page.locator('.alert-warning').first();
      const errorAlert = page.locator('.alert-error').first();
      
      if (await successAlert.isVisible()) {
        const successColor = await successAlert.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });
        expect(successColor).toContain('34, 199, 89'); // Green
      }
      
      if (await warningAlert.isVisible()) {
        const warningColor = await warningAlert.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });
        expect(warningColor).toContain('255, 149, 0'); // Orange
      }
      
      if (await errorAlert.isVisible()) {
        const errorColor = await errorAlert.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });
        expect(errorColor).toContain('255, 59, 48'); // Red
      }
    });
  });

  test.describe('Smooth Scrolling Polyfill', () => {
    test('should provide smooth scrolling when native support is missing', async ({ page }) => {
      // Override native smooth scroll to test polyfill
      await page.evaluate(() => {
        // Remove smooth scroll support
        delete document.documentElement.style.scrollBehavior;
        
        // Mock the original scrollTo
        window.originalScrollTo = window.scrollTo;
        window.scrollTo = function() {
          // Simulate no smooth scroll support
          window.originalScrollTo.apply(window, arguments);
        };
      });
      
      // Test smooth scroll functionality
      const initialScrollY = await page.evaluate(() => window.scrollY);
      
      // Use the polyfilled smooth scroll
      await page.evaluate(() => {
        window.scrollTo({
          top: 500,
          behavior: 'smooth'
        });
      });
      
      // Wait for scroll to complete
      await page.waitForTimeout(1000);
      
      const finalScrollY = await page.evaluate(() => window.scrollY);
      expect(finalScrollY).toBeGreaterThan(initialScrollY);
    });

    test('should work with anchor link navigation', async ({ page }) => {
      const tocLink = page.locator('a[href="#buttons"]').first();
      
      const initialScrollY = await page.evaluate(() => window.scrollY);
      
      await tocLink.click();
      await page.waitForTimeout(1000);
      
      const finalScrollY = await page.evaluate(() => window.scrollY);
      expect(finalScrollY).toBeGreaterThan(initialScrollY);
      
      // Target section should be visible
      const buttonsSection = page.locator('#buttons');
      await expect(buttonsSection).toBeInViewport();
    });
  });

  test.describe('matchMedia Polyfill', () => {
    test('should provide matchMedia functionality when missing', async ({ page }) => {
      // Test that matchMedia exists
      const hasMatchMedia = await page.evaluate(() => {
        return typeof window.matchMedia === 'function';
      });
      
      expect(hasMatchMedia).toBe(true);
      
      // Test basic functionality
      const mediaQuery = await page.evaluate(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        return {
          matches: mq.matches,
          media: mq.media
        };
      });
      
      expect(mediaQuery).toHaveProperty('matches');
      expect(mediaQuery).toHaveProperty('media');
    });
  });

  test.describe('classList Polyfill', () => {
    test('should provide classList functionality when missing', async ({ page }) => {
      // Test classList methods
      const classListTest = await page.evaluate(() => {
        const testEl = document.createElement('div');
        testEl.className = 'test-class';
        
        return {
          hasAdd: typeof testEl.classList.add === 'function',
          hasRemove: typeof testEl.classList.remove === 'function',
          hasToggle: typeof testEl.classList.toggle === 'function',
          hasContains: typeof testEl.classList.contains === 'function',
          containsTest: testEl.classList.contains('test-class')
        };
      });
      
      expect(classListTest.hasAdd).toBe(true);
      expect(classListTest.hasRemove).toBe(true);
      expect(classListTest.hasToggle).toBe(true);
      expect(classListTest.hasContains).toBe(true);
      expect(classListTest.containsTest).toBe(true);
    });

    test('should work with Simple Morph functionality', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const mobileMenuToggle = page.locator('.mobile-menu-toggle');
      const mobileMenu = page.locator('.mobile-menu');
      
      // Test that classList operations work
      await mobileMenuToggle.click();
      await expect(mobileMenu).toHaveClass(/show/);
      
      await mobileMenuToggle.click();
      await expect(mobileMenu).not.toHaveClass(/show/);
    });
  });

  test.describe('IntersectionObserver Polyfill', () => {
    test('should provide IntersectionObserver when missing', async ({ page }) => {
      const hasIntersectionObserver = await page.evaluate(() => {
        return typeof window.IntersectionObserver === 'function';
      });
      
      expect(hasIntersectionObserver).toBe(true);
    });

    test('should detect element visibility', async ({ page }) => {
      const visibilityTest = await page.evaluate(() => {
        return new Promise((resolve) => {
          const testEl = document.querySelector('h1');
          const observer = new IntersectionObserver((entries) => {
            resolve({
              isIntersecting: entries[0].isIntersecting,
              target: entries[0].target.tagName
            });
          });
          
          observer.observe(testEl);
        });
      });
      
      expect(visibilityTest.isIntersecting).toBe(true);
      expect(visibilityTest.target).toBe('H1');
    });
  });

  test.describe('Overall Compatibility', () => {
    test('should maintain functionality with all polyfills active', async ({ page }) => {
      // Test that core Simple Morph functionality still works
      const simpleMorphLoaded = await page.evaluate(() => {
        return typeof window.SimpleMorph === 'object';
      });
      expect(simpleMorphLoaded).toBe(true);
      
      // Test mobile menu
      await page.setViewportSize({ width: 375, height: 667 });
      const mobileMenuToggle = page.locator('.mobile-menu-toggle');
      const mobileMenu = page.locator('.mobile-menu');
      
      await mobileMenuToggle.click();
      await expect(mobileMenu).toHaveClass(/show/);
      
      // Test form validation
      const formSection = page.locator('#forms');
      await formSection.scrollIntoViewIfNeeded();
      
      const nameInput = page.locator('#name');
      await nameInput.fill('Test User');
      await nameInput.blur();
      await expect(nameInput).toHaveClass(/valid/);
      
      // Test smooth scrolling
      const tocLink = page.locator('a[href="#typography"]').first();
      await tocLink.click();
      await page.waitForTimeout(500);
      
      const typographySection = page.locator('#typography');
      await expect(typographySection).toBeInViewport();
    });

    test('should provide graceful degradation', async ({ page }) => {
      // Even with polyfills, the page should be usable
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('.navbar')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      
      // Content should be readable
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText(/Simple Morph/);
    });
  });
});
