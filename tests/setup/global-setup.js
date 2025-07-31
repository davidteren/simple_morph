// Global setup for Playwright tests
const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('🚀 Starting global setup for Simple Morph tests...');

  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for the web server to be ready
    console.log('⏳ Waiting for web server...');
    const baseURL = config.use?.baseURL || 'http://localhost:3000';
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    // Verify that Simple Morph is loaded
    await page.waitForFunction(() => window.SimpleMorph !== undefined, { timeout: 10000 });
    console.log('✅ Simple Morph framework loaded successfully');
    
    // Check for critical CSS features
    const hasBackdropFilter = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.backdropFilter = 'blur(10px)';
      return testEl.style.backdropFilter !== '';
    });
    
    const hasGrid = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.display = 'grid';
      return testEl.style.display === 'grid';
    });
    
    console.log(`🔍 Browser capabilities:`);
    console.log(`   - backdrop-filter: ${hasBackdropFilter ? '✅' : '❌'}`);
    console.log(`   - CSS Grid: ${hasGrid ? '✅' : '❌'}`);
    
    // Store capabilities for tests
    process.env.HAS_BACKDROP_FILTER = hasBackdropFilter.toString();
    process.env.HAS_CSS_GRID = hasGrid.toString();
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('✅ Global setup completed successfully');
}

module.exports = globalSetup;
