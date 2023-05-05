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
            '$addFields': {
                'name': '$_id'
            }
        }, {
            '$unset': '_id'
        }, {
            '$sort': {
                'amount': -1,
                'name': 1
            }
        }, {
            '$limit': 5
        }
    ]);

    return signatures.filter(object => { return object.name !== 'Flyers' });
}

module.exports = { getData };