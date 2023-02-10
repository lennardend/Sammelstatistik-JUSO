const db = require('../database/db.js');

async function getData(request, response) {
    const name = request.body.goal;
    const amount = request.body.amount;
    var errorMessage = '';

    try {
        if (amount == '' || parseInt(amount) == 0) {
            if (name == 'total' || name == 'month') {
                throw new Error('Error: \'Month\' and \'Total\' cannot be set to 0 or deleted!');
            }
            await db.deleteGoal(name);
        }
        else {
            var amountInt = parseInt(amount);
            if (isNaN(amountInt)) {
                throw new Error(`Issue with amount: Target needs to be a Number, was '${amount}'`);
            }
            await db.setGoal(name, amountInt);
        }
    }
    catch (err) {
        console.warn(err.message);
        errorMessage = '?error=' + encodeURIComponent(err.message);
    }
    finally {
        response.redirect(`/admin/console${errorMessage}`);
    }
}

module.exports = { getData };