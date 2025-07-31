#!/usr/bin/env node

/**
 * Test Runner for Simple Morph Framework
 * Provides convenient commands for running different test suites
 */

const { spawn } = require('child_process');
const path = require('path');

// Test suite configurations
const TEST_SUITES = {
  visual: {
    description: 'Visual regression tests',
    command: 'playwright test --grep @visual',
    projects: ['chromium', 'firefox', 'webkit']
  },
  functional: {
    description: 'JavaScript functionality tests',
    command: 'playwright test --grep @functional',
    projects: ['chromium', 'firefox', 'webkit']
  },
  responsive: {
    description: 'Responsive design tests',
    command: 'playwright test --grep @responsive',
    projects: ['Mobile Chrome', 'iPad', 'Desktop Chrome', 'Desktop 4K']
  },
  accessibility: {
    description: 'Accessibility and WCAG compliance tests',
    command: 'playwright test --grep @accessibility',
    projects: ['chromium']
  },
  'cross-browser': {
    description: 'Cross-browser compatibility tests',
    command: 'playwright test --grep @cross-browser',
    projects: ['chromium', 'firefox', 'webkit']
  },
  polyfills: {
    description: 'Polyfill and fallback tests',
    command: 'playwright test --grep @polyfills',
    projects: ['Legacy Chrome', 'chromium']
  },
  mobile: {
    description: 'Mobile device testing',
    command: 'playwright test',
    projects: ['Mobile Chrome', 'Mobile Safari', 'iPhone SE', 'iPhone 13', 'Samsung Galaxy S21']
  },
  tablet: {
    description: 'Tablet device testing',
    command: 'playwright test',
    projects: ['iPad', 'iPad Mini', 'Surface Pro 7']
  },
  desktop: {
    description: 'Desktop resolution testing',
    command: 'playwright test',
    projects: ['Desktop 1024', 'Desktop 1366', 'Desktop 1920', 'Desktop 4K']
  },
  all: {
    description: 'Run all tests',
    command: 'playwright test',
    projects: []
  }
};

// Device categories for comprehensive testing
const DEVICE_CATEGORIES = {
  mobile: ['Mobile Chrome', 'Mobile Safari', 'iPhone SE', 'iPhone 13', 'Samsung Galaxy S21'],
  tablet: ['iPad', 'iPad Mini'],
  desktop: ['Desktop Chrome', 'Desktop 1024', 'Desktop 1366', 'Desktop 1920']
};

function printUsage() {
  console.log('\n🧪 Simple Morph Test Runner\n');
  console.log('Usage: node run-tests.js [suite] [options]\n');
  console.log('Available test suites:');
  
  Object.entries(TEST_SUITES).forEach(([name, config]) => {
    console.log(`  ${name.padEnd(15)} - ${config.description}`);
  });
  
  console.log('\nOptions:');
  console.log('  --headed        Run tests in headed mode');
  console.log('  --debug         Run tests in debug mode');
  console.log('  --ui            Run tests with UI mode');
  console.log('  --report        Show test report after completion');
  console.log('  --project=name  Run tests on specific project only');
  console.log('  --help          Show this help message');
  
  console.log('\nExamples:');
  console.log('  node run-tests.js visual --headed');
  console.log('  node run-tests.js responsive --project="Mobile Chrome"');
  console.log('  node run-tests.js all --report');
  console.log('');
}

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running: ${command} ${args.join(' ')}\n`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runTestSuite(suiteName, options = {}) {
  const suite = TEST_SUITES[suiteName];
  
  if (!suite) {
    console.error(`❌ Unknown test suite: ${suiteName}`);
    printUsage();
    process.exit(1);
  }
  
  console.log(`\n📋 Running ${suite.description}...`);
  
  // Build command arguments
  const args = suite.command.split(' ').slice(1); // Remove 'playwright'
  
  // Add project filters
  if (options.project) {
    args.push('--project', options.project);
  } else if (suite.projects.length > 0) {
    suite.projects.forEach(project => {
      args.push('--project', project);
    });
  }
  
  // Add options
  if (options.headed) args.push('--headed');
  if (options.debug) args.push('--debug');
  if (options.ui) args.push('--ui');
  
  try {
    await runCommand('npx playwright test', args);
    
    if (options.report) {
      console.log('\n📊 Opening test report...');
      await runCommand('npx playwright show-report');
    }
    
    console.log(`\n✅ ${suite.description} completed successfully!`);
  } catch (error) {
    console.error(`\n❌ ${suite.description} failed:`, error.message);
    process.exit(1);
  }
}

async function installBrowsers() {
  console.log('\n📦 Installing Playwright browsers...');
  try {
    await runCommand('npx playwright install');
    console.log('\n✅ Browsers installed successfully!');
  } catch (error) {
    console.error('\n❌ Failed to install browsers:', error.message);
    process.exit(1);
  }
}

async function generateReport() {
  console.log('\n📊 Generating comprehensive test report...');
  try {
    await runCommand('npx playwright show-report');
  } catch (error) {
    console.error('\n❌ Failed to generate report:', error.message);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  let suiteName = 'all';
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else if (arg === '--headed') {
      options.headed = true;
    } else if (arg === '--debug') {
      options.debug = true;
    } else if (arg === '--ui') {
      options.ui = true;
    } else if (arg === '--report') {
      options.report = true;
    } else if (arg.startsWith('--project=')) {
      options.project = arg.split('=')[1];
    } else if (arg === '--install') {
      return { action: 'install' };
    } else if (arg === '--report-only') {
      return { action: 'report' };
    } else if (!arg.startsWith('--')) {
      suiteName = arg;
    }
  }
  
  return { action: 'test', suiteName, options };
}

// Main execution
async function main() {
  const { action, suiteName, options } = parseArgs();
  
  console.log('🎭 Simple Morph Test Suite');
  console.log('==========================');
  
  try {
    switch (action) {
      case 'install':
        await installBrowsers();
        break;
      case 'report':
        await generateReport();
        break;
      case 'test':
        await runTestSuite(suiteName, options);
        break;
      default:
        printUsage();
    }
  } catch (error) {
    console.error('\n💥 Unexpected error:', error.message);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Test execution interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n⏹️  Test execution terminated');
  process.exit(0);
});

if (require.main === module) {
  main();
}

module.exports = { runTestSuite, TEST_SUITES, DEVICE_CATEGORIES };
