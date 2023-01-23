const db = require('../database/db.js')

async function getData(data) {
    console.log(data);

    return "Success";
}

module.exports = { getData };