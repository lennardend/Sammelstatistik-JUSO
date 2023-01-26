const db = require('../database/db.js');

async function getData() {
    const signatures = await db.getSignatures({ _id: 0, name: 1 });

    names = [];
    for (var i = 0; i < signatures.length; i++) {
        const name = signatures[i].name;

        if (!names.includes(name)) {
            names.push(name);
        }
    }

    return names;
}

module.exports = { getData };