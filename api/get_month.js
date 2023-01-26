const db = require('../database/db.js');

async function getData() {
    //findet entweder eintrag für Monat in datenbank, oder default (monat)
    const month = new Date(Date.now()).toLocaleString('de', { month: 'long' });    
    var target = await db.findInSettings(month);    
    if (target == null) {
        target = await db.findInSettings('monat');
    }

    const signatures = await db.getSignatures({ _id: 0, name: 1, amount: 1, date: 1 });

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