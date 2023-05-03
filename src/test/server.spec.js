// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
var chaiAsPromised = require("chai-as-promised");
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
  const query = `SELECT username FROM users WHERE username = $1 ;`;
  return db.oneOrNone(query, [data.username]).then(user => {
    if (user == null) {
      spinner.succeed(`${data.username} not found`);
    } else {
      spinner.text = `${data.username} found, deleting...`;
      const deleteQuery = `DELETE FROM users WHERE username = $1 ;`;
      return db.none(deleteQuery, [data.username]).then(() => {
        spinner.succeed(`${data.username} deleted`);
      });
    }
  });
};

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  step('Returns the default welcome message', () => {
    chai
      .request(server)
      .get('/welcome').should.eventually.have.status(200).then((res) => {
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
      });
  });

  step('Connects to database', () => {
    return db.connect().should.be.fulfilled;
  });
});

describe('Register!', () => {
  before(() => {
    return Promise.all(
      ['TestAccount1', 'TestAccount2'].map(user => clearTestUser({ username: user }))
    );
  });

  step('Postive - user creation', () => {
    return chai
      .request(server)
      .post('/auth/register')
      .send({ username: 'TestAccount1', password: 'Password123' })
      .redirects(0).should.eventually.have.status(302);
  });

  step('Postive - user creation with more info', done => {
    chai
      .request(server)
      .post('/auth/register')
      .send({username: 'TestAccount2', password: 'Password123', home_address: '1234 Test St', phone: '1234 Test St'})
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
        done();
      });
  });

  step('Negative - Missing username or password', done => {
    chai
      .request(server)
      .post('/auth/register')
      .send({username: 'TestAccount1', password: ''})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

});

describe('Login!', () => {
  
  step('Positive - user login', done => {
    chai
      .request(server)
      .post('/auth/login')
      .send({username: 'TestAccount1', password: 'Password123'})
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
        done();
      });
  });

  step('Negative - Missing username or password', done => {
    chai
      .request(server)
      .post('/auth/login')
      .send({username: 'TestAccount1', password: ''})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

});


// Trip tests

describe('Trips', () => {
  // Test objects
  const testUsers = [
    { username: 'beyonce', password: 'singleladies' },
    { username: 'pitbull', password: 'mrworldwide' },
    { username: 'tswizz', password: 'outofstyle' },
    { username: 'pritam', password: 'kabira' },
    { username: 'jeremias', password: 'gruneaugen' }
  ];

  var agent;

  before(() => {
    agent = chai.request.agent(server);
    return Promise.all(
      testUsers.map(clearTestUser)
    );
  })

  testUsers.forEach(user => {
    step(`Registers user ${user.username}`, () => {
      return agent.post('/auth/register')
        .send(user)
        .redirects(0).should.eventually.have.status(302);
    });

    step(`Enters ${user.username} into database`, () => {
      const query = `SELECT * FROM users WHERE username=$1 ;`;
      return db.one(query, [user.username]).should.eventually.not.be.undefined;
    });
  });
  
  step('Logs in', () => {
    return agent
      .post('/auth/login')
      .send(testUsers[0])
      .should.eventually.redirectTo(/.*\/user\/profile/).then(() => {
        agent.get('/user/profile').should.eventually.have.cookie('connect.sid');
      });
  });

  after(async () => {
    agent.close();
    return Promise.all(
      testUsers.map(clearTestUser)
    );
  });
});