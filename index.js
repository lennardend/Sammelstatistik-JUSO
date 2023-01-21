require('dotenv').config();
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use('/public', express.static(`${__dirname}/public`));

app.get('/', (req, res) =>{
  res.render(`${__dirname}/public/stats`, {
    test: "Deine Mutter",
    gesamelt: 300,
    gesameltmonat: 25,
    leaderboard: "Völker hört die Signale",
    altjusos: "Jonas stinkt hih",
  });
});

const port = parseInt(process.env.PORT);
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
