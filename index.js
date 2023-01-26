//import express-stuff
const express = require('express');
const app = express();
// import packages
require('dotenv').config();
const session = require('express-session');
const bcrypt = require('bcrypt');

//needed to get body of request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//session middleware
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 6 //cookie verfällt nach 6 Stunden
  }
}));

//serving static files
app.use('/public', express.static(`${__dirname}/public`));

//route for home page
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/sites/stats.html`);
});

//routes for accessing data api
app.all('/api/:function', async (req, res) => {
  try {
    var method = req.method.toLowerCase();
    var func = req.params.function;

    var apiResponse = await require(`./api/${method}_${func}.js`).getData(req, res);
    if (apiResponse != undefined) {
      res.send(apiResponse);
    }
  }
  catch (err) {
    res.statusCode = 404;
    res.send(`<pre>Cannot GET ${req.path}</pre>`);
  }
});

//Admin-Stuff
app.get('/admin', (req, res) => {
  if (req.session.user == 'admin') {
    res.redirect('/admin/console');
  }
  else {
    res.redirect('/admin/login');
  }
});

app.get('/admin/login', (req, res) => {
  res.sendFile(`${__dirname}/sites/admin/login.html`);
});

app.post('/admin/login', async (req, res) => {
  const password = req.body.password.trim();
  const user = await require('./database/db.js').findInSettings('admin');

  bcrypt.compare(password, user.hash, async (err, result) => {
    if (result == true) {
      req.session.user = 'admin';
      res.redirect('/admin/console');
    }
    else {
      await new Promise(res => setTimeout(res, 5000));
      res.redirect('/admin/login');
    }
  });
});

app.get('/admin/console', (req, res) => {
  if (req.session.user == 'admin') {
    res.sendFile(`${__dirname}/sites/admin/console.html`);
  }
  else {
    res.redirect('/admin');
  }
});

app.post('/admin/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/');
});


//start server
const port = parseInt(process.env.PORT);
app.listen(port, () => {
  console.info(`Server running, listening on port ${port}`);
});
