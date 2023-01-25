const db = require('../database/db.js');

async function getData() {
    const target = await db.findInSettings('monat');
    const signatures = await db.getSignatures();

    data = {}
    data.total = target.amount;

    const currentDate = new Date(Date.now());
    var amount = 0;
    for (var i = 0; i < signatures.length; i++) {
        var signature = signatures[i];
        var date = new Date(signature.date);

        if (currentDate.getFullYear() === date.getFullYear() && currentDate.getMonth() === date.getMonth()) {
            amount += signature.amount;
        }
    }
    data.gesammelt = amount

    return data;
}

module.exports = { getData };