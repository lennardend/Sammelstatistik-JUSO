import htmlExpress, { staticIndexHandler } from 'html-express-js';

const express = require('express');
const app = express();
const __dirname = resolve();

app.set('view engine', 'js');
app.set('views', `${__dirname}/public`)

app.get('/', (req, res) => {
    res.render('stats', {
        test: 'Deine Mutter'
    })
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});


