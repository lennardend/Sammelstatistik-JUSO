require('dotenv').config();
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use('/public', express.static(`${__dirname}/public`));

app.get('/', (req, res) =>{
  res.render(`${__dirname}/public/stats`, {
    total: 3000,
    gesamelt: 380,
    totalmonat: 200,
    gesameltmonat: 34,
    leaderboard: "Völker hört die Signale",
    altjusos: "Jonas stinkt hih",
  });
});

const port = parseInt(process.env.PORT);
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
