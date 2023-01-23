async function getData() {
    const db = require('../database/db.js');
    const target = await db.findInSettings('monat');
    const signatures = await db.getSignatures();

    data = {}
    data.total = target.amount;

    amount = 0;
    for (var i = 0; i < signatures.length; i++) {
        var signature = signatures[i];
        var date = new Date(signature.date);
        const currentDate = new Date(Date.now());

        if (currentDate.getFullYear() === date.getFullYear() && currentDate.getMonth() === date.getMonth()) {
            amount += signature.amount;
        }
    }
    data.gesammelt = amount

    return data;
}

module.exports = { getData };