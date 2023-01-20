const db = require('./db.js');

var items = [];

db.findInZiele('total', items.push);

module.exports = { items };