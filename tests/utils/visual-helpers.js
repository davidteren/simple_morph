// Visual testing utilities for Simple Morph

class VisualHelpers {
  /**
   * Wait for animations to complete
   * @param {Page} page - Playwright page object
   * @param {number} timeout - Timeout in milliseconds
   */
  static async waitForAnimations(page, timeout = 2000) {
    // Wait for CSS animations and transitions to complete
    await page.waitForFunction(() => {
      const animations = document.getAnimations();
      return animations.every(animation => 
        animation.playState === 'finished' || 
        animation.playState === 'idle'
      );
    }, { timeout });
  }

  /**
   * Disable animations for consistent screenshots
   * @param {Page} page - Playwright page object
   */
  static async disableAnimations(page) {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0ms !important;
        }
      `
    });
  }

  /**
   * Enable animations (reverse of disableAnimations)
   * @param {Page} page - Playwright page object
   */
  static async enableAnimations(page) {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: revert !important;
          animation-iteration-count: revert !important;
          transition-duration: revert !important;
          transition-delay: revert !important;
        }
      `
    });
  }

  /**
   * Take a screenshot with consistent settings
   * @param {Page} page - Playwright page object
   * @param {string} name - Screenshot name
   * @param {Object} options - Screenshot options
   */
  static async takeScreenshot(page, name, options = {}) {
    // Wait for page to be stable
    await page.waitForLoadState('networkidle');
    await this.waitForAnimations(page);
    
    const defaultOptions = {
      fullPage: true,
      animations: 'disabled',
      ...options
    };
    
    return await page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      ...defaultOptions
    });
  }

  /**
   * Compare visual elements across different viewports
   * @param {Page} page - Playwright page object
   * @param {string} selector - CSS selector for element
   * @param {Array} viewports - Array of viewport configurations
   */
  static async compareAcrossViewports(page, selector, viewports) {
    const screenshots = {};
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(100); // Allow layout to settle
      await this.waitForAnimations(page);
      
      const element = page.locator(selector);
      screenshots[`${viewport.width}x${viewport.height}`] = 
        await element.screenshot({ animations: 'disabled' });
    }
    
    return screenshots;
  }

  /**
   * Test glassmorphism effect visibility
   * @param {Page} page - Playwright page object
   * @param {string} selector - CSS selector for glass element
   */
  static async testGlassmorphism(page, selector) {
    const element = page.locator(selector);
    
    const styles = await element.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backdropFilter: computed.backdropFilter,
        background: computed.backgroundColor,
        border: computed.border,
        boxShadow: computed.boxShadow
      };
    });
    
    return {
      hasBackdropFilter: styles.backdropFilter && styles.backdropFilter !== 'none',
      hasTransparentBg: styles.background.includes('rgba') || styles.background === 'transparent',
      hasBorder: styles.border && styles.border !== 'none',
      hasBoxShadow: styles.boxShadow && styles.boxShadow !== 'none'
    };
  }

  /**
   * Test hover effects
   * @param {Page} page - Playwright page object
   * @param {string} selector - CSS selector for hoverable element
   */
  static async testHoverEffect(page, selector) {
    const element = page.locator(selector);
    
    // Get initial state
    const initialStyles = await element.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        transform: computed.transform,
        boxShadow: computed.boxShadow,
        background: computed.background
      };
    });
    
    // Hover and get hover state
    await element.hover();
    await page.waitForTimeout(300); // Wait for transition
    
    const hoverStyles = await element.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        transform: computed.transform,
        boxShadow: computed.boxShadow,
        background: computed.background
      };
    });
    
    return {
      initial: initialStyles,
      hover: hoverStyles,
      hasTransformChange: initialStyles.transform !== hoverStyles.transform,
      hasShadowChange: initialStyles.boxShadow !== hoverStyles.boxShadow,
      hasBackgroundChange: initialStyles.background !== hoverStyles.background
    };
  }
}

module.exports = VisualHelpers;
