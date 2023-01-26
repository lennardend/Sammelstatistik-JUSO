const db = require('../database/db.js');

async function getData() {
    return db.getSignatures();
}

module.exports = { getData };