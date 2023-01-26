require('dotenv').config();
const { MongoClient } = require('mongodb');

async function findInSettings(name) {
    const client = new MongoClient(process.env.DB_CONN);
    const database = client.db('sammelstatistik');
    const settings = database.collection('settings');

    try {
        const query = { "name": name };
        const options = {
            projection: { _id: 0 }
        };
        
        return await settings.findOne(query, options);    
    }
    catch(err) {
        console.log(err.message)
    }
    finally {
        await client.close();
    }
}

async function getSignatures(values) {
    const client = new MongoClient(process.env.DB_CONN);
    const database = client.db('sammelstatistik');
    const signatures = database.collection('signatures');

    try {
        const query = {};
        const options = {
            projection: values
        };

        const cursor = await signatures.find(query, options);
        return await cursor.toArray();
    }
    catch(err) {
        console.log(err.message)
    }
    finally {
        await client.close();
    }
}

async function addSignature(data) {
    const client = new MongoClient(process.env.DB_CONN);
    const database = client.db('sammelstatistik');
    const signatures = database.collection('signatures');

    try {
        await signatures.insertOne(data);
    }
    catch(err) {
        console.log(err.message);
    }
    finally {
        await client.close();
    }

}

module.exports = { findInSettings, getSignatures, addSignature }; 