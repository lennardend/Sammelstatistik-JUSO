require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb+srv://der_funke:Q5EVS7ubeRDgvxjj@sammelstatistik-juso.rupca.mongodb.net/?retryWrites=true&w=majority");

const database = client.db('sammelstatistik');
const unterschriften = database.collection('unterschriften');
const ziele = database.collection('ziele');

module.exports = { unterschriften, ziele }