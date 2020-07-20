const {buildPostgresClient} = require('./postgres-client-builder');
const {buildMongoClient} = require('./mongo-client-builder');
const {migrateUsers} = require('./migrate-users');

run().then().catch(console.error);

async function run() {
    const postgresClient = await buildPostgresClient("postgres://localhost");
    const mongoClient = await buildMongoClient("mongodb://localhost");

    console.log('Starting migration');

    // await migrateCompanies(postgresClient, mongoClient);
    await migrateUsers(postgresClient, mongoClient);
    // await migrateFizzBuzzes(postgresClient, mongoClient);

    console.log(`Migration finished`);
}
