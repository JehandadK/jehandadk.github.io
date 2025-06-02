# 📸 Visual Testing System

This portfolio includes a comprehensive visual testing system for capturing screenshots and GIFs across different devices and themes using a unified, efficient approach.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Capture All Visual Assets
```bash
npm run test:visual
```

This will:
- Automatically start the dev server if needed
- Create screenshots across all device sizes and themes
- Generate GIFs of animations and interactions
- Launch a preview gallery with version comparison
- Use a single browser instance for optimal performance

## 📋 Available Commands

### Unified Capture System
```bash
# Complete visual capture workflow (recommended)
npm run test:visual

# Capture screenshots and GIFs only
npm run capture:all
# or
npm run capture:unified

# View results in gallery with version comparison
npm run preview:screenshots
```

## 🎯 Features

### Automated Screenshot Capture
- **5 Device Sizes**: Mobile, Tablet, Laptop, Desktop, Large
- **2 Themes**: Light and Dark mode
- **3 Screenshot Types**: Full page, Hero section, Mobile view
- **Smart Theme Detection**: Multiple fallback methods for reliable theme switching

### Animated GIF Capture
- **Theme Toggle Animation**: Records the dark/light mode transition
- **Device-Specific**: Captures on both desktop and mobile viewports
- **High Quality**: WebM format for optimal file size and quality

### Enhanced Preview Gallery
- **Version Comparison**: Side-by-side comparison of different capture runs
- **Responsive Design**: Works perfectly on all screen sizes
- **Download Support**: Easy download of any screenshot or GIF
- **Metadata Display**: Shows capture details, file sizes, and timestamps

## 📁 Output Structure

```
temp/
├── v1/
│   ├── metadata.json
│   ├── mobile-light-full-page.png
│   ├── mobile-dark-hero-section.png
│   ├── desktop-light-mobile-view.png
│   ├── theme-toggle-desktop.webm
│   ├── theme-toggle-mobile.webm
│   └── ...
├── v2/
│   ├── metadata.json
│   └── ...
└── ...
```

## 🔧 Technical Details

### Performance Optimizations
- **Shared Browser Instance**: Single Puppeteer browser for all captures
- **Automatic Server Management**: Starts dev server only if needed
- **Efficient Theme Switching**: Multiple methods with fallbacks
- **Versioned Output**: Organized by capture run for easy comparison

### Browser Configuration
- **Realistic User Agents**: Device-specific user agents for accurate rendering
- **Proper Viewport Sizes**: Matches real device dimensions
- **Network Idle**: Waits for complete page load including async content
- **Animation Ready**: Allows time for particles and animations to initialize

## 🎨 Customization

### Adding New Devices
Edit the `devices` array in `scripts/capture-all.js`:

```javascript
const devices = [
  {
    name: 'your-device',
    width: 1920,
    height: 1080,
    userAgent: 'Your User Agent String'
  }
];
```

### Adding New Screenshot Types
Edit the `screenshotTypes` array in `scripts/capture-all.js`:

```javascript
const screenshotTypes = [
  {
    name: 'your-type',
    description: 'Your description',
    selector: '.your-selector', // optional
    fullPage: true // or false
  }
];
```

### Adding New Animation Scenarios
Edit the `animationScenarios` array in `scripts/capture-all.js`:

```javascript
const animationScenarios = [
  {
    name: 'your-animation',
    description: 'Your animation description',
    actions: async (page) => {
      // Your custom actions
      await page.click('.your-button');
      await page.waitForTimeout(2000);
    }
  }
];
```

## 🐛 Troubleshooting

### Theme Toggle Not Working
- The system uses multiple fallback methods for theme detection
- Check browser console for theme-related errors
- Ensure your theme toggle component is properly implemented

### Server Not Starting
- Make sure port 4005 is available
- Check if another dev server is already running
- Verify your Next.js configuration

### Screenshots Look Different
- Clear browser cache and restart the capture
- Check if there are any console errors during capture
- Ensure all fonts and assets are properly loaded

### Performance Issues
- The unified system is much faster than individual scripts
- If still slow, check your system resources
- Consider reducing the number of devices or screenshot types

## 📊 Version Comparison

The preview gallery now includes powerful version comparison features:

1. **Select Versions**: Choose any two versions from the dropdown menus
2. **Side-by-Side View**: Compare screenshots in a responsive grid layout
3. **Visual Regression Testing**: Easily spot differences between versions
4. **API Integration**: Dynamic loading of version data for smooth performance

This makes it easy to:
- Track visual changes over time
- Identify regressions in design or functionality
- Document the evolution of your portfolio
- Share visual comparisons with others
