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
app.set('trust proxy', 5);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2 //cookie verfällt nach 2 Stunden
    }
}));

//ERRORS
//401: Unauthorized
function error401(res) {
    res.status(401).redirect('/');
}
//404: Not Found
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
    const func = req.params.function.charAt(0).toUpperCase() + req.params.function.slice(1);

    const path = `./api/get${func}.js`;
    const adminPath = `./api/(${method}${func}).js`;

    if (fs.existsSync(path)) {
        res.locals.apiPath = path;
        next();
    }
    else if (fs.existsSync(adminPath)) {
        res.locals.apiPath = adminPath;

        if (req.session.user == 'admin') next();
        else {
            console.log(`Someone tried to access '${adminPath}' (URI: '${req.originalUrl}') without being logged in as 'admin'`);
            error401(res);
        }
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
//show login page
app.get('/admin/login', initializeForAPI,
    //middleware, redirects to /admin/console if admin is logged in
    (req, res, next) => {
        if (req.session.user != 'admin') next();
        else res.redirect('/admin/console');
    },
    //sends login html, only if admin user isn't logged in
    (req, res) => {
        res.sendFile(`${__dirname}/sites/admin/login.html`);
    }
);
//check sent login data, if correct user-Cookie gets set
app.post('/admin/login', isInitialized, async (req, res) => {
    const password = req.body.password.trim();
    const user = await require('./database/db.js').getUser('admin');

    await bcrypt.compare(password, user.hash, async (err, result) => {
        if (result == true) {
            req.session.user = 'admin';
            res.redirect('/admin/console');
        }
        else {
            await new Promise(res => setTimeout(res, 5000));
            const errorMessage = encodeURIComponent("Wrong Password!");
            res.redirect(`/admin/login?error=${errorMessage}`);
        }
    });
});
//shows console of authenticated as admin
app.get('/admin/console', isAuthenticatedAsAdmin, (req, res) => {
    res.sendFile(`${__dirname}/sites/admin/console.html`);
});
//remove user-Cookie to log out user
app.post('/admin/logout', (req, res) => {
    req.session.user = null;
    res.redirect('/');
});


//start server
const port = parseInt(process.env.PORT);
app.listen(port, () => {
    console.info(`Server running, listening on port ${port}`);
});
