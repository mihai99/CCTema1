require('dotenv').config();
const http = require("http");
const RandomOrg = require("random-org/src/RandomOrg");
const axios = require('axios');
const random = new RandomOrg({ apiKey: process.env.RANDOM_API_KEY });
const hostname = '127.0.0.1';
const port = 3001;

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

const server = http.createServer(async (req, res) => {
    const result = {
        breed: '',
        subBreed: '',
    }
    const dogBreedResult = await axios.get(`https://dog.ceo/api/breeds/list/all`);
    const breeds = Object.keys(dogBreedResult.data.message);
    result.breed = breeds.random();
    const selectedBreed = dogBreedResult.data.message[result.breed];
    if (selectedBreed.length > 0) {
        result.subBreed = selectedBreed.random();
    }
    res.statusCode = 200;
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(result));

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});