/**
 * gets called by index.js
 */

function writeDb(jsonString) {

    const MONGODB_URI = process.env.MONGODB_URI;

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    client.connect(err => {
        const collection = client.db("honours").collection("datasets");
        // perform actions on the collection object

        collection.insertOne(jsonString)
            .then(() => client.close());

    });


}
exports.writeDb = writeDb;