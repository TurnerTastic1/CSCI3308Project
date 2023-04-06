const express = require('express'); // To build an application server or API
const app = express.Router();
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords


app.post('/register', async (req, res) => {
    if (!req.body.username || !req.body.password) {
      console.log("Error - Missing username or password");
      return res.render('pages/register', {
        message: "Missing username or password!"
      });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const query = `INSERT INTO users (username, password) VALUES ($1, $2) returning *;`;

    try {
      await db.one(query, [req.body.username, hash]);
      return res.redirect('/login');
    } catch (error) {
      return res.render('pages/register', {
        message: "Internal server error or username already exists."
      });
    }
});

module.exports = {
    app
};