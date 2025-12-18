// Simple HTTP server untuk test Mini App locally
// Usage: cd mini-app && node server.js
// Or: node mini-app/server.js (from root)

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

// Get directory where server.js is located
// Determine if we're running from root or from mini-app/
const currentDir = process.cwd();
let SERVE_DIR;

// Check if index.html exists in current directory
if (fs.existsSync(path.join(currentDir, 'index.html'))) {
    // We're in mini-app/ directory
    SERVE_DIR = currentDir;
} else if (fs.existsSync(path.join(currentDir, 'mini-app', 'index.html'))) {
    // We're in root, serve from mini-app/
    SERVE_DIR = path.join(currentDir, 'mini-app');
} else {
    // Fallback: assume we're in mini-app/
    SERVE_DIR = currentDir;
}

console.log(`Serving from: ${SERVE_DIR}`);
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Parse URL
    let filePath = path.join(SERVE_DIR, req.url);
    if (req.url === '/' || req.url === '') {
        filePath = path.join(SERVE_DIR, 'index.html');
    }
    
    // Remove query string
    filePath = filePath.split('?')[0];
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(SERVE_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('<h1>403 - Forbidden</h1>', 'utf-8');
        return;
    }

    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Read file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}/`);
    console.log(`📱 Open in browser: http://localhost:${PORT}/\n`);
    console.log('Press Ctrl+C to stop the server\n');
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use!`);
        console.log(`💡 Try using a different port:`);
        console.log(`   PORT=3002 node mini-app/server.js\n`);
        process.exit(1);
    } else {
        throw err;
    }
});
