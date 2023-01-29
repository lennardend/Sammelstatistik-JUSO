async function deleteSignature(row) {
    const id = row.cells[0].data;
    var date = row.cells[1].data;
    const name = row.cells[2].data;
    const amount = row.cells[3].data;

    if (date != '') {
        date = ` vom ${date}`;
    }

    const message = `Möchtest du den Eintrag von ${name}${date} mit ${amount} Unterschriften löschen?`;
    if (!confirm(message)) {
        return;
    }

    await fetch("/api/delete", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'id': id })
    });

    window.location.reload();
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
fetch("/api/signatures")
    .then((response) => response.json())
    .then((data) => {
        const table = document.getElementById("signature-table");
        table.innerHTML = '';

        var dataArray = [];
        data.forEach(signature => {
            const name = signature.name;
            const amount = signature.amount;
            const id = signature._id;
            var date = '';
            if (signature.date != undefined) date = new Date(signature.date);

            dataArray.push([id, date, name, amount]);
        });

        //sort alphabetically
        dataArray.sort((a, b) => { return a[2].localeCompare(b[2]) });
        //sort by date
        dataArray.sort((a, b) => { return b[1] - a[1] });
        for (var i=0; i < dataArray.length; i++) {
            if (dataArray[i][1] != '') dataArray[i][1] = dataArray[i][1].toLocaleDateString('de-CH');
        }

        new gridjs.Grid({
            columns: [{
                name: 'id',
                hidden: true
            }, "Datum", "Name", "Anzahl",
            {
                name: '🗑️',
                sort: false,
                formatter: (cell, row) => {
                    return gridjs.h("button", {
                        onclick: () => deleteSignature(row)
                    }, "🗑️");
                }
            }],
            sort: true,
            width: 500,
            resizable: true,
            pagination: { limit: 15 },
            data: dataArray
        }).render(table);
    });