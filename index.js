require('dotenv').config();
const express = require('express');
const app = express();
const api = require('./api/api.js');

//serving static files
app.use('/public', express.static(`${__dirname}/public`));

//routes for accessing data api
app.all('/api/:function', async (req, res) => {
  var method = req.method.toLowerCase();
  var apiData = await api.resolve(method, req.params.function);
  res.send(apiData);
});

//route for home page
app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
  const total = await api.resolve('get', 'total');
  const month = await api.resolve('get', 'month');
  res.render(`${__dirname}/public/stats`, {
    'total': total.total,
    'gesammelt': total.gesammelt,
    'totalmonat': month.total,
    'gesammeltmonat': month.gesammelt,
    'leaderboard': "Völker hört die Signale",
    'altjusos': "Jonas stinkt hih",
  });
});

//start server
const port = parseInt(process.env.PORT);
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
