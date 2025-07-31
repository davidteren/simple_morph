// Responsive design tests for Simple Morph framework
const { test, expect } = require('../fixtures/page-fixtures');

test.describe('Responsive Design Tests @responsive', () => {
  test.beforeEach(async ({ simpleMorphPage }) => {
    // Page is already loaded via fixture
  });

  test.describe('Viewport Breakpoints', () => {
    test('should handle mobile viewport (375px)', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      await simpleMorphPage.waitForTimeout(100);
      
      // Mobile menu toggle should be visible
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      await expect(mobileMenuToggle).toBeVisible();
      
      // Desktop navigation should be hidden
      const desktopNav = simpleMorphPage.locator('.navbar-nav');
      await expect(desktopNav).toHaveCSS('display', 'none');
      
      // Body should use single column layout
      const bodyGridColumns = await simpleMorphPage.evaluate(() => {
        return window.getComputedStyle(document.body).gridTemplateColumns;
      });
      expect(bodyGridColumns).toBe('1fr');
    });

    test('should handle tablet viewport (768px)', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 768, height: 1024 });
      await simpleMorphPage.waitForTimeout(100);
      
      // Should still show mobile menu at exactly 768px
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      await expect(mobileMenuToggle).toBeVisible();
      
      // Test grid layout changes
      const demoGrid = simpleMorphPage.locator('.demo-grid').first();
      const gridColumns = await demoGrid.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      expect(gridColumns).toBe('1fr'); // Should be single column at 768px
    });

    test('should handle desktop viewport (1024px+)', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 1024, height: 768 });
      await simpleMorphPage.waitForTimeout(100);
      
      // Desktop navigation should be visible
      const desktopNav = simpleMorphPage.locator('.navbar-nav');
      await expect(desktopNav).toBeVisible();
      
      // Mobile menu toggle should be hidden
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      await expect(mobileMenuToggle).toHaveCSS('display', 'none');
      
      // Body should use three-column layout
      const bodyGridColumns = await simpleMorphPage.evaluate(() => {
        return window.getComputedStyle(document.body).gridTemplateColumns;
      });
      expect(bodyGridColumns).toContain('1fr min(65rem, 90%) 1fr');
    });

    test('should handle large desktop viewport (1920px)', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 1920, height: 1080 });
      await simpleMorphPage.waitForTimeout(100);
      
      // Content should be centered with max-width
      const main = simpleMorphPage.locator('main');
      const mainBox = await main.boundingBox();
      const viewportWidth = 1920;
      
      // Content should not span full width
      expect(mainBox.width).toBeLessThan(viewportWidth * 0.9);
      
      // Content should be centered
      const leftMargin = mainBox.x;
      const rightMargin = viewportWidth - (mainBox.x + mainBox.width);
      expect(Math.abs(leftMargin - rightMargin)).toBeLessThan(50); // Allow small difference
    });

    test('should handle 4K viewport (3840px)', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 3840, height: 2160 });
      await simpleMorphPage.waitForTimeout(100);
      
      // Content should still be readable and centered
      const main = simpleMorphPage.locator('main');
      const mainBox = await main.boundingBox();
      
      // Content should have reasonable max-width
      expect(mainBox.width).toBeLessThan(1200); // Should not exceed reasonable reading width
    });
  });

  test.describe('Component Responsiveness', () => {
    test('should make demo grids responsive', async ({ simpleMorphPage }) => {
      const demoGrid = simpleMorphPage.locator('.demo-grid').first();
      
      // Desktop: should have 2 columns
      await simpleMorphPage.setViewportSize({ width: 1200, height: 800 });
      let gridColumns = await demoGrid.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      expect(gridColumns).toBe('1fr 1fr');
      
      // Mobile: should have 1 column
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      await simpleMorphPage.waitForTimeout(100);
      gridColumns = await demoGrid.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      expect(gridColumns).toBe('1fr');
    });

    test('should make feature grids responsive', async ({ simpleMorphPage }) => {
      const featureGrid = simpleMorphPage.locator('.feature-grid').first();
      
      // Desktop: should use auto-fit with min 250px
      await simpleMorphPage.setViewportSize({ width: 1200, height: 800 });
      let gridColumns = await featureGrid.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      expect(gridColumns).toContain('250px'); // Should have min 250px columns
      
      // Mobile: should adapt to smaller screen
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      await simpleMorphPage.waitForTimeout(100);
      gridColumns = await featureGrid.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      // Should still work but with fewer columns
      expect(gridColumns).toBeTruthy();
    });

    test('should make table of contents responsive', async ({ simpleMorphPage }) => {
      const toc = simpleMorphPage.locator('nav.toc');
      const tocList = toc.locator('ul');
      
      // Desktop: should have 2 columns
      await simpleMorphPage.setViewportSize({ width: 1200, height: 800 });
      let gridColumns = await tocList.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      expect(gridColumns).toBe('1fr 1fr');
      
      // Mobile: should have 1 column
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      await simpleMorphPage.waitForTimeout(100);
      gridColumns = await tocList.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      expect(gridColumns).toBe('1fr');
      
      // TOC should not be sticky on mobile
      const tocPosition = await toc.evaluate((el) => {
        return window.getComputedStyle(el).position;
      });
      expect(tocPosition).toBe('static');
    });

    test('should adjust typography for mobile', async ({ simpleMorphPage }) => {
      // Desktop font sizes
      await simpleMorphPage.setViewportSize({ width: 1200, height: 800 });
      const h1Desktop = await simpleMorphPage.locator('h1').first().evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      
      // Mobile font sizes
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      await simpleMorphPage.waitForTimeout(100);
      const h1Mobile = await simpleMorphPage.locator('h1').first().evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      
      // Mobile should have smaller font size
      const desktopSize = parseFloat(h1Desktop);
      const mobileSize = parseFloat(h1Mobile);
      expect(mobileSize).toBeLessThan(desktopSize);
      expect(mobileSize).toBe(40); // 2.5rem = 40px
    });
  });

  test.describe('Touch and Mobile Interactions', () => {
    test('should handle touch interactions on mobile', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      // Test mobile menu touch interaction
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      
      // Simulate touch tap
      await mobileMenuToggle.tap();
      
      const mobileMenu = simpleMorphPage.locator('.mobile-menu');
      await expect(mobileMenu).toHaveClass(/show/);
    });

    test('should have appropriate touch targets', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      // Check mobile menu toggle size (should be at least 44px for accessibility)
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      const toggleBox = await mobileMenuToggle.boundingBox();
      
      expect(toggleBox.width).toBeGreaterThanOrEqual(44);
      expect(toggleBox.height).toBeGreaterThanOrEqual(44);
      
      // Check button sizes
      const buttons = simpleMorphPage.locator('button, .button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const buttonBox = await button.boundingBox();
        if (buttonBox) {
          expect(buttonBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });

  test.describe('Orientation Changes', () => {
    test('should handle portrait to landscape orientation', async ({ simpleMorphPage }) => {
      // Start in portrait
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      await simpleMorphPage.waitForTimeout(100);
      
      // Verify mobile layout
      const mobileMenuToggle = simpleMorphPage.locator('.mobile-menu-toggle');
      await expect(mobileMenuToggle).toBeVisible();
      
      // Switch to landscape
      await simpleMorphPage.setViewportSize({ width: 667, height: 375 });
      await simpleMorphPage.waitForTimeout(100);
      
      // Should still be in mobile mode but layout should adapt
      await expect(mobileMenuToggle).toBeVisible();
      
      // Content should still be readable
      const main = simpleMorphPage.locator('main');
      await expect(main).toBeVisible();
    });
  });

  test.describe('Content Overflow and Scrolling', () => {
    test('should handle horizontal overflow correctly', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 320, height: 568 }); // Very narrow
      
      // Body should not have horizontal scroll
      const bodyOverflowX = await simpleMorphPage.evaluate(() => {
        return window.getComputedStyle(document.body).overflowX;
      });
      expect(bodyOverflowX).toBe('hidden');
      
      // Check that content doesn't cause horizontal scroll
      const scrollWidth = await simpleMorphPage.evaluate(() => document.body.scrollWidth);
      const clientWidth = await simpleMorphPage.evaluate(() => document.body.clientWidth);
      
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance
    });

    test('should make tables responsive', async ({ simpleMorphPage }) => {
      await simpleMorphPage.setViewportSize({ width: 375, height: 667 });
      
      const tableSection = simpleMorphPage.locator('#tables');
      await tableSection.scrollIntoViewIfNeeded();
      
      const table = simpleMorphPage.locator('table').first();
      const tableBox = await table.boundingBox();
      
      // Table should fit within viewport
      expect(tableBox.width).toBeLessThanOrEqual(375);
    });
  });

  test.describe('High DPI and Retina Displays', () => {
    test('should render correctly on high DPI displays', async ({ simpleMorphPage }) => {
      // Simulate high DPI display
      await simpleMorphPage.setViewportSize({ width: 1920, height: 1080 });
      await simpleMorphPage.evaluate(() => {
        // Simulate device pixel ratio of 2
        Object.defineProperty(window, 'devicePixelRatio', {
          writable: false,
          value: 2,
        });
      });
      
      // Check that glassmorphism effects still work
      const glassElement = simpleMorphPage.locator('.glass').first();
      await expect(glassElement).toHaveGlassmorphism();
      
      // Check that text is crisp
      const heading = simpleMorphPage.locator('h1').first();
      const textRendering = await heading.evaluate((el) => {
        return window.getComputedStyle(el).textRendering;
      });
      // Should have optimized text rendering
      expect(['optimizeLegibility', 'auto']).toContain(textRendering);
    });
  });
});
