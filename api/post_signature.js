const db = require('../database/db.js')

async function getData(request, response) {
    if (request.session.user != 'admin') {
        response.redirect('/admin');
        return;
    }

    var data = request.body;
    if (data.name == 'new') {
        data.name = data['new-name'];
    }

    data.name = data.name.trim();
    data.parsedAmount = parseInt(data.amount.trim());

    try {
        if (typeof data.name !== 'string' || data.name === '---' || data.name === 'neuer Name'|| data.name === 'None') {
            throw new Error(`Issue with name: ${data.name}. Is not String or is still default value`);
        }
        if (typeof data.parsedAmount !== 'number' || isNaN(data.parsedAmount)) {
            throw new Error(`Issue with amount: ${data.amount}. Is not Integer or is still default value`);
        }
        else {
            //this object gets inserted into the database
            const insertData = {
                name: data.name,
                amount: data.parsedAmount,
                date: new Date(Date.now())
            } 
            db.addSignature(insertData);
        }
    }
    catch (err) {
        console.warn(err.message);
    }
    finally {
        response.redirect('/admin/console');
    }
}

module.exports = { getData };