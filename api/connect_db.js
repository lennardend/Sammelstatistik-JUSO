require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.DB_CONN);

const database = client.db('sammelstatistik');
const unterschriften = database.collection('unterschriften');
const ziele = database.collection('ziele');

module.exports = { unterschriften, ziele }