const db = require('../database/db.js');

async function getData() {
    //findet entweder eintrag für Monat in datenbank, oder default (monat)
    const month = new Date(Date.now()).toLocaleString('en', { month: 'long' });
    var target = await db.getGoals(month);    
    if (target == null) {
        target = await db.getGoals('month');
    }

    currentYear = new Date().getFullYear();
    currentMonth = new Date().getMonth();
    const signatures = await db.aggregateSignatures([
        {
          '$match': {
            'date': {
              '$gte': new Date(currentYear, currentMonth, 1), 
              '$lt': new Date(currentYear, currentMonth+1, 1)
            }
          }
        }, {
          '$group': {
            '_id': {}, 
            'amount': {
              '$sum': '$amount'
            }
          }
        }
      ]);

    data = {};
    data.total = target.value;
    data.gesammelt = signatures[0].amount;

    return data;
}

module.exports = { getData };