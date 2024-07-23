window.onload = function () {
    var container = document.getElementById('iceCreamContainer');
    if (container) {
        // Basis des Eisbechers
        var base = document.createElement('div');
        base.className = 'ice-cream-base';
        container.appendChild(base);
    }
    else {
        console.error('Container für den Eisbecher nicht gefunden.');
    }
};
function spanClick(type, flavor) {
    var container = document.getElementById('iceCreamContainer');
    // Funktion zum Hinzufügen der Eiskugeln
    function addIceCream(color) {
        var iceCream = document.createElement('div');
        iceCream.className = 'ice-cream';
        iceCream.style.backgroundColor = color;
        iceCream.style.top = "".concat(30 + (container.childElementCount * 60), "px"); // Positionierung der Eiskugel
        iceCream.style.left = '50%'; // Zentriert die Eiskugel horizontal
        iceCream.style.transform = 'translateX(-50%)'; // Zentriert die Eiskugel horizontal
        container.appendChild(iceCream);
    }
    // Funktion zum Hinzufügen der Soße
    function addSyrup(color) {
        var syrup = document.createElement('div');
        syrup.className = 'syrup';
        syrup.style.backgroundColor = color;
        syrup.style.top = "".concat(30 + (container.childElementCount * 20), "px"); // Positionierung der Soße
        syrup.style.left = '50%'; // Positionierung der Soße
        syrup.style.transform = 'translateX(-50%)'; // Zentriert die Soße horizontal
        container.appendChild(syrup);
    }
    // Funktion zum Hinzufügen der Toppings
    function addTopping(color) {
        var topping = document.createElement('div');
        topping.className = 'topping';
        topping.style.backgroundColor = color;
        topping.style.top = "".concat(30 + (container.childElementCount * 30), "px"); // Positionierung des Toppings
        topping.style.left = '50%'; // Positionierung des Toppings
        topping.style.transform = 'translateX(-50%)'; // Zentriert das Topping horizontal
        container.appendChild(topping);
    }
    // Beispiel für verschiedene Eiskugeln
    if (type === 'iceCream') {
        if (flavor === 'vanilla')
            addIceCream('#ffffe0');
        if (flavor === 'chocolate')
            addIceCream('#3e2723');
        if (flavor === 'strawberry')
            addIceCream('#ffc0cb');
    }
    // Beispiel für verschiedene Soßen
    if (type === 'syrup') {
        if (flavor === 'chocolate')
            addSyrup('#3e2723');
        if (flavor === 'caramel')
            addSyrup('#ffeb3b');
        if (flavor === 'strawberry')
            addSyrup('#ffc0cb');
    }
    // Beispiel für verschiedene Toppings
    if (type === 'topping') {
        if (flavor === 'sprinkles')
            addTopping('#ffeb3b');
        if (flavor === 'nuts')
            addTopping('#8d6e63');
        if (flavor === 'chocolate')
            addTopping('#3e2723');
    }
}
// Beispiel für verschiedene Eiskugeln
if (type === 'iceCream') {
    if (flavor === 'vanilla')
        addIceCream('#ffffe0');
    else if (flavor === 'chocolate')
        addIceCream('#3e2723');
    else if (flavor === 'strawberry')
        addIceCream('#ffc0cb');
}
// Beispiel für verschiedene Soßen
if (type === 'syrup') {
    if (flavor === 'chocolate')
        addSyrup('#3e2723');
    else if (flavor === 'caramel')
        addSyrup('#ffeb3b');
    else if (flavor === 'strawberry')
        addSyrup('#ffc0cb');
}
// Beispiel für verschiedene Toppings
if (type === 'topping') {
    if (flavor === 'sprinkles')
        addTopping('#ffeb3b');
    else if (flavor === 'nuts')
        addTopping('#8d6e63');
    else if (flavor === 'chocolate')
        addTopping('#3e2723');
}
// Speichern der aktuellen Eis-Zutaten im localStorage
localStorage.setItem('currentIceType', type);
localStorage.setItem('currentIceFlavor', flavor);
// Weiterleiten zur Statusseite
window.location.href = 'status.html';
