//import express-stuff
const express = require('express');
const app = express();
// import packages
require('dotenv').config();
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');

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
    maxAge: 1000 * 60 * 60 * 2 //cookie verfällt nach 2 Stunden
  }
}));

//ERRORS
function error401(res) {
  res.status(401).send('<pre>Ur so not allowed to do that</pre>');
}
function error404(req, res) {
  res.status(404).send(`<pre>Cannot ${req.method} ${req.path}</pre>`);
}

//MIDDLEWARE 
//api can only be accessed if user has visited homepage before
function initializeForAPI(req, res, next) {
  req.session.initialized = true;
  next();
}

function isInitialized(req, res, next) {
  if (req.session.initialized) next();
  else {
    error401(res);
  }
}
//checking before access if user is authenticated as admin
function isAuthenticatedAsAdmin(req, res, next) {
  if (req.session.user == 'admin') next();
  else res.redirect('/admin/login');
}
//Gets path for api
function getAPIPath(req, res, next) {
  const method = req.method.toLowerCase();
  const func = req.params.function;

  const path = `./api/get_${func}.js`;
  const adminPath = `./api/(${method}_${func}).js`;

  if (fs.existsSync(path)) {
    res.locals.apiPath = path;
    next();
  }
  else if (fs.existsSync(adminPath)) {
    res.locals.apiPath = adminPath;
    
    if (req.session.user == 'admin') next();
    else error401(res);
  }
  else {
    console.warn(`Couldnt find '${path}' or '${adminPath}'`);
    error404(req, res);
  }
}

//serving static files
app.use('/public', express.static(`${__dirname}/public`));

//route for home page
app.get('/', initializeForAPI, (req, res) => {
  res.sendFile(`${__dirname}/sites/stats.html`);
});

//routes for accessing data api
app.all('/api/:function', isInitialized, getAPIPath, async (req, res) => {
  const apiResponse = await require(res.locals.apiPath).getData(req, res);
  if (apiResponse != undefined) {
    res.send(apiResponse);
  }
});

//Admin-Stuff
app.get('/admin', isAuthenticatedAsAdmin, (req, res) => {
  res.redirect('/admin/console');
});

app.get('/admin/login', initializeForAPI,
  //middleware, redirects to /admin/console if admin is logged in
  (req, res, next) => {
    if (req.session.user != 'admin') next();
    else res.redirect('/admin/console');
  },
  //sends login html, only if admin user isn't logged in
  (req, res) => {
    res.sendFile(`${__dirname}/sites/admin/login.html`);
  });

app.post('/admin/login', isInitialized, async (req, res) => {
  const password = req.body.password.trim();
  const user = await require('./database/db.js').findInSettings('admin');

  await bcrypt.compare(password, user.value, async (err, result) => {
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

app.get('/admin/console', isAuthenticatedAsAdmin, (req, res) => {
  res.sendFile(`${__dirname}/sites/admin/console.html`);
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
