const db = require('../database/db.js');

async function getData() {
    return db.getGoals();
}

module.exports = { getData };