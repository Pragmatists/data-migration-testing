const {migrateUsers} = require("./migrate-users");
const {clients} = require("./test-init");
const {describe, beforeEach, it} = require("@jest/globals");

describe('User migration', () => {

    beforeEach(async () => {
        await clients.postgres.query(`CREATE TABLE users (id integer, username varchar(20))`);
    });

    it('migrates one user', async () => {
        await clients.postgres.query(`
            INSERT INTO users (id, username) 
            VALUES (1, 'john_doe')
            `);

        await migrateUsers(clients.postgres, clients.mongo);

        const users = await clients.mongoDb.collection('users').find().toArray();
        expect(users).toHaveLength(1);
        expect(users[0].username).toEqual('john_doe');
    });

    it('migrates one user with data generation function', async () => {
        await givenUser({username: "john_doe"});

        await migrateUsers(clients.postgres, clients.mongo);

        const users = await clients.mongoDb.collection('users').find().toArray();
        expect(users).toHaveLength(1);
        expect(users[0].username).toEqual('john_doe');
    });

    async function givenUser(overrides = {}) {
        const user = Object.assign({
            id: '1',
            username: 'john_doe',
        }, overrides);

        await clients.postgres.query(`
            INSERT INTO users (id, username)
            VALUES (${user.id}, '${user.username}')
            `);

        return user;
    }
});
