//Daten für Droptdown herunterladen und einfügen
fetch("/api/names")
    .then((response) => response.json())
    .then((data) => {
        const dropdown = document.getElementById("name-input");

        const inputNewName = document.createElement("input")
        inputNewName.setAttribute("type", "text");
        inputNewName.setAttribute("name", "new-name");
        inputNewName.setAttribute("id", "newName-input");
        inputNewName.setAttribute("placeholder", "neuer Name");
        
        dropdown.addEventListener("change", () => {
            if (dropdown.value == "new") {
                dropdown.after(inputNewName);
            }
            else {
                document.getElementById("newName-input").remove()
            }
        });

        dropdown.innerHTML += '<option value="">---</option>';
        for (var i = 0; i < data.length; i++) {
            const option = `<option value="${data[i]}">${data[i]}</option>`;
            dropdown.innerHTML += option;
        }
        dropdown.innerHTML += '<option value="new">neue*r Sammler*in</option>';
    });