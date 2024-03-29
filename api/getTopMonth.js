const db = require('../database/db.js');

async function getData() {
    currentYear = new Date().getFullYear();
    currentMonth = new Date().getMonth();

    var exclusionList = await db.getSetting('excludeFromRanking');
    exclusionList = exclusionList.value;
    
    signatures = await db.aggregateSignatures([
        {
            '$match': {
              'date': {
                '$gte': new Date(currentYear, currentMonth, 1), 
                '$lt': new Date(currentYear, currentMonth+1, 1)
              }
            }
        }, {
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
