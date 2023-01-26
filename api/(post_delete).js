const db = require('../database/db.js');

async function getData(request) {
    const id = request.body.id;
    await db.deleteSignature(id);

    return '';
}

module.exports = { getData };