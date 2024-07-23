document.addEventListener('DOMContentLoaded', () => {
    const currentIce = document.getElementById('currentIce');
    const currentMoney = document.getElementById('currentMoney');

    // Laden der gespeicherten Daten aus localStorage
    const savedIceType = localStorage.getItem('currentIceType') || 'Kein Eis';
    const savedIceFlavor = localStorage.getItem('currentIceFlavor') || 'Unbekannt';
    const savedMoney = localStorage.getItem('earnedMoney') || '0';

    // Aktualisieren der Statusanzeige
    currentIce.innerText = `Aktuelles Eis: ${savedIceType} - ${savedIceFlavor}`;
    currentMoney.innerText = `Verdientes Geld: ${savedMoney}`;
});
