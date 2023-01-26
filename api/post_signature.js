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
    data.amount = parseInt(data.amount.trim());

    try {
        if (typeof data.name !== 'string' || data.name === '' || data.name.length > 20 || /\d/.test(data.name)) {
            throw new Error(`Issue with name: '${request.body.name}' is not of Type 'string' or a name or is to long (max. 20 chars)!`);
        }
        if (typeof data.amount !== 'number' || isNaN(data.amount) || data.amount > 1000) {
            throw new Error(`Issue with amount: '${request.body.amount}' is not of Type 'number' or is to big (max. 1000)!`);
        }
        else {
            //this object gets inserted into the database
            const insertData = {
                name: data.name,
                amount: data.amount,
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