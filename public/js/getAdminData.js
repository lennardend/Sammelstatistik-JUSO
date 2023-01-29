async function deleteSignature(id) {
    const tableRow = document.getElementById(id);
    const name = tableRow.getElementsByClassName("table-name")[0].innerHTML;
    const amount = tableRow.getElementsByClassName("table-amount")[0].innerHTML;
    var date = tableRow.getElementsByClassName("table-date")[0].innerHTML;

    if (date != '') {
        date = ` vom ${date}`;
    }

    const message = `Möchtest du den Eintrag von ${name}${date} mit ${amount} Unterschriften löschen?`;
    if(!confirm(message)){
        return;
    }

    await fetch("/api/delete", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'id': id })
    });

    loadSignatureTable();
}

//Daten für Dropdown herunterladen und einfügen
fetch("/api/names")
    .then((response) => response.json())
    .then((data) => {
        const dropdown = document.getElementById("name-input");

        const inputNewName = document.createElement("input");
        inputNewName.setAttribute("type", "text");
        inputNewName.setAttribute("name", "new-name");
        inputNewName.setAttribute("id", "newName-input");
        inputNewName.setAttribute("placeholder", "neuer Name");

        dropdown.addEventListener("change", () => {
            if (dropdown.value == "new") {
                dropdown.after(inputNewName);
            }
            else {
                if (document.body.contains(inputNewName)) inputNewName.remove();
            }
        });

        dropdown.innerHTML += '<option value="">---</option>';
        for (var i = 0; i < data.length; i++) {
            const option = `<option value="${data[i]}">${data[i]}</option>`;
            dropdown.innerHTML += option;
        }
        dropdown.innerHTML += '<option value="new">neue*r Sammler*in</option>';

        //set date in selector to today
        const date = new Date(Date.now()).toISOString().split("T")[0];
        document.getElementById("date-input").setAttribute("value", date);
    });

//Daten für Tabelle herunterladen
function loadSignatureTable() {
    fetch("/api/signatures")
        .then((response) => response.json())
        .then((data) => {
            const table = document.getElementById("signature-table");
            table.innerHTML = `            
            <tr>
                <th>Datum</th>
                <th>Name</th>
                <th>Anzahl</th>
            </tr>`;

            data.forEach(signature => {
                const name = signature.name;
                const amount = signature.amount;
                const id = signature._id;
                var date = '';
                if (signature.date != undefined) date = new Date(signature.date).toLocaleDateString('de-CH');

                const tableRow = `
                <tr id="${id}">
                    <td class="table-date">${date}</td>
                    <td class="table-name">${name}</td>
                    <td class="table-amount">${amount}</td>
                    <td class="table-delete"><button onclick="deleteSignature('${id}')">🗑️</button></td>
                </tr>`;

                table.innerHTML += tableRow;
            });
        });
}

loadSignatureTable();