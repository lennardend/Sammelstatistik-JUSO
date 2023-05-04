const db = require('../database/db.js');

async function getData() {
    const signatures = await db.aggregateSignatures([
        {
          '$group': {
            '_id': null, 
            'names': {
              '$addToSet': '$name'
            }
          }
        }
    ]);
    
    //sort db-output, isn't possible with queries
    return signatures[0].names.sort((a, b) => a.localeCompare(b));
}

module.exports = { getData };