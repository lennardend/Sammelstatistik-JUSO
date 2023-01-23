require('dotenv').config();
const express = require('express');
const app = express();
const bp = require('body-parser');
const api = require('./api/api.js');

//body-parser shit, idk what is going on
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//serving static files
app.use('/public', express.static(`${__dirname}/public`));

//routes for accessing data api
app.all('/api/:function', async (req, res) => {
  var method = req.method.toLowerCase();
  var apiData = await api.resolve(method, req.params.function, req.body);
  res.send(apiData);
});

//route for home page
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/stats.html`);
});

//start server
const port = parseInt(process.env.PORT);
app.listen(port, () => {
  console.info(`listening on port ${port}`);
});
