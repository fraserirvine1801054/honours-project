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

function queryDbOnPackageSearch(condition) {
    const MONGODB_URI = process.env.MONGODB_URI;

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    const query = {package_id : condition};
    client.connect(err => {
        const collection = client.db("honours").collection("datasets");
        // perform actions on the collection object
        const cursor = collection.find(query);
        client.close();
        return cursor; 
    });
}
exports.writeDb = writeDb;
exports.queryDbOnPackageSearch = queryDbOnPackageSearch;