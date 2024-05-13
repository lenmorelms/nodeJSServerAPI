const http = require('http');
const url = require('url');
const PORT = process.env.PORT || 3000;

// Database (temporary, in-memory)
var db = [];

const server = http.createServer((req, res) => {
    const { method, url: reqUrl } = req;
    const parsedUrl = url.parse(reqUrl, true);
    const pathname = parsedUrl.pathname;

    // Handling GET requests
    if (method === 'GET' && pathname === '/home') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(db));
    }

    // Handling POST requests
    else if (method === 'POST' && pathname === '/home') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newJoke = JSON.parse(body);
            db.push(newJoke);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(db));
        });
    }

    // Handling PATCH requests
    else if (method === 'PATCH' && pathname.startsWith('/joke/')) {
        const id = pathname.split('/')[2];
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedJoke = JSON.parse(body);
            const index = db.findIndex(joke => joke.id === id);
            if (index !== -1) {
                db[index] = { ...db[index], ...updatedJoke };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(db[index]));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Joke not found' }));
            }
        });
    }

    // Handling DELETE requests
    else if (method === 'DELETE' && pathname.startsWith('/joke/')) {
        const id = pathname.split('/')[2];
        const index = db.findIndex(joke => joke.id === id);
        if (index !== -1) {
            const deletedJoke = db.splice(index, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deletedJoke));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Joke not found' }));
        }
    }

    // Invalid route
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});