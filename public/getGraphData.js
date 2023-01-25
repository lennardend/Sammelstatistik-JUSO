//Daten für Total herunterladen und einfügen
fetch("/api/total")
    .then((response) => response.json())
    .then((data) => {
        const total = data.total;
        const gesammelt = data.gesammelt;

        document.getElementById("varTotal").append(total);
        document.getElementById("varGesammelt").append(gesammelt);
        
        var barWidth = 3000 * (gesammelt / total);
        document.getElementById("bg1").style.width = `${barWidth}px`;
    });

//Daten für Monat herunterladen und einfügen
fetch("/api/month")
    .then((response) => response.json())
    .then((data) => {
        const totalMonat = data.total;
        const gesammeltMonat = data.gesammelt;

        var faktor = gesammeltMonat / totalMonat;

        document.getElementById("varTotalMonat").append(totalMonat);
        document.getElementById("gesammeltMonatText").append(gesammeltMonat);

        document.getElementById("bg2").style.height = `${200 * faktor}px`;
        document.getElementById("bg2").setAttribute('y', 200 - 200 * faktor);
        if (gesammeltMonat >= totalMonat) {
            document.getElementById("bg2").style.fill = "#00ff00";
        }
        
        var h = window.innerHeight
        var marginMonat = 0.3 * h * faktor - 10;
        document.getElementById("gesammeltMonatText").setAttribute('style', `margin-bottom: ${marginMonat}px`);
    });

fetch("/api/top3")
    .then((response) => response.json())
    .then((data) => {
        for (var i=0; i < data.length; i++) {
            var listItem = `<li>${data[i].name} - ${data[i].amount}</li>`;
            document.getElementById("leaderboardList").innerHTML += listItem;
        }
    });

fetch("/api/top3month")
    .then((response) => response.json())
    .then((data) => {
        for (var i=0; i < data.length; i++) {
            var listItem = `<li>${data[i].name} - ${data[i].amount}</li>`;
            document.getElementById("leaderboardMonthList").innerHTML += listItem;
        }
    });