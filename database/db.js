require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.DB_CONN);

const database = client.db('sammelstatistik');
const unterschriften = database.collection('unterschriften');
const ziele = database.collection('ziele');

async function findInZiele(name) {
    try {
        const query = { "name": name };
        const options = {
            projection: { _id: 0, name: 1, amount: 1 },
          };
        
        return await ziele.findOne(query, options);    
    }
    finally {
        await client.close();
    }
}

async function getSignatureAmount() {
    try {
        const query = {}
    }
    finally {
        await client.close()
    }
}

module.exports = { findInZiele }; 