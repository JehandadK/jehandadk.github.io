const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const { spawn, exec } = require('child_process');
const net = require('net');

// Configuration
const PORT = 4005;
const baseUrl = `http://localhost:${PORT}`;

const devices = [
  {
    name: 'mobile',
    width: 375,
    height: 667,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  },
  {
    name: 'tablet',
    width: 768,
    height: 1024,
    userAgent:
      'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  },
  {
    name: 'laptop',
    width: 1366,
    height: 768,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
  {
    name: 'desktop',
    width: 1440,
    height: 900,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
  {
    name: 'large',
    width: 1920,
    height: 1080,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
];

const screenshotTypes = [
  { name: 'full-page', description: 'Full page screenshot' },
  {
    name: 'hero-section',
    description: 'Hero section only',
    selector: 'header, .hero, [data-testid="hero"]',
  },
  { name: 'mobile-view', description: 'Mobile viewport screenshot' },
];

const themes = ['light', 'dark'];

const animationScenarios = [
  {
    name: 'theme-toggle',
    description: 'Theme switching animation',
    actions: async (page) => {
      await page.waitForTimeout(2000);

      // Find theme toggle button - DarkModeSwitch creates an SVG button
      const themeToggle = await page.$(
        'svg[role="button"], button svg, [class*="DarkModeSwitch"], svg[class*="text-gray"]',
      );
      if (themeToggle) {
        console.log('    Found theme toggle, clicking...');
        await themeToggle.click();
        await page.waitForTimeout(2000);
      } else {
        // Fallback: try clicking any clickable SVG in the navigation area
        const navSvg = await page.$('nav svg, header svg, .navbar svg');
        if (navSvg) {
          console.log('    Found navigation SVG, trying click...');
          await navSvg.click();
          await page.waitForTimeout(2000);
        } else {
          console.log(
            '    Theme toggle button not found, capturing static view',
          );
          await page.waitForTimeout(2000);
        }
      }
    },
  },
];

// Utility functions
function getNextVersionIndex() {
  const tempDir = path.join('temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    return 1;
  }

  const versions = fs
    .readdirSync(tempDir)
    .filter((dir) => fs.statSync(path.join(tempDir, dir)).isDirectory())
    .filter((dir) => /^v\d+$/.test(dir))
    .map((dir) => parseInt(dir.substring(1), 10))
    .sort((a, b) => b - a);

  return versions.length > 0 ? versions[0] + 1 : 1;
}

function createVersionMetadata(versionIndex, outputDir) {
  const metadata = {
    version: versionIndex,
    timestamp: new Date().toISOString(),
    devices: devices.map((d) => ({
      name: d.name,
      width: d.width,
      height: d.height,
    })),
    themes,
    screenshotTypes,
    animationScenarios,
    baseUrl,
    totalScreenshots: devices.length * themes.length * screenshotTypes.length,
    totalGifs: animationScenarios.length * 2, // desktop + mobile
    hasGifs: true,
  };

  fs.writeFileSync(
    path.join(outputDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2),
  );

  return metadata;
}

// Check if port is available
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
}

// Start development server
function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log(` Starting development server on port ${PORT}...`);

    const server = spawn('npm', ['run', 'dev'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd(),
    });

    let serverReady = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Server:', output.trim());

      // Check for various Next.js ready messages
      if (
        (output.includes('ready') && output.includes(PORT.toString())) ||
        output.includes('Local:') ||
        output.includes('started server')
      ) {
        if (!serverReady) {
          serverReady = true;
          console.log(' Development server is ready!');
          resolve(server);
        }
      }
    });

    server.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    server.on('error', (error) => {
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverReady) {
        console.log(' Server startup timeout, proceeding anyway...');
        resolve(server);
      }
    }, 30000);
  });
}

// Improved theme switching function
async function setTheme(page, targetTheme) {
  console.log(`    Setting theme to: ${targetTheme}`);

  // Method 1: Set localStorage and trigger React theme context
  await page.evaluate((theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);

      // Apply theme class to document
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Trigger storage event for React components
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'theme',
          newValue: theme,
          oldValue: localStorage.getItem('theme'),
        }),
      );

      // Trigger custom theme change event if available
      window.dispatchEvent(
        new CustomEvent('themeChange', { detail: { theme } }),
      );
    }
  }, targetTheme);

  // Wait for React to process the theme change
  await page.waitForTimeout(1000);

  // Method 2: Check current theme and click toggle if needed
  const currentTheme = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
  });

  if (currentTheme !== targetTheme) {
    console.log(
      `    Current theme: ${currentTheme}, target: ${targetTheme}, trying toggle...`,
    );

    // Try multiple selectors for the DarkModeSwitch
    const selectors = [
      'svg[role="button"]',
      'button svg',
      '[class*="DarkModeSwitch"]',
      'svg[class*="text-gray"]',
      'nav svg',
      'header svg',
    ];

    let clicked = false;
    for (const selector of selectors) {
      const element = await page.$(selector);
      if (element) {
        try {
          await element.click();
          clicked = true;
          console.log(`    Clicked theme toggle using selector: ${selector}`);
          break;
        } catch (error) {
          console.log(`    Failed to click ${selector}:`, error.message);
        }
      }
    }

    if (!clicked) {
      console.log(`    Could not find clickable theme toggle`);
    }

    await page.waitForTimeout(1000);
  }

  // Method 3: Force theme application if still not correct
  const finalTheme = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
  });

  if (finalTheme !== targetTheme) {
    console.log(
      `    Theme mismatch detected, forcing theme application...`,
    );
    await page.evaluate((theme) => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }, targetTheme);

    await page.waitForTimeout(1000);
  }

  // Final verification
  const verifiedTheme = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
  });

  console.log(`    Final theme state: ${verifiedTheme}`);
  return verifiedTheme === targetTheme;
}

// Capture screenshots with shared browser
async function captureScreenshots(browser, outputDir) {
  console.log('\n Starting screenshot capture...');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let capturedCount = 0;
  const totalScreenshots =
    devices.length * themes.length * screenshotTypes.length;

  try {
    for (const device of devices) {
      console.log(
        `\n Device: ${device.name} (${device.width}x${device.height})`,
      );

      for (const theme of themes) {
        console.log(`  Theme: ${theme}`);

        const page = await browser.newPage();
        await page.setUserAgent(device.userAgent);
        await page.setViewport({ width: device.width, height: device.height });

        // Navigate to base URL first
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });

        // Set theme properly
        const themeSet = await setTheme(page, theme);
        if (!themeSet) {
          console.log(`    Warning: Theme might not be set correctly`);
        }

        // Wait for animations and particles to load
        await page.waitForTimeout(3000);

        for (const screenshotType of screenshotTypes) {
          try {
            const filename = `${device.name}-${theme}-${screenshotType.name}.png`;
            const filepath = path.join(outputDir, filename);

            if (screenshotType.name === 'full-page') {
              await page.screenshot({
                path: filepath,
                fullPage: true,
              });
            } else if (
              screenshotType.name === 'hero-section' &&
              screenshotType.selector
            ) {
              const element = await page.$(screenshotType.selector);
              if (element) {
                await element.screenshot({ path: filepath });
              } else {
                await page.screenshot({ path: filepath });
              }
            } else if (screenshotType.name === 'mobile-view') {
              await page.screenshot({ path: filepath });
            }

            capturedCount++;
            console.log(
              `    ${screenshotType.name} (${capturedCount}/${totalScreenshots})`,
            );
          } catch (error) {
            console.error(
              `    Failed to capture ${screenshotType.name}:`,
              error.message,
            );
          }
        }

        await page.close();
      }
    }

    console.log(
      `\n Screenshot capture completed! ${capturedCount}/${totalScreenshots} screenshots saved.`,
    );
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    throw error;
  }
}

// Capture GIFs with shared browser
async function captureGIFs(browser, outputDir) {
  console.log('\n Starting GIF capture...');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const devicesToCapture = ['desktop', 'mobile'];

  for (const deviceName of devicesToCapture) {
    const device = devices.find((d) => d.name === deviceName) || devices[3]; // fallback to desktop

    for (const scenario of animationScenarios) {
      console.log(`Recording: ${scenario.name} (${deviceName})`);

      try {
        const page = await browser.newPage();
        await page.setViewport({ width: device.width, height: device.height });
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });

        const timestamp = new Date()
          .toISOString()
          .replace(/[:.]/g, '-')
          .slice(0, -5);
        const filename = `${scenario.name}-${deviceName}-${timestamp}.webm`;
        const filepath = path.join(outputDir, filename);

        const recorder = new PuppeteerScreenRecorder(page, {
          followNewTab: false,
          fps: 30,
          videoFrame: {
            width: device.width,
            height: device.height,
          },
        });

        await recorder.start(filepath);
        await scenario.actions(page);
        await recorder.stop();
        await page.close();

        console.log(`    ${filename} saved`);
      } catch (error) {
        console.error(
          `    Failed to capture ${scenario.name} for ${deviceName}:`,
          error.message,
        );
      }
    }
  }

  console.log('\n GIF capture completed!');
}

// Main execution
async function main() {
  let devServer = null;
  let browser = null;

  try {
    // Check if port is available and start server if needed
    const portAvailable = await checkPort(PORT);
    if (portAvailable) {
      devServer = await startDevServer();
      // Wait a bit more for server to be fully ready
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } else {
      console.log(` Server already running on port ${PORT}`);
    }

    // Setup directories
    const versionIndex = getNextVersionIndex();
    const versionDir = `v${versionIndex}`;
    const outputDir = path.join('temp', versionDir);

    fs.mkdirSync(outputDir, { recursive: true });
    const metadata = createVersionMetadata(versionIndex, outputDir);

    console.log(`\n Starting unified visual capture`);
    console.log(` Output: ${outputDir}`);
    console.log(` Target: ${baseUrl}`);
    console.log(
      ` Plan: ${metadata.totalScreenshots} screenshots + ${metadata.totalGifs} GIFs`,
    );

    // Launch browser once
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // Capture screenshots and GIFs with shared browser
    await captureScreenshots(browser, outputDir);
    await captureGIFs(browser, outputDir);

    console.log(`\n All captures completed successfully!`);
    console.log(` Files saved in: ${outputDir}`);
    console.log(` Run "npm run preview:screenshots" to view results`);
  } catch (error) {
    console.error('Capture failed:', error);
    process.exit(1);
  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
    }
    if (devServer) {
      console.log(' Stopping development server...');
      devServer.kill();
    }
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, captureScreenshots, captureGIFs };
