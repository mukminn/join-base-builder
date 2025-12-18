const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9000;
const DIR = __dirname;

const server = http.createServer((req, res) => {
    let filePath = path.join(DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('404 Not Found');
            return;
        }
        
        const ext = path.extname(filePath);
        const types = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json'
        };
        
        res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
        res.end(data);
    });
});

server.listen(PORT, '127.0.0.1', () => {
    console.log('\n✅ SERVER RUNNING!');
    console.log(`🌐 Open: http://localhost:${PORT}`);
    console.log(`📁 Serving: ${DIR}\n`);
});
