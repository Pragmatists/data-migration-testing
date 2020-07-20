const shell = require("shelljs");
const {MongoMemoryServer} = require("mongodb-memory-server");
const {getPostgresClient} = require("./postgres-client-builder");
const {afterAll, afterEach, beforeAll} = require("@jest/globals");
const {getMongoClient} = require("./mongo-client-builder");

let clients = {};
let mongod;

const dockerComposeFile = __dirname + '/../docker-compose.yml';

beforeAll(async () => {
    console.log('Starting in memory Mongo server');
    mongod = new MongoMemoryServer({autoStart: false});
    await mongod.start();

    const mongoUri = await mongod.getUri();
    clients.mongo = await getMongoClient(mongoUri);
    clients.mongoDb = clients.mongo.db();

    console.log('Starting Docker container with PostgreSQL');
    shell.exec(`docker-compose -f ${dockerComposeFile} up -d`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const postgresHost = shell.exec(`docker-compose -f ${dockerComposeFile} port postgresql 5432`).stdout;
    const postgresUri = `postgresql://postgres:password@${postgresHost}`;

    clients.postgres = await getPostgresClient(postgresUri);
});

afterAll(async () => {
    await clients.mongo.close();
    await clients.postgres.end();

    await mongod.stop();
    console.log('Mongo server stopped')
    shell.exec(`docker-compose -f ${dockerComposeFile} down`);
    console.log('PostgreSQL Docker container stopped');
});

afterEach(async () => {
    const tables = await clients.postgres.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema ='public';`
    );
    await Promise.all(tables.rows.map(row => clients.postgres.query(`DROP TABLE ${row.table_name}`)));

    const collections = await clients.mongoDb.collections();
    await Promise.all(collections.map(collection => clients.mongoDb.dropCollection(collection.collectionName)));
});

module.exports = {
    clients,
}
