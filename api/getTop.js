const db = require('../database/db.js');

async function getData() {
    signatures = await db.getSignatures({ _id: 0, name: 1, amount: 1 });

    var signaturesPerson = {};
    for (var i = 0; i < signatures.length; i++) {
        signature = signatures[i];
        const name = signature.name;
        const amount = signature.amount;

        if (signaturesPerson[name] == undefined) {
            signaturesPerson[name] = amount;
        }
        else {
            signaturesPerson[name] += amount;
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
    
    //nur ersten 5 in array zurückgeben
    return sortedSignatures.slice(0, 5);
}

module.exports = { getData };