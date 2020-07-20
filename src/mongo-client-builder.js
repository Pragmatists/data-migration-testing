const {MongoClient} = require("mongodb");

function buildMongoClient(uri) {
    console.log('Connecting to MongoDB');
    try {
        return MongoClient.connect(uri, mongoClientOptions);
    } catch (e) {
        console.error('Could not connect to MongoDB', e);
        process.exit(1);
    }
}

const mongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 1,
    ignoreUndefined: true,
};

module.exports = {
    buildMongoClient
}
