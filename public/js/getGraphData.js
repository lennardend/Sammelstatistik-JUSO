async function getTotal() {
    var response = await fetch("/api/total");
    var data = await response.json();

    const total = data.total;
    const gesammelt = data.gesammelt;

    document.getElementById("varTotal").append(total);
    document.getElementById("varGesammelt").append(gesammelt);

    const barWidth = 3000 * (gesammelt / total);
    document.getElementById("bg1").style.width = `${barWidth}px`;
}

async function getMonth() {
    var response = await fetch("/api/month");
    var data = await response.json();
    
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
}

async function getTop() {
    var response = await fetch("/api/top");
    var data = await response.json();

    data.forEach(person => {
        const listItem = `<li>${person.name} - ${person.amount}</li>`;
        document.getElementById("leaderboardList").innerHTML += listItem;
    });
}

async function getTopMonth() {
    var response = await fetch("/api/topmonth");
    var data = await response.json();

    data.forEach(person => {
        const listItem = `<li>${person.name} - ${person.amount}</li>`;
        document.getElementById("leaderboardMonthList").innerHTML += listItem;
    });
}

getTotal();
getTop();
getMonth();
getTopMonth();