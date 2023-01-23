const db = require('../database/db.js');

async function getData(request) {
    signatures = await db.getSignatures();

    const currentDate = new Date(Date.now());
    var signaturesPerson = {};
    for (var i = 0; i < signatures.length; i++) {
        signature = signatures[i];
        const name = signature.name;
        const amount = signature.amount;
        const date = new Date(signature.date);

        if (currentDate.getFullYear() === date.getFullYear() && currentDate.getMonth() === date.getMonth()) {
            if (signaturesPerson[name] == undefined) {
                signaturesPerson[name] = amount;
            }
            else {
                signaturesPerson[name] += amount;
            }
        }
    }

    let sortedSignatures = [];
    for (var person in signaturesPerson) {
        sortedSignatures.push({ "name": person, "amount": signaturesPerson[person] });
    }
    //sortieren nach alphabet
    sortedSignatures.sort((a, b) => a.name.localeCompare(b.name));
    //sortiern für anzahl unterschriften
    sortedSignatures.sort((a, b) => b.amount - a.amount);
    
    //nur ersten 3 in array zurückgeben
    return sortedSignatures.slice(0, 3);
}

module.exports = { getData };
