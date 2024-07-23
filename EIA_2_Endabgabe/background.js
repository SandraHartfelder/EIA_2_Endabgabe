// Hole das Canvas-Element und gib ihm den spezifischen Typ HTMLCanvasElement
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
// Überprüfe, ob ctx null ist
if (!ctx) {
    throw new Error('Failed to get canvas context');
}
// Setze das Canvas auf die richtige Größe
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Positionen der kleinen grünen Kreise
var smallCirclePositions = [
    { x: 180, y: 100, occupied: false },
    { x: 100, y: 180, occupied: false },
    { x: 20, y: 100, occupied: false },
    { x: 100, y: 20, occupied: false },
    { x: 380, y: 100, occupied: false },
    { x: 300, y: 180, occupied: false },
    { x: 220, y: 100, occupied: false },
    { x: 300, y: 20, occupied: false },
    { x: 180, y: 300, occupied: false },
    { x: 100, y: 380, occupied: false },
    { x: 20, y: 300, occupied: false },
    { x: 100, y: 220, occupied: false },
    { x: 380, y: 300, occupied: false },
    { x: 300, y: 380, occupied: false },
    { x: 220, y: 300, occupied: false },
    { x: 300, y: 220, occupied: false }
];
// Nachrichten-Array
var messages = [
    { type: 'schoko', text: 'Schoko' },
    { type: 'vanille', text: 'Vanille' },
    { type: 'erdbeere', text: 'Erdbeer' }
];
var preis = [
    { type: 'schoko', text: '3€' },
    { type: 'vanille', text: '4€' },
    { type: 'erdbeere', text: '3,5€' }
];
// Farben für die Pilze
var mushroomColors = ['#FFDDDD', '#FFAAAA', '#FF7777'];
// Funktion zum Abrufen einer zufälligen Nachricht basierend auf dem Typ
function getRandomMessage(type) {
    var filteredMessages = messages.filter(function (msg) { return msg.type === type; });
    if (filteredMessages.length === 0)
        return '';
    var randomIndex = Math.floor(Math.random() * filteredMessages.length);
    return filteredMessages[randomIndex].text;
}
// Funktionen zum Zeichnen der statischen Elemente
function drawLargeCircles() {
    var largeCircles = [
        { x: 100, y: 100, radius: 50 },
        { x: 300, y: 100, radius: 50 },
        { x: 100, y: 300, radius: 50 },
        { x: 300, y: 300, radius: 50 }
    ];
    largeCircles.forEach(function (circle) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = '#FF0000'; // Farbe für große Kreise
        ctx.fill();
        ctx.closePath();
    });
}
function drawSmallCircles() {
    smallCirclePositions.forEach(function (position) {
        ctx.beginPath();
        ctx.arc(position.x, position.y, 20, 0, Math.PI * 2, false);
        ctx.fillStyle = '#00FF00'; // Farbe für kleine grüne Kreise
        ctx.fill();
        ctx.closePath();
    });
}
function drawRectangles() {
    var rectWidth = 100;
    var rectHeight = 50;
    var padding = 20;
    var canvasHeight = canvas.height;
    var lowerThird = canvasHeight * 2 / 3;
    ctx.fillStyle = '#0000FF'; // Farbe für Rechtecke
    ctx.fillRect(padding, lowerThird + padding, rectWidth, rectHeight);
    ctx.fillRect(canvas.width - rectWidth - padding, lowerThird + padding, rectWidth, rectHeight);
}
var maxMovingMushrooms = 20;
var movingMushrooms = [];
var colors = ['#FF5733', '#33FF57', '#3357FF'];
var lastSpawnTime = 0;
var spawnInterval = 3000; // Verlängert auf 3000 ms (3 Sekunden)
// Funktion zum Erstellen eines neuen beweglichen Pilzes
function createMovingMushroom() {
    var radius = 10;
    var x = 20; // Startpunkt unten links
    var y = canvas.height - 20;
    var color = colors[Math.floor(Math.random() * colors.length)];
    var state = 'moveToMiddle';
    var target = { x: canvas.width / 2, y: canvas.height / 2 }; // Ziel ist die Mitte des Canvas
    var lastOutput = Date.now();
    var shouldDisplay = false;
    var positionOccupied = false;
    // Wähle zufällig einen Nachrichtentyp aus
    var messageTypes = ['schoko', 'vanille', 'erdbeer'];
    var messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
    return { x: x, y: y, radius: radius, color: color, dx: 0, dy: 0, state: state, target: target, lastOutput: lastOutput, shouldDisplay: shouldDisplay, positionOccupied: positionOccupied, messageType: messageType };
}
function updateMovingMushrooms() {
    var now = Date.now();
    movingMushrooms.forEach(function (mushroom) {
        if (mushroom.state === 'moveToMiddle' || mushroom.state === 'moveToGreen') {
            // Berechne die Bewegung in Richtung Ziel
            var angle = Math.atan2(mushroom.target.y - mushroom.y, mushroom.target.x - mushroom.x);
            mushroom.dx = Math.cos(angle) * 2;
            mushroom.dy = Math.sin(angle) * 2;
            mushroom.x += mushroom.dx;
            mushroom.y += mushroom.dy;
            // Überprüfen, ob das Ziel erreicht wurde
            if (Math.abs(mushroom.x - mushroom.target.x) < 5 && Math.abs(mushroom.y - mushroom.target.y) < 5) {
                if (mushroom.state === 'moveToMiddle') {
                    // Suche einen freien Platz unter den kleinen grünen Kreisen
                    var freePosition = smallCirclePositions.find(function (pos) { return !pos.occupied; });
                    if (freePosition) {
                        freePosition.occupied = true; // Belege die Position
                        mushroom.state = 'moveToGreen';
                        mushroom.target = { x: freePosition.x, y: freePosition.y };
                        mushroom.positionOccupied = false;
                    }
                    else {
                        mushroom.state = 'wait';
                        mushroom.target = { x: canvas.width / 2, y: canvas.height * 2 / 3 }; // Zurück in die Mitte des unteren Drittels
                    }
                }
                else if (mushroom.state === 'moveToGreen') {
                    // Pilz hat endgültiges Ziel erreicht
                    mushroom.dx = 0;
                    mushroom.dy = 0;
                    mushroom.positionOccupied = true;
                    mushroom.shouldDisplay = true; // Sofortige Anzeige der Nachricht
                }
            }
        }
    });
}
function drawMovingMushrooms() {
    movingMushrooms.forEach(function (mushroom) {
        // Zeichne den Pilzkopf
        ctx.beginPath();
        ctx.ellipse(mushroom.x, mushroom.y - 15, 25, 15, 0, 0, Math.PI * 2); // Oval
        ctx.fillStyle = mushroom.color; // Farbe für den Pilzkopf
        ctx.fill();
        ctx.strokeStyle = '#000'; // Randfarbe für den Pilzkopf
        ctx.stroke();
        ctx.closePath();
        // Zeichne den Pilzstiel
        ctx.beginPath();
        ctx.rect(mushroom.x - 10, mushroom.y, 20, 40); // Rechteck
        ctx.fillStyle = '#FFFFFF'; // Farbe für den Stiel
        ctx.fill();
        ctx.strokeStyle = '#000'; // Randfarbe für den Stiel
        ctx.stroke();
        ctx.closePath();
        if (mushroom.shouldDisplay) {
            ctx.font = '12px Arial';
            ctx.fillStyle = '#000000';
            // Zeige die Nachricht basierend auf dem Nachrichtentyp an
            ctx.fillText(getRandomMessage(mushroom.messageType), mushroom.x + 15, mushroom.y);
            // Resete den Anzeigestatus nach einer bestimmten Zeit
            setTimeout(function () {
                mushroom.shouldDisplay = false;
            }, 3000); // Nachricht für 3 Sekunden anzeigen
        }
    });
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLargeCircles();
    drawSmallCircles(); // Diese Funktion bleibt unverändert
    drawRectangles();
    updateMovingMushrooms();
    drawMovingMushrooms();
    // Füge neue Pilze in Intervallen hinzu
    var now = Date.now();
    if (movingMushrooms.length < maxMovingMushrooms && now - lastSpawnTime > spawnInterval) {
        movingMushrooms.push(createMovingMushroom());
        lastSpawnTime = now;
    }
    requestAnimationFrame(animate);
}
// Zeichne die statischen Elemente einmal zu Beginn
drawLargeCircles();
drawSmallCircles(); // Diese Funktion bleibt unverändert
drawRectangles();
// Starte die Animation
animate();
