// Imports the index.js file to be tested.
const app = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiHttp);
chai.use(chaiAsPromised);
chai.should();
const { assert, expect } = chai;

const ora = require('ora');

const db = require('../js/dbConnection');

// ********************************************************
// * Clear test user from DB before running tests *
// ********************************************************

const clearTestUser = (data) => {
  const spinner = ora(`Checking for ${data.username}`).start();
  const query = `SELECT username FROM users WHERE username = $1`;
  return db.oneOrNone(query, [data.username]).then(user => {
    if (user == null) {
      spinner.succeed(`${data.username} not found`);
    } else {
      spinner.text = `${data.username} found, deleting...`;
      const deleteQuery = `DELETE FROM users WHERE username = $1`;
      return db.none(deleteQuery, [data.username]).then(() => {
        spinner.succeed(`${data.username} deleted`);
      });
    }
  });
};

const clearTestRoute = (data) => {
  const spinner = ora(`Checking for ${data.departing}`).start();
  const query = `SELECT trip_id FROM trips WHERE departing = $1`;
  return db.oneOrNone(query, [data.departing]).then(trip => {
    if (trip == null) {
      spinner.succeed(`${data.departing} not found`);
    } else {
      spinner.text = `${data.departing} found, deleting...`;
      const deleteQuery = `DELETE FROM trips WHERE trip_id = $1`;
      return db.none(deleteQuery, [trip.trip_id]).then(() => {
        spinner.succeed(`${data.departing} deleted`);
      });
    }
  });
};

// Shared agent
const agent = chai.request.agent(app);

// Test objects
const testUsers = [
  { username: 'beyonce', password: 'singleladies' },
  { username: 'pitbull', password: 'mrworldwide' },
  { username: 'tswizz', password: 'outofstyle' },
  { username: 'pritam', password: 'kabira' },
  { username: 'jeremias', password: 'gruneaugen' }
];

const testRoutes = [
  { departing: "Colorado School of Mines, Illinois Street, Golden, Colorado, États-Unis", departing_lat: 39.7510475, departing_long: -105.2225708, destination: "University of Colorado Boulder, Boulder, Colorado, États-Unis", destination_lat: 40.00758099999999, destination_long: -105.2659417, time: "2023-08-15 19:10:25-07", seats: 4, purpose: "Rambling... Ralphie?" },
  { departing: "Engineering Center, Université du Colorado - Boulder, Engineering Drive, Boulder, Colorado, États-Unis", departing_lat: 40.0077327, departing_long: -105.2628997, destination: "Center for Community, Willard Loop Drive, Boulder, Colorado, États-Unis", destination_lat: 40.0043916, destination_long: -105.2649423, time: "2023-05-02 19:10:25-07", seats: 3, purpose: "Dinner!" }
];

before(() => {
  return Promise.all(
    ['TestAccount1', 'TestAccount2'].map(user => clearTestUser({ username: user }))
      .concat(testUsers.map(clearTestUser))
      .concat(testRoutes.map(clearTestRoute))
  );
});

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  step('Returns the default welcome message', () => {
    return agent
      .get('/welcome')
      .should.eventually.have.status(200)
      .then((res) => {
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
      });
  });

  step('Connects to database', () => {
    return db.connect().should.be.fulfilled.then(obj => obj.done());
  });
});

describe('Register!', () => {
  testUsers.forEach(user => {
    step(`Registers user ${user.username}`, () => {
      return agent.post('/auth/register')
        .send(user)
        .redirects(0).should.eventually.redirectTo(/\/login/);
    });

    step(`Enters ${user.username} into database`, () => {
      const query = `SELECT * FROM users WHERE username=$1`;
      return db.one(query, [user.username]).should.eventually.not.be.undefined;
    });
  });

  step('Postive - user creation with more info', () => {
    return agent
      .post('/auth/register')
      .send({ username: 'TestAccount2', password: 'Password123', home_address: '1234 Test St', phone: '1234 Test St' })
      .should.eventually.redirectTo(/\/login/);
  });

  step('Negative - Missing username or password', () => {
    return agent
      .post('/auth/register')
      .send({ username: 'TestAccount1', password: '' })
      .should.eventually.have.status(400);
  });
});

describe('Login!', () => {

  step(`First user in database`, () => {
    const query = `SELECT * FROM users WHERE username=$1`;
    return db.one(query, [testUsers[0].username]).should.eventually.not.be.undefined;
  });

  step('Logs in', () => {
    return agent
      .post('/auth/login')
      .send(testUsers[0])
      .then(res => {
        return expect(res).to.redirectTo(/\/user\/profile/);
      });
  });

  step('Positive - user logout', () => {
    return agent
      .get('/auth/logout')
      .then(res => {
        return expect(res).to.have.status(200);
      });
  });

  step('Negative - Missing username or password', () => {
    return agent
      .post('/auth/login')
      .send({ username: 'TestAccount1', password: '' })
      .should.eventually.have.status(400);
  });
});

describe('Trips', () => {
  before(() => {
    return Promise.all(
      testRoutes.map(clearTestRoute)
    );
  });

  step('Logs in', () => {
    return agent
      .post('/auth/login')
      .send(testUsers[0])
      .should.eventually.redirectTo(/\/user\/profile/);
  });

  testRoutes.forEach(route => {
    step(`Route ${route.departing} creates`, () => {
      return agent
        .post('/trip/createTrip')
        .send(route)
        .should.eventually.have.status(200).then(() => {
          const query = `SELECT * FROM trips WHERE departing=$1`;
          return db.one(query, [route.departing]).should.eventually.not.be.undefined;
        });
    });
  });
});

after(() => {
  agent.close();
});