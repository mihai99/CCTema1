require('dotenv').config();
const http = require("http");
const fs = require('fs');
const RandomOrg = require("random-org/src/RandomOrg");
const readLastLines = require('read-last-lines');
const axios = require('axios');
const instance = axios.create();
const currentLogs = [];
instance.interceptors.request.use((config) => {
  config.headers['request-startTime'] = process.hrtime()
  return config
})

instance.interceptors.response.use((response) => {
  const start = response.config.headers['request-startTime']
  const end = process.hrtime(start)
  const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000));
  response.headers['request-duration'] = milliseconds
  return response
})

const random = new RandomOrg({ apiKey: process.env.RANDOM_API_KEY });
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
  const routes = req.url.split('/');
  switch (routes[1]) {
    case 'home':
      res.statusCode = 200;
      res.writeHead(200, { 'content-type': 'text/html' });
      fs.createReadStream('./index.html').pipe(res);
      break;
    case 'metrics':
      res.statusCode = 200;
      res.writeHead(200, { 'content-type': 'text/html' });
      fs.createReadStream('./metrics.html').pipe(res);
      break;
    case 'styles.css':
      fs.readFile('styles.css', function (err, data) {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.write(data);
        res.end();
      });
      break;
    case 'get-metrics-data':
      console.log(currentLogs);
      res.statusCode = 200;
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify(currentLogs));
      break;
    case 'dogs':
      console.log("aici8");
      const logs = [];
      const now = Date.now();
      const randomNumberResult = await random.generateIntegers({ min: 1, max: 10, n: 1 });
      logs.push({ time: Date.now(), request: "random api", response: JSON.stringify(randomNumberResult), latency: Date.now() - now });

      const breedResult = await instance.get('http://localhost:3001');
      logs.push({ time: Date.now(), request: "http://localhost:3001", response: JSON.stringify(breedResult.data), latency: breedResult.headers['request-duration'] })

      const dogImageUri = `https://dog.ceo/api/breed/${breedResult.data.breed}${breedResult.data.subBreed && `/${breedResult.data.subBreed}` || ''}/images/random/${randomNumberResult.random.data[0]}`;
      const dogImageResult = await instance.get(dogImageUri);
      logs.push({ time: Date.now(), request: dogImageUri, response: JSON.stringify(dogImageResult.data), latency: dogImageResult.headers['request-duration'] })

      logs.forEach(x => currentLogs.push(x));
      const stream = fs.createWriteStream("logs.txt", { flags: 'a' });
      stream.once('open', function (fd) {
        logs.forEach(log => stream.write(`${JSON.stringify(log)}\n`));
        stream.end();
      })
      if (dogImageResult.data.status === 'success') {
        const result = {
          ...breedResult.data,
          images: dogImageResult.data.message
        }
        res.statusCode = 200;
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify(result));
      } else {
        res.statusCode = 500;
        res.writeHead(500, { 'content-type': 'application/html' })
        res.end(JSON.stringify("500 - internal server error"));
      }

      break;
    default:
      res.statusCode = 404;
      res.writeHead(404, { 'content-type': 'text/html' })
      res.end("404 - not found");
      break;
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});