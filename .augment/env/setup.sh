#!/bin/bash
set -e

echo "🚀 Setting up Simple Morph CSS Framework with Playwright Testing..."

# Install Node.js 18.x
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
node --version
npm --version

# Add Node.js to PATH in profile
echo 'export PATH="/usr/bin:$PATH"' >> $HOME/.profile

# Navigate to project directory
cd /mnt/persist/workspace

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm ci

# Create Playwright configuration
echo "⚙️ Creating Playwright configuration..."
cat > playwright.config.js << 'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
EOF

# Create tests directory
mkdir -p tests

# Create basic CSS framework test
echo "🧪 Creating CSS framework tests..."
cat > tests/css-framework.spec.js << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Simple Morph CSS Framework', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main page with framework styles', async ({ page }) => {
    // Check if the page loads
    await expect(page).toHaveTitle(/Simple Morph CSS Framework Demo/);
    
    // Check if main CSS is loaded
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verify dark theme background
    const bodyStyles = await body.evaluate(el => getComputedStyle(el));
    expect(bodyStyles.backgroundColor).toMatch(/rgb\(10, 10, 10\)|#0a0a0a/);
  });

  test('should have glassmorphism effects on cards', async ({ page }) => {
    const card = page.locator('.card').first();
    await expect(card).toBeVisible();
    
    // Check for glassmorphism properties
    const cardStyles = await card.evaluate(el => getComputedStyle(el));
    expect(cardStyles.backdropFilter).toContain('blur');
    expect(cardStyles.backgroundColor).toMatch(/rgba/);
  });

  test('should have responsive navigation', async ({ page }) => {
    // Check navbar exists
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();
    
    // Check mobile menu toggle exists
    const mobileToggle = page.locator('.mobile-menu-toggle');
    await expect(mobileToggle).toBeVisible();
  });

  test('should apply button styles correctly', async ({ page }) => {
    const primaryButton = page.locator('button').first();
    await expect(primaryButton).toBeVisible();
    
    const buttonStyles = await primaryButton.evaluate(el => getComputedStyle(el));
    expect(buttonStyles.borderRadius).toBeTruthy();
    expect(buttonStyles.padding).toBeTruthy();
  });
});
EOF

# Create JavaScript functionality test
echo "🧪 Creating JavaScript functionality tests..."
cat > tests/javascript-functionality.spec.js << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Simple Morph JavaScript Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should initialize the framework', async ({ page }) => {
    // Wait for JavaScript to load and initialize
    await page.waitForLoadState('networkidle');
    
    // Check if framework is initialized (look for console message)
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));
    
    await page.reload();
    await page.waitForTimeout(1000);
    
    expect(logs.some(log => log.includes('Nebula CSS Framework initialized'))).toBeTruthy();
  });

  test('should toggle mobile menu', async ({ page }) => {
    const mobileToggle = page.locator('.mobile-menu-toggle');
    const mobileMenu = page.locator('.mobile-menu');
    
    // Initially mobile menu should be hidden
    await expect(mobileMenu).not.toHaveClass(/active/);
    
    // Click toggle button
    await mobileToggle.click();
    
    // Menu should now be active
    await expect(mobileMenu).toHaveClass(/active/);
  });

  test('should handle tab interactions', async ({ page }) => {
    const tabButton = page.locator('.tab-button').first();
    const tabContent = page.locator('.tab-content').first();
    
    await expect(tabButton).toBeVisible();
    await expect(tabContent).toBeVisible();
    
    // Click tab button
    await tabButton.click();
    
    // Verify tab functionality
    await expect(tabButton).toHaveClass(/active/);
  });

  test('should apply hover effects on interactive elements', async ({ page }) => {
    const hoverCard = page.locator('.card.hover-glow').first();
    
    if (await hoverCard.count() > 0) {
      await expect(hoverCard).toBeVisible();
      
      // Hover over the card
      await hoverCard.hover();
      
      // Check if hover styles are applied (this is basic - real hover effects are hard to test)
      const cardStyles = await hoverCard.evaluate(el => getComputedStyle(el));
      expect(cardStyles.transition).toBeTruthy();
    }
  });
});
EOF

# Create responsive design test
echo "🧪 Creating responsive design tests..."
cat > tests/responsive-design.spec.js << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Simple Morph Responsive Design', () => {
  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu toggle is visible
    const mobileToggle = page.locator('.mobile-menu-toggle');
    await expect(mobileToggle).toBeVisible();
    
    // Check if main navigation is hidden on mobile
    const navbar = page.locator('.navbar-nav');
    const navStyles = await navbar.evaluate(el => getComputedStyle(el));
    expect(navStyles.display).toBe('none');
  });

  test('should be responsive on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Verify layout adapts to tablet size
    const container = page.locator('main');
    await expect(container).toBeVisible();
    
    const containerStyles = await container.evaluate(el => getComputedStyle(el));
    expect(containerStyles.maxWidth).toBeTruthy();
  });

  test('should be responsive on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    // Check if full navigation is visible
    const navbar = page.locator('.navbar-nav');
    await expect(navbar).toBeVisible();
    
    // Mobile toggle should be hidden on desktop
    const mobileToggle = page.locator('.mobile-menu-toggle');
    const toggleStyles = await mobileToggle.evaluate(el => getComputedStyle(el));
    expect(toggleStyles.display).toBe('none');
  });
});
EOF

# Create component functionality test
echo "🧪 Creating component functionality tests..."
cat > tests/components.spec.js << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Simple Morph Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render form elements with proper styling', async ({ page }) => {
    const input = page.locator('input[type="text"]').first();
    const button = page.locator('button').first();
    
    if (await input.count() > 0) {
      await expect(input).toBeVisible();
      const inputStyles = await input.evaluate(el => getComputedStyle(el));
      expect(inputStyles.borderRadius).toBeTruthy();
      expect(inputStyles.padding).toBeTruthy();
    }
    
    await expect(button).toBeVisible();
    const buttonStyles = await button.evaluate(el => getComputedStyle(el));
    expect(buttonStyles.borderRadius).toBeTruthy();
  });

  test('should render cards with glassmorphism effects', async ({ page }) => {
    const cards = page.locator('.card');
    const cardCount = await cards.count();
    
    expect(cardCount).toBeGreaterThan(0);
    
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      const card = cards.nth(i);
      await expect(card).toBeVisible();
      
      const cardStyles = await card.evaluate(el => getComputedStyle(el));
      expect(cardStyles.backdropFilter).toContain('blur');
      expect(cardStyles.borderRadius).toBeTruthy();
    }
  });

  test('should render badges with proper styling', async ({ page }) => {
    const badges = page.locator('.badge');
    const badgeCount = await badges.count();
    
    if (badgeCount > 0) {
      const badge = badges.first();
      await expect(badge).toBeVisible();
      
      const badgeStyles = await badge.evaluate(el => getComputedStyle(el));
      expect(badgeStyles.borderRadius).toBeTruthy();
      expect(badgeStyles.padding).toBeTruthy();
    }
  });

  test('should render tables with responsive design', async ({ page }) => {
    const table = page.locator('table').first();
    
    if (await table.count() > 0) {
      await expect(table).toBeVisible();
      
      const tableContainer = page.locator('.table-container').first();
      if (await tableContainer.count() > 0) {
        const containerStyles = await tableContainer.evaluate(el => getComputedStyle(el));
        expect(containerStyles.overflowX).toBe('auto');
      }
    }
  });
});
EOF

# Install Playwright system dependencies
echo "🔧 Installing Playwright system dependencies..."
sudo npx playwright install-deps

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install

# Add npx to PATH for the current session and profile
echo 'export PATH="./node_modules/.bin:$PATH"' >> $HOME/.profile
export PATH="./node_modules/.bin:$PATH"

# Verify Playwright installation
echo "✅ Verifying Playwright installation..."
npx playwright --version

echo "🎉 Setup complete! Simple Morph CSS Framework is ready for testing."
echo "📝 Test files created:"
echo "  - tests/css-framework.spec.js"
echo "  - tests/javascript-functionality.spec.js" 
echo "  - tests/responsive-design.spec.js"
echo "  - tests/components.spec.js"
echo "🚀 Run tests with: npx playwright test"