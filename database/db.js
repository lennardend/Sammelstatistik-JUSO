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

async function aggregateSignatures(pipeline) {
    const client = new MongoClient(process.env.DB_CONN);
    const database = client.db('sammelstatistik');
    const signatures = database.collection('signatures');

    try {
        const cursor = await signatures.aggregate(pipeline)
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

async function getGoals(name) {
    const client = new MongoClient(process.env.DB_CONN);
    const database = client.db('sammelstatistik');
    const goals = database.collection('goals');

    try {
        var query = {}
        if (name != undefined) query.name = name;
        const options = {
            projection: { _id: 0 }
        };

        var results = await goals.find(query, options).toArray();
        if (results.length > 1) return results;
        else return results[0];    
    } catch (err) {
        console.log(err.message);        
    }
    finally {
        client.close();
    }
}

async function setGoal(name, amount) {
    const client = new MongoClient(process.env.DB_CONN);
    const database = client.db('sammelstatistik');
    const goals = database.collection('goals');

    try {
        const filter = { 'name': name };
        const options = { upsert: true }; //creates user if not already existing
        const update = { $set: { 'value': amount } }

        await goals.updateOne(filter, update, options);
    } catch (err) {
        console.log(err.message);        
    }
    finally {
        client.close();
    }
}

async function deleteGoal(name) {
    const client = new MongoClient(process.env.DB_CONN);
    const database = client.db('sammelstatistik');
    const goals = database.collection('goals');

    try {
        await goals.deleteOne({ "name": name });
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

async function setUser(name, passwordHash) {
    const client = new MongoClient(process.env.DB_CONN);
    const database = client.db('sammelstatistik');
    const users = database.collection('users');

    try {
        const filter = { "name": name };
        const options = { upsert: true }; //creates user if not already existing
        const update = { $set: { hash: passwordHash } }

        await users.updateOne(filter, update, options);
    } catch (err) {
        console.log(err.message);        
    }
    finally {
        client.close();
    }
}

async function getSetting(name) {
    const client = new MongoClient(process.env.DB_CONN);
    const database = client.db('sammelstatistik');
    const settings = database.collection('settings');

    try {
        const query = { "name": name };
        const options = {
            projection: { _id: 0 }
        };
        
        return await settings.findOne(query, options);    
    } catch (err) {
        console.log(err.message);        
    }
    finally {
        client.close();
    }

}

module.exports = { getSignatures, aggregateSignatures, addSignature, deleteSignature, getGoals, setGoal, deleteGoal, getUser, setUser, getSetting }; 