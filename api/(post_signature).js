const db = require('../database/db.js')

async function getData(request, response) {
    var data = request.body;
    if (data.name == 'new') {
        data.name = data['new-name'];
    }

    data.name = data.name.trim();
    data.amount = parseInt(data.amount.trim());
    console.log(data.date);

    try {
        if (typeof data.name !== 'string' || data.name.length > 20 || data.name === '' || /\d/.test(data.name)) {
            throw new Error(`Issue with name: '${request.body.name}' is not of Type 'string' or isn't a name or is to long (max. 20 chars)!`);
        }
        if (typeof data.amount !== 'number' || isNaN(data.amount) || 0 > data.amount || 1000 < data.amount) {
            throw new Error(`Issue with amount: '${request.body.amount}' is not of Type 'number' or is to big (max. 1000) or to small (min. 0)!`);
        }
        else {
            //this object gets inserted into the database
            const insertData = {
                name: data.name,
                amount: data.amount,
                date: ""
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