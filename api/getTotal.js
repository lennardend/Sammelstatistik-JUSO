const db = require('../database/db.js');

async function getData() {
    var data = {};

    const total = await db.getGoals('total');
    data.total = total.value;

    const signatures = await db.aggregateSignatures([{
        $group: {
            _id: {},
            total: {
                $sum: "$amount"
            }
        }
    }]);

    data.gesammelt = signatures[0].total;

    return data;
}

module.exports = { getData };

