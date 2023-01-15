const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/public`);

app.use('/public', express.static(`${__dirname}/public`));


app.get('/', (req, res) => {
    res.render('stats', {
        test: 'asdfadsf'
    })
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});


