const db = require('../database/db.js');

async function getData() {
    signatures = await db.aggregateSignatures([
        {
            '$group': {
                '_id': '$name', 
                'amount': {
                    '$sum': '$amount'
                }
            }
        }, {
            '$match': {
                'amount': {
                    '$gte': 20
                }
            }
        }, {
            '$addFields': {
                'name': '$_id'
            }
        }, {
            '$sort': {
                'amount': -1,
                'name': 1
            }
        }
    ]);
    
    //nur ersten 5 in array zurückgeben
    return signatures;
}

module.exports = { getData };