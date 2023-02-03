const db = require('../database/db.js');

async function getData() {
    var data = {};

    const total = await db.getGoals('total');
    data.total = total.value;

    const signatures = await db.getSignatures({ _id: 0, amount: 1 });

    var amount = 0;
    for (var i = 0; i < signatures.length; i++) {
        amount += signatures[i].amount;
    }
    data.gesammelt = amount;   

    return data;
}

module.exports = { getData };

