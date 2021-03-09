const http = require('http');
const routes = require('./routes');
const mongoDb = require('./mongodb');
const url = require('url');
const utils = require('./utils');
const hostname = '127.0.0.1';
const port = 3002;



const server = http.createServer((req, res) => {
    let requestBody = '';
    req.on('data', chunk => {
        requestBody += chunk;
    })
    req.on('end', () => {
        const parsedRequest = url.parse(req.url, true);
        const requestObject = {
            url: parsedRequest.pathname,
            method: req.method,
            queryParams: parsedRequest.query,
            body: requestBody ? JSON.parse(requestBody) : null,
        }
        console.log(requestObject);
        let sent = false;
        routes.routes.forEach(async (route) => {
            if (route.url === requestObject.url && route.method === requestObject.method && !sent) {
                sent = true;
                if(route.requiredQueryParams && !utils.checkRouteParams(route.requiredQueryParams, requestObject.queryParams)) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(`Bad request - missing query params`);
                } else {
                    console.log("query params ok");
                    try {
                        await route.action(res, requestObject);
                    } catch(error) {
                        console.log("fdsfsdf>>", error, error.status);
                        if(error.status) {
                            console.log("log aiii", error.name, error.message);
                            res.statusCode = error.status;
                            res.setHeader('Content-Type', 'text/plain');
                            res.end(`${error.name} - ${error.message}`);
                        } else {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'text/plain');
                            res.end(`Internal server error`);
                        }
                    }
                }
            }
        });
        if (!sent) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('404 - Resource not found');
        }
    })

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});