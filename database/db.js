require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

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

async function deleteSignature(id) {
    const client = new MongoClient(process.env.DB_CONN);
    const database = client.db('sammelstatistik');
    const signatures = database.collection('signatures');

    try {
        await signatures.deleteOne({ '_id': ObjectId(id) });
    } catch (err) {
        console.log(err.message);        
    }
    finally {
        client.close();
    }
}

async function getGoal(name) {
    const client = new MongoClient(process.env.DB_CONN);
    const database = client.db('sammelstatistik');
    const goals = database.collection('goals');

    try {
        const query = { "name": name };
        const options = {
            projection: { _id: 0 }
        };
        
        return await goals.findOne(query, options);    
    } catch (err) {
        console.log(err.message);        
    }
    finally {
        client.close();
    }
}

async function getUser(name) {
    const client = new MongoClient(process.env.DB_CONN);
    const database = client.db('sammelstatistik');
    const users = database.collection('users');

    try {
        const query = { "name": name };
        const options = {
            projection: { _id: 0 }
        };
        
        return await users.findOne(query, options);    
    } catch (err) {
        console.log(err.message);        
    }
    finally {
        client.close();
    }
}

module.exports = { getSignatures, addSignature, deleteSignature, getGoal, getUser }; 