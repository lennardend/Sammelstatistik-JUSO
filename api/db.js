require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.DB_CONN);

const database = client.db('sammelstatistik');
const unterschriften = database.collection('unterschriften');
const ziele = database.collection('ziele');

async function findInZiele(name, callback) {
    try {
        const query = { "name": name };
        const options = {
            projection: { _id: 0, name: 1, amount: 1 },
          };
        
        const cursor = await ziele.find(query, options);
    
        await cursor.forEach(callback);
    }
    finally {
        await client.close();
    }
}

module.exports = { findInZiele };