require('dotenv').config();
const express = require('express');
const app = express();

app.get('/api/*', (req, res) => {
  var func = req.path;
  res.send(require(`.${func}.js`).items);
});

app.use('/public', express.static(`${__dirname}/public`));

app.get('/', (req, res) =>{
  res.sendFile(`${__dirname}/public/stats.html`);
});

const port = parseInt(process.env.PORT);
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
