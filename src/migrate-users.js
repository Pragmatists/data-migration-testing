
async function migrateUsers(postgresClient, mongoClient) {
    const pgResult = await postgresClient.query(`
        SELECT username FROM users
    `);

    for (const row of pgResult.rows) {
        await mongoClient.db().collection('users').insertOne({username: row.username});
    }
}

module.exports = {
    migrateUsers
}
