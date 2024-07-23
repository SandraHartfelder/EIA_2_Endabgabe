document.addEventListener('DOMContentLoaded', function () {
    var currentIce = document.getElementById('currentIce');
    var currentMoney = document.getElementById('currentMoney');
    // Laden der gespeicherten Daten aus localStorage
    var savedIceType = localStorage.getItem('currentIceType') || 'Kein Eis';
    var savedIceFlavor = localStorage.getItem('currentIceFlavor') || 'Unbekannt';
    var savedMoney = localStorage.getItem('earnedMoney') || '0';
    // Aktualisieren der Statusanzeige
    currentIce.innerText = "Aktuelles Eis: ".concat(savedIceType, " - ").concat(savedIceFlavor);
    currentMoney.innerText = "Verdientes Geld: ".concat(savedMoney);
});
