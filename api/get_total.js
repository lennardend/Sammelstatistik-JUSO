const db = require('../database/db.js');

var data = {
    "total": 0,
    "gesammelt": 0
}

db.findInZiele('total')
    .then(result => {
        data.total = result.amount;
        
        db.getSignatureAmount().then(result => {
            data.gesammelt = result;

            module.exports = { data };
        })
        .then(() => {
            db.close();
        })
    })