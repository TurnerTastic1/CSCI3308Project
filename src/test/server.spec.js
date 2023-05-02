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
    db.none(deleteQuery, [data.username]).then(() => {
      console.log("Test user " + user.username + " deleted!");
    }).catch(err => console.log(err));
  } catch (error) {
    return console.log("Test user not found. Continuing...");
  }
};

// Clear test user from database
clearTestUser({username: 'TestAccount1'});
clearTestUser({username: 'TestAccount2'});

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
});

describe('Register!', async () => {
  
  it('Postive - user creation', done => {
    chai
      .request(server)
      .post('/auth/register')
      .send({username: 'TestAccount1', password: 'Password123'})
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
        done();
      });
  });

  it('Postive - user creation with more info', done => {
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
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
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

  before(async () => {
    agent = chai.request.agent(server);
    return Promise.all(
      testUsers.map(clearTestUser)
    );
  })

  testUsers.forEach(user => {
    it('Registers user ' + user.username, done => {
      agent.post('/auth/register')
        .send(user)
        .redirects(0)
        .then(res => {
          console.log(res.statusCode, res.statusMessage, res.text, res._data);
          expect(res).to.have.status(302);
          done();
        }).catch(err => {
          throw err;
        });
    });
  });
  
  it('Logs in', done => {
    agent
      .post('/auth/login')
      .send(testUsers[0])
      .redirects(0)
      .then(res => {
        console.log(testUsers[0]);
        console.log(res.statusCode, res.statusMessage, res.text.split('\n', 1), res._data);
        console.log(res);
        expect(res).to.have.status(302)
          .and.have.cookie('sessionid');
        done();
      }).catch(err => {
        throw err;
      });
  });

  after(() => agent.close());
})