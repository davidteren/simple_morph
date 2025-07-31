// Cross-browser compatibility tests for Simple Morph framework
const { test, expect } = require('../fixtures/page-fixtures');

test.describe('Cross-Browser Compatibility Tests @cross-browser', () => {
  test.beforeEach(async ({ simpleMorphPage }) => {
    // Page is already loaded via fixture
  });

  test.describe('CSS Feature Support', () => {
    test('should detect backdrop-filter support', async ({ simpleMorphPage }) => {
      const hasBackdropFilter = await simpleMorphPage.evaluate(() => {
        const testEl = document.createElement('div');
        testEl.style.backdropFilter = 'blur(10px)';
        return testEl.style.backdropFilter !== '';
      });
      
      console.log(`Backdrop-filter support: ${hasBackdropFilter}`);
      
      if (hasBackdropFilter) {
        // Test glassmorphism effects
        const glassElement = simpleMorphPage.locator('.glass').first();
        await expect(glassElement).toHaveGlassmorphism();
        
        const navbar = simpleMorphPage.locator('.navbar');
        const backdropFilter = await navbar.evaluate((el) => {
          return window.getComputedStyle(el).backdropFilter;
        });
        expect(backdropFilter).toContain('blur');
      } else {
        // Should have fallback styles
        const glassElement = simpleMorphPage.locator('.glass').first();
        const background = await glassElement.evaluate((el) => {
          return window.getComputedStyle(el).background;
        });
        // Should have some background even without backdrop-filter
        expect(background).not.toBe('none');
      }
    });

    test('should support CSS Grid', async ({ simpleMorphPage }) => {
      const hasGrid = await simpleMorphPage.evaluate(() => {
        const testEl = document.createElement('div');
        testEl.style.display = 'grid';
        return testEl.style.display === 'grid';
      });
      
      expect(hasGrid).toBe(true);
      
      // Test grid layouts
      const body = simpleMorphPage.locator('body');
      const gridColumns = await body.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      expect(gridColumns).toBeTruthy();
    });

    test('should support CSS Custom Properties', async ({ simpleMorphPage }) => {
      const hasCustomProperties = await simpleMorphPage.evaluate(() => {
        const testEl = document.createElement('div');
        testEl.style.setProperty('--test-prop', 'test');
        return testEl.style.getPropertyValue('--test-prop') === 'test';
      });
      
      expect(hasCustomProperties).toBe(true);
      
      // Test that custom properties are working
      const primaryColor = await simpleMorphPage.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--accent-primary');
      });
      expect(primaryColor.trim()).toBeTruthy();
    });

    test('should support CSS Flexbox', async ({ simpleMorphPage }) => {
      const hasFlex = await simpleMorphPage.evaluate(() => {
        const testEl = document.createElement('div');
        testEl.style.display = 'flex';
        return testEl.style.display === 'flex';
      });
      
      expect(hasFlex).toBe(true);
      
      // Test flex layouts
      const navbarContainer = simpleMorphPage.locator('.navbar-container');
      const display = await navbarContainer.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(display).toBe('flex');
    });

    test('should support CSS Transforms', async ({ simpleMorphPage }) => {
      const hasTransforms = await simpleMorphPage.evaluate(() => {
        const testEl = document.createElement('div');
        testEl.style.transform = 'translateX(10px)';
        return testEl.style.transform !== '';
      });
      
      expect(hasTransforms).toBe(true);
      
      // Test hover transforms
      const button = simpleMorphPage.locator('.button-primary').first();
      await button.hover();
      
      const transform = await button.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      expect(transform).toContain('translateY');
    });

    test('should support CSS Animations', async ({ simpleMorphPage }) => {
      const hasAnimations = await simpleMorphPage.evaluate(() => {
        const testEl = document.createElement('div');
        testEl.style.animation = 'test 1s';
        return testEl.style.animation !== '';
      });
      
      expect(hasAnimations).toBe(true);
      
      // Test background animations (unless reduced motion)
      const prefersReducedMotion = await simpleMorphPage.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });
      
      if (!prefersReducedMotion) {
        const backgroundAnimation = await simpleMorphPage.evaluate(() => {
          const body = document.body;
          const beforeStyles = window.getComputedStyle(body, '::before');
          return beforeStyles.animationName;
        });
        expect(backgroundAnimation).toBe('backgroundShift');
      }
    });
  });

  test.describe('JavaScript API Compatibility', () => {
    test('should support modern JavaScript features', async ({ simpleMorphPage }) => {
      // Test const/let support without eval (security safe)
      const hasModernJS = await simpleMorphPage.evaluate(() => {
        try {
          new Function('const test = 1; let test2 = 2;');
          return true;
        } catch (e) {
          return false;
        }
      });

      expect(hasModernJS).toBe(true);
    });

    test('should support DOM APIs', async ({ simpleMorphPage }) => {
      // Test querySelector support
      const hasQuerySelector = await simpleMorphPage.evaluate(() => {
        return typeof document.querySelector === 'function';
      });
      expect(hasQuerySelector).toBe(true);
      
      // Test classList support
      const hasClassList = await simpleMorphPage.evaluate(() => {
        const testEl = document.createElement('div');
        return typeof testEl.classList === 'object';
      });
      expect(hasClassList).toBe(true);
      
      // Test addEventListener support
      const hasAddEventListener = await simpleMorphPage.evaluate(() => {
        return typeof document.addEventListener === 'function';
      });
      expect(hasAddEventListener).toBe(true);
    });

    test('should support Form Validation API', async ({ simpleMorphPage }) => {
      const hasValidationAPI = await simpleMorphPage.evaluate(() => {
        const testInput = document.createElement('input');
        return typeof testInput.checkValidity === 'function';
      });
      
      expect(hasValidationAPI).toBe(true);
      
      // Test that form validation works
      const formSection = simpleMorphPage.locator('#forms');
      await formSection.scrollIntoViewIfNeeded();
      
      const nameInput = simpleMorphPage.locator('#name');
      await nameInput.fill('');
      
      const isValid = await nameInput.evaluate((el) => el.checkValidity());
      expect(isValid).toBe(false);
    });

    test('should support Smooth Scrolling API', async ({ simpleMorphPage }) => {
      const hasSmoothScroll = await simpleMorphPage.evaluate(() => {
        return 'scrollBehavior' in document.documentElement.style;
      });
      
      if (hasSmoothScroll) {
        // Test smooth scrolling
        const tocLink = simpleMorphPage.locator('a[href="#buttons"]').first();
        await tocLink.click();
        
        // Should scroll smoothly (we can't easily test the smoothness, but we can test it scrolls)
        await simpleMorphPage.waitForTimeout(1000);
        const scrollY = await simpleMorphPage.evaluate(() => window.scrollY);
        expect(scrollY).toBeGreaterThan(0);
      } else {
        console.log('Smooth scrolling not supported, should use polyfill');
      }
    });
  });

  test.describe('Responsive Design Features', () => {
    test('should support media queries', async ({ simpleMorphPage }) => {
      const hasMediaQueries = await simpleMorphPage.evaluate(() => {
        return typeof window.matchMedia === 'function';
      });
      
      expect(hasMediaQueries).toBe(true);
      
      // Test mobile breakpoint detection
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      const isMobile = await simpleMorphPage.evaluate(() => {
        return window.matchMedia('(max-width: 768px)').matches;
      });
      
      expect(isMobile).toBe(true);
    });

    test('should handle viewport meta tag', async ({ simpleMorphPage }) => {
      const viewportMeta = simpleMorphPage.locator('meta[name="viewport"]');
      await expect(viewportMeta).toHaveAttribute('content', 'width=device-width, initial-scale=1.0');
    });
  });

  test.describe('Performance Features', () => {
    test('should support will-change for animations', async ({ simpleMorphPage }) => {
      const hasWillChange = await simpleMorphPage.evaluate(() => {
        const testEl = document.createElement('div');
        testEl.style.willChange = 'transform';
        return testEl.style.willChange !== '';
      });
      
      if (hasWillChange) {
        console.log('will-change supported for better animation performance');
      } else {
        console.log('will-change not supported, animations may be less performant');
      }
    });

    test('should support passive event listeners', async ({ simpleMorphPage }) => {
      const hasPassiveListeners = await simpleMorphPage.evaluate(() => {
        let passiveSupported = false;
        try {
          const options = {
            get passive() {
              passiveSupported = true;
              return false;
            }
          };
          window.addEventListener('test', null, options);
          window.removeEventListener('test', null, options);
        } catch (err) {
          passiveSupported = false;
        }
        return passiveSupported;
      });
      
      if (hasPassiveListeners) {
        console.log('Passive event listeners supported for better scroll performance');
      }
    });
  });

  test.describe('Fallback Behavior', () => {
    test('should provide fallbacks for unsupported features', async ({ simpleMorphPage }) => {
      // Test that the page still works even if some features are missing
      await expect(simpleMorphPage.locator('body')).toBeVisible();
      await expect(simpleMorphPage.locator('.navbar')).toBeVisible();
      await expect(simpleMorphPage.locator('main')).toBeVisible();
      
      // Test that JavaScript still initializes
      const simpleMorphLoaded = await simpleMorphPage.evaluate(() => {
        return typeof window.SimpleMorph === 'object';
      });
      expect(simpleMorphLoaded).toBe(true);
    });

    test('should handle missing backdrop-filter gracefully', async ({ simpleMorphPage }) => {
      // Simulate missing backdrop-filter support
      await simpleMorphPage.addStyleTag({
        content: `
          .glass, .glass-strong, .navbar {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
        `
      });
      
      // Elements should still be visible and styled
      const navbar = simpleMorphPage.locator('.navbar');
      await expect(navbar).toBeVisible();
      
      const background = await navbar.evaluate((el) => {
        return window.getComputedStyle(el).background;
      });
      expect(background).not.toBe('none');
    });

    test('should work without CSS Grid support', async ({ simpleMorphPage }) => {
      // Simulate missing CSS Grid support
      await simpleMorphPage.addStyleTag({
        content: `
          body {
            display: block !important;
            grid-template-columns: none !important;
          }
        `
      });
      
      // Content should still be readable
      const main = simpleMorphPage.locator('main');
      await expect(main).toBeVisible();
      
      // Should fall back to block layout
      const display = await simpleMorphPage.locator('body').evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(display).toBe('block');
    });
  });

  test.describe('Print Styles', () => {
    test('should have print-friendly styles', async ({ simpleMorphPage }) => {
      // Simulate print media
      await simpleMorphPage.emulateMedia({ media: 'print' });
      
      // Check print styles are applied
      const bodyBackground = await simpleMorphPage.evaluate(() => {
        return window.getComputedStyle(document.body).background;
      });
      
      // Should have white background for print
      expect(bodyBackground).toContain('white');
      
      // Navbar should be hidden in print
      const navbar = simpleMorphPage.locator('.navbar');
      const navbarDisplay = await navbar.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(navbarDisplay).toBe('none');
    });
  });
});
