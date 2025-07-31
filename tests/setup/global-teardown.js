// Global teardown for Playwright tests

async function globalTeardown(config) {
  console.log('🧹 Running global teardown...');
  
  // Clean up any global resources if needed
  // For now, just log completion
  
  console.log('✅ Global teardown completed');
}

module.exports = globalTeardown;
