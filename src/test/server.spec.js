// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

const db = require('../js/dbConnection');

// ********************************************************
// * Clear test user from DB before running tests *
// ********************************************************
const clearTestUser = async (data) => {
  try {
    const query = `SELECT username FROM users WHERE username = $1 ;`;
    const user = await db.one(query, [data.username]);
    console.log("Test user found: " + user.username + " - Deleting...");
    const deleteQuery = `DELETE FROM users WHERE username = $1 ;`;
    await db.none(deleteQuery, [data.username]);
  } catch (error) {
    return console.log("Test user not found. Continuing...");
  }
};

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

  // ===========================================================================
  // TO-DO: Part A Login unit test case
});

// Clear test user from database
clearTestUser({username: 'TestAccount1'});
clearTestUser({username: 'TestAccount2'});

describe('Register!', async () => {
  
  it('Postive - user creation', done => {
    chai
      .request(server)
      .post('/auth/register')
      .send({username: 'TestAccount1', password: 'Password123'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Postive - user creation with more info', done => {
    chai
      .request(server)
      .post('/auth/register')
      .send({username: 'TestAccount2', password: 'Password123', home_address: '1234 Test St', phone: '1234 Test St'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Negative - Missing username or password', done => {
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
  
  it('Positive - user login', done => {
    chai
      .request(server)
      .post('/auth/login')
      .send({username: 'TestAccount1', password: 'Password123'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Negative - Missing username or password', done => {
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
