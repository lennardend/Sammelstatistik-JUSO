const db = require('../database/db.js');

async function getData(request) {
    const signatures = await db.getSignatures();

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