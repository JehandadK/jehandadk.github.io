const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const PORT = 3001;
const TEMP_DIR = path.join(process.cwd(), 'temp');

// Global versions data
let versionsData = [];

// Load versions data
function loadVersionsData() {
  const visualDir = path.join(TEMP_DIR);

  if (fs.existsSync(visualDir)) {
    versionsData = fs
      .readdirSync(visualDir)
      .filter((dir) => fs.statSync(path.join(visualDir, dir)).isDirectory())
      .filter((dir) => /^v\d+$/.test(dir))
      .map((dir) => {
        const versionPath = path.join(visualDir, dir);
        const metadataPath = path.join(versionPath, 'metadata.json');
        let metadata = {};

        if (fs.existsSync(metadataPath)) {
          try {
            metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          } catch (e) {
            console.warn(`Failed to read metadata for ${dir}:`, e.message);
          }
        }

        const files = fs.readdirSync(versionPath);
        const screenshots = files.filter(
          (f) => f.endsWith('.png') || f.endsWith('.jpg'),
        );
        const gifs = files.filter(
          (f) =>
            f.endsWith('.webm') || f.endsWith('.mp4') || f.endsWith('.gif'),
        );

        return {
          version: dir,
          path: versionPath,
          metadata,
          screenshots: screenshots.map((file) => ({
            name: file,
            path: `${dir}/${file}`,
            size: `${Math.round(
              fs.statSync(path.join(versionPath, file)).size / 1024,
            )} KB`,
          })),
          gifs: gifs.map((file) => ({
            name: file,
            path: `${dir}/${file}`,
            size: `${Math.round(
              fs.statSync(path.join(versionPath, file)).size / 1024,
            )} KB`,
          })),
        };
      })
      .sort((a, b) => {
        const aNum = parseInt(a.version.substring(1), 10);
        const bNum = parseInt(b.version.substring(1), 10);
        return bNum - aNum; // Latest first
      });
  }

  return versionsData;
}

// Generate HTML gallery for screenshots and GIFs
function generateGalleryHTML() {
  const versions = loadVersionsData();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Visual Testing Gallery</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            display: block;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .content {
            padding: 40px;
        }
        
        .version-controls {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border: 2px solid #e9ecef;
        }
        
        .version-controls h3 {
            margin-bottom: 15px;
            color: #495057;
            font-size: 1.2rem;
        }
        
        .controls-row {
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .control-group label {
            font-weight: 600;
            color: #495057;
            font-size: 0.9rem;
        }
        
        .control-group select, .control-group button {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 5px;
            font-size: 0.9rem;
            background: white;
        }
        
        .control-group button {
            background: #667eea;
            color: white;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .control-group button:hover {
            background: #5a67d8;
        }
        
        .control-group button:disabled {
            background: #adb5bd;
            cursor: not-allowed;
        }
        
        .comparison-view {
            display: none;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }
        
        .comparison-view.active {
            display: grid;
        }
        
        .comparison-side {
            border: 2px solid #e9ecef;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .comparison-header {
            background: #f8f9fa;
            padding: 15px;
            font-weight: 600;
            text-align: center;
            border-bottom: 1px solid #e9ecef;
        }
        
        .comparison-content {
            padding: 20px;
            max-height: 600px;
            overflow-y: auto;
        }
        
        .comparison-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .comparison-item {
            text-align: center;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
            background: white;
        }
        
        .comparison-item img, .comparison-item video {
            width: 100%;
            height: 150px;
            object-fit: cover;
        }
        
        .comparison-item-info {
            padding: 10px;
            font-size: 0.8rem;
            color: #6c757d;
        }

        .section {
            margin-bottom: 50px;
        }
        
        .section-title {
            font-size: 1.8rem;
            margin-bottom: 20px;
            color: #333;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .item {
            background: #f8f9fa;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .item img, .item video {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-bottom: 1px solid #e9ecef;
        }
        
        .item-info {
            padding: 15px;
        }
        
        .item-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            font-size: 0.9rem;
        }
        
        .item-meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            color: #666;
        }
        
        .download-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.8rem;
            margin-top: 10px;
            transition: background 0.3s ease;
        }
        
        .download-btn:hover {
            background: #5a67d8;
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }
        
        .empty-state h3 {
            margin-bottom: 10px;
            color: #333;
        }
        
        .filter-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .filter-tab {
            padding: 8px 16px;
            background: #e9ecef;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .filter-tab.active {
            background: #667eea;
            color: white;
        }
        
        .instructions {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 0 10px 10px 0;
        }
        
        .instructions h3 {
            color: #1976d2;
            margin-bottom: 10px;
        }
        
        .instructions ul {
            margin-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 5px;
            color: #333;
        }
        
        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            
            .stats {
                gap: 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📸 Portfolio Visual Testing Gallery</h1>
            <p>Screenshots and GIFs captured across different devices and themes</p>
            <div class="stats">
                <div class="stat">
                    <span class="stat-number">${versions.reduce((acc, version) => acc + version.screenshots.length, 0)}</span>
                    <span class="stat-label">Screenshots</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${versions.reduce((acc, version) => acc + version.gifs.length, 0)}</span>
                    <span class="stat-label">GIFs/Videos</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${versions.reduce((acc, version) => acc + version.screenshots.length + version.gifs.length, 0)}</span>
                    <span class="stat-label">Total Assets</span>
                </div>
            </div>
        </div>
        
        <div class="content">
            <div class="version-controls">
                <h3>Version Comparison</h3>
                <div class="controls-row">
                    <div class="control-group">
                        <label for="version-select-1">Version 1:</label>
                        <select id="version-select-1">
                            ${versions.map((version) => `<option value="${version.version}">${version.version}</option>`).join('')}
                        </select>
                    </div>
                    <div class="control-group">
                        <label for="version-select-2">Version 2:</label>
                        <select id="version-select-2">
                            ${versions.map((version) => `<option value="${version.version}">${version.version}</option>`).join('')}
                        </select>
                    </div>
                    <div class="control-group">
                        <button id="compare-btn" disabled>Compare</button>
                    </div>
                </div>
            </div>
            
            <div class="comparison-view" id="comparison-view">
                <div class="comparison-side">
                    <div class="comparison-header" id="comparison-header-1"></div>
                    <div class="comparison-content" id="comparison-content-1"></div>
                </div>
                <div class="comparison-side">
                    <div class="comparison-header" id="comparison-header-2"></div>
                    <div class="comparison-content" id="comparison-content-2"></div>
                </div>
            </div>
            
            ${versions
              .map(
                (version) => `
            <div class="section">
                <h2 class="section-title">
                    ${version.version} Screenshots
                </h2>
                <div class="grid">
                    ${version.screenshots
                      .map(
                        (screenshot) => `
                        <div class="item">
                            <img src="${screenshot.path}" alt="${screenshot.name}" loading="lazy">
                            <div class="item-info">
                                <div class="item-name">${screenshot.name}</div>
                                <div class="item-meta">
                                    <span>${screenshot.size}</span>
                                </div>
                                <button class="download-btn" onclick="downloadFile('${screenshot.path}', '${screenshot.name}')">
                                    ⬇️ Download
                                </button>
                            </div>
                        </div>
                    `,
                      )
                      .join('')}
                </div>
            </div>
            `,
              )
              .join('')}
            
            ${versions
              .map(
                (version) => `
            <div class="section">
                <h2 class="section-title">
                    ${version.version} GIFs & Videos
                </h2>
                <div class="grid">
                    ${version.gifs
                      .map(
                        (gif) => `
                        <div class="item">
                            <video controls muted loop>
                                <source src="${gif.path}" type="video/webm">
                                Your browser does not support the video tag.
                            </video>
                            <div class="item-info">
                                <div class="item-name">${gif.name}</div>
                                <div class="item-meta">
                                    <span>${gif.size}</span>
                                </div>
                                <button class="download-btn" onclick="downloadFile('${gif.path}', '${gif.name}')">
                                    ⬇️ Download
                                </button>
                            </div>
                        </div>
                    `,
                      )
                      .join('')}
                </div>
            </div>
            `,
              )
              .join('')}
        </div>
    </div>
    
    <script>
        const versionSelect1 = document.getElementById('version-select-1');
        const versionSelect2 = document.getElementById('version-select-2');
        const compareBtn = document.getElementById('compare-btn');
        const comparisonView = document.getElementById('comparison-view');
        const comparisonHeader1 = document.getElementById('comparison-header-1');
        const comparisonHeader2 = document.getElementById('comparison-header-2');
        const comparisonContent1 = document.getElementById('comparison-content-1');
        const comparisonContent2 = document.getElementById('comparison-content-2');
        
        compareBtn.addEventListener('click', () => {
            const version1 = versionSelect1.value;
            const version2 = versionSelect2.value;
            
            if (version1 === version2) {
                alert('Please select different versions for comparison');
                return;
            }
            
            comparisonView.classList.add('active');
            comparisonHeader1.textContent = version1;
            comparisonHeader2.textContent = version2;
            
            // Fetch version data from the server
            Promise.all([
                fetch('/api/version/' + version1).then(r => r.json()),
                fetch('/api/version/' + version2).then(r => r.json())
            ]).then(([version1Data, version2Data]) => {
                comparisonContent1.innerHTML = '';
                comparisonContent2.innerHTML = '';
                
                // Create comparison grid for version 1
                const grid1 = document.createElement('div');
                grid1.classList.add('comparison-grid');
                
                version1Data.screenshots.forEach(screenshot => {
                    const item = document.createElement('div');
                    item.classList.add('comparison-item');
                    item.innerHTML = \`
                        <img src="\${screenshot.path}" alt="\${screenshot.name}" loading="lazy">
                        <div class="comparison-item-info">
                            <span>\${screenshot.name}</span>
                        </div>
                    \`;
                    grid1.appendChild(item);
                });
                
                // Create comparison grid for version 2
                const grid2 = document.createElement('div');
                grid2.classList.add('comparison-grid');
                
                version2Data.screenshots.forEach(screenshot => {
                    const item = document.createElement('div');
                    item.classList.add('comparison-item');
                    item.innerHTML = \`
                        <img src="\${screenshot.path}" alt="\${screenshot.name}" loading="lazy">
                        <div class="comparison-item-info">
                            <span>\${screenshot.name}</span>
                        </div>
                    \`;
                    grid2.appendChild(item);
                });
                
                comparisonContent1.appendChild(grid1);
                comparisonContent2.appendChild(grid2);
            }).catch(error => {
                console.error('Failed to load version data:', error);
                alert('Failed to load version data for comparison');
            });
        });
        
        versionSelect1.addEventListener('change', () => {
            compareBtn.disabled = versionSelect1.value === versionSelect2.value;
        });
        
        versionSelect2.addEventListener('change', () => {
            compareBtn.disabled = versionSelect1.value === versionSelect2.value;
        });
        
        function downloadFile(path, filename) {
            const link = document.createElement('a');
            link.href = path;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    </script>
</body>
</html>
  `;
}

// Simple HTTP server to serve the gallery
function startServer() {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;

    // Serve the main gallery page
    if (pathname === '/' || pathname === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(generateGalleryHTML());
      return;
    }

    // Serve screenshots
    if (pathname.startsWith('/visual/')) {
      const filename = pathname.replace('/visual/', '');
      const filepath = path.join(TEMP_DIR, 'visual', filename);

      if (fs.existsSync(filepath)) {
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'image/png';
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        if (ext === '.webm') contentType = 'video/webm';
        if (ext === '.mp4') contentType = 'video/mp4';
        if (ext === '.gif') contentType = 'image/gif';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filepath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('File not found');
      }
      return;
    }

    // Serve version data
    if (pathname.startsWith('/api/version/')) {
      const versionName = pathname.replace('/api/version/', '');
      const versionData = versionsData.find((v) => v.version === versionName);

      if (versionData) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(versionData));
      } else {
        res.writeHead(404);
        res.end('Version not found');
      }
      return;
    }

    // 404 for other paths
    res.writeHead(404);
    res.end('Not found');
  });

  server.listen(PORT, () => {
    console.log('🖼️  Visual Testing Gallery');
    console.log('==========================');
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${TEMP_DIR}`);
    console.log('');
    console.log('💡 Press Ctrl+C to stop the server');

    // Try to open browser automatically (macOS)
    const { exec } = require('child_process');
    exec(`open http://localhost:${PORT}`, (error) => {
      if (error) {
        console.log('📝 Manually open: http://localhost:3001');
      }
    });
  });
}

// Main execution
function main() {
  if (!fs.existsSync(TEMP_DIR)) {
    console.log('❌ No temp directory found. Run capture commands first:');
    console.log('   npm run capture:screenshots');
    console.log('   npm run capture:gifs');
    return;
  }

  loadVersionsData();
  startServer();
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateGalleryHTML, startServer };
