const { MongoClient } = require("mongodb");
require('dotenv').config()
// Connection URI
const uri =
  `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.mz3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db(process.env.DB_NAME).command({ ping: 1 });
    // const toInsert = {name: "mihai", age: "21"}
    // return client.db("homework2").collection('users').insertOne(toInsert).then(() => {
    //     console.log("1 document inserted - op");
    // }).catch(err => console.error(err));
    return client.db(process.env.DB_NAME);
  } catch(error) {
      console.log("error");
      return Promise.reject();
  }
}

module.exports.connect = run;
