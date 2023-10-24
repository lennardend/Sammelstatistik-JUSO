const db = require('../database/db.js');

async function getData() {
    var exclusionList = await db.getSetting('excludeFromRanking');
    exclusionList = exclusionList.value;

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
        }
    ]);

    signatures = signatures.filter(object => { return !exclusionList.includes(object.name) })
    signatures = signatures.slice(0, 5);

    return signatures;    
}

module.exports = { getData };