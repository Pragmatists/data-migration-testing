const {Client} = require("pg");

async function buildPostgresClient(uri) {
    console.log('Connecting to PostgreSQL');
    const client = new Client({connectionString: uri});
    try {
        await client.connect();
        return client;
    } catch (e) {
        console.error('Could not connect to PostgreSQL', e);
        process.exit(1);
    }
}

module.exports = {
    buildPostgresClient: buildPostgresClient
}
