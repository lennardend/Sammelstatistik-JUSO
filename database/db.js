require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.DB_CONN);

async function findInZiele(name) {
    const database = client.db('sammelstatistik');
    const ziele = database.collection('ziele');

    try {
        const query = { "name": name };
        const options = {
            projection: { _id: 0, name: 1, amount: 1 }
        };
        
        return await ziele.findOne(query, options);    
    }
    catch(err) {
        console.log(err.message)
    }
}

async function getSignatureAmount() {
    const database = client.db('sammelstatistik');
    const unterschriften = database.collection('unterschriften');

    try {
        const query = { amount: { $gt: 0 } };
        const options = {
            projection: { _id: 0, amount: 1 }
        };

        const cursor = await unterschriften.find(query, options);
        const signatures = await cursor.toArray();

        var amount = 0;
        for (var i = 0; i < signatures.length; i++) {
            amount += signatures[i].amount;
        }

        return amount;
    }
    catch(err) {
        console.log(err.message)
    }
}

async function close() {
    await client.close();
}

module.exports = { findInZiele, getSignatureAmount, close }; 