# Automating data migration testing

This code accompanies the Automating data migration testing blog post on https://blog.pragmatists.com.

It provides a simple framework for testing data migrations, with both the source and target databases running. Here, we're using PostgreSQL as source, running in Docker, and MongoDB as target, running in memory. The code is written in JavaScript, and [Jest](https://jestjs.io/) is used to run tests.

## Running

1. Make sure you have [Docker Engine](https://docs.docker.com/engine/install/), [Docker Compose](https://docs.docker.com/compose/install/), and [Node.js](https://nodejs.org/en/).
1. After pulling the code, run `npm install` to install dependencies.
1. Run `npm test` to launch the test suite.
1. Run `npm start` to launch the actual migration.

## Content

Assuming you're familiar with JavaScript projects in general, the important bits here are:

* [`docker-compose.yml`](docker-compose.yml) contains the PostgreSQL container configuration
* [`src/index.js`](src/index.js) runs the full migration, as you would in production
* [`src/migrate-users.js`](src/migrate-users.js) is the code encapsulating migrating `user` entities, and [`src/migrate-users.spec.js`](src/migrate-users.spec.js) is the test suite for that code
* [`src/test-init.js`](src/test-init.js) is test initialization code, including starting and stopping databases, sharedby all test suites
* [`src/mongo-client-builder.js`](src/mongo-client-builder.js) and [`src/postgres-client-builder.js`](src/postgres-client-builder.js) are functions building client instances for MongoDB and PostgreSQL accordingly
