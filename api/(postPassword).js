const db = require('../database/db.js');
const bcrypt = require('bcrypt');

async function getData(request, response) {
    var password1 = request.body.password1;
    var password2 = request.body.password2;
    var errorMessage = '';

    try {
        if (password1 != password2 || password1 == '') {
            throw new Error('Error: Both Passwords must match and cannot be empty');
        }

        bcrypt.hash(password1, 10, (err, hash) => {
            db.setUser('admin', hash);
        })
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