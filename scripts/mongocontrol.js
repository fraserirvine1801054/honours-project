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

async function queryDbOnPackageSearch(condition) {
    
    /**
     * this code is different compared to default mongodb code
     * from this stackoverflow suggestion:
     * https://stackoverflow.com/questions/59816298/how-to-fix-mongoerror-cannot-use-a-session-that-has-ended
     */
    
    const MONGODB_URI = process.env.MONGODB_URI;
    const query = { data_package_Id: condition };
    const { MongoClient, ServerApiVersion } = require('mongodb');
    const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    
    const collection = client.db("honours").collection("datasets");
    const cursor = await collection.find(query).toArray();
    
    client.close();

    return Promise.resolve(cursor);
}
exports.writeDb = writeDb;
exports.queryDbOnPackageSearch = queryDbOnPackageSearch;