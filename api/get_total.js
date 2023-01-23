async function getData() {
    const db = require('../database/db.js');
    var data = {};

    const total = await db.findInSettings('total');
    data.total = total.amount;

    const signatures = await db.getSignatures();

    var amount = 0;
    for (var i = 0; i < signatures.length; i++) {
        amount += signatures[i].amount;
    }
    data.gesammelt = amount;   

    return data;
}

module.exports = { getData };

