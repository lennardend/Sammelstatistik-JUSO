require('dotenv').config();
const express = require('express');
const app = express();

//disable caching
app.set('etag', false);
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

//serving static files
app.use('/public', express.static(`${__dirname}/public`));

//routes for accessing data api
app.all('/api/:function', (req, res) => {
  var api = require('./api/api.js');
  var method = req.method.toLowerCase();
  res.send(api.resolve(`${method}_${req.params.function}`));
});

//route for home page
app.set('view engine', 'ejs');
app.get('/', (req, res) =>{
  res.render(`${__dirname}/public/stats`, {
    total: 3000,
    gesamelt: 300,
    totalmonat: 300,
    gesameltmonat: 25,
    leaderboard: "Völker hört die Signale",
    altjusos: "Jonas stinkt hih",
  });
});

const port = parseInt(process.env.PORT);
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
