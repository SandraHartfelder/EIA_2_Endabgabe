// Hole das Canvas-Element und gib ihm den spezifischen Typ HTMLCanvasElement
let canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
let ctx = canvas.getContext('2d');

// Überprüfe, ob ctx null ist
if (!ctx) {
    throw new Error('Failed to get canvas context');
}

// Setze das Canvas auf die richtige Größe
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Positionen der kleinen grünen Kreise
const smallCirclePositions = [
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
const messages = [
    { type: 'schoko', text: 'Schoko' },
    { type: 'vanille', text: 'Vanille' },
    { type: 'erdbeere', text: 'Erdbeer' }
];

const preis = [
    { type: 'schoko', text: '3€' },
    { type: 'vanille', text: '4€' },
    { type: 'erdbeere', text: '3,5€' }
];

// Farben für die Pilze
const mushroomColors = ['#FFDDDD', '#FFAAAA', '#FF7777'];

// Funktion zum Abrufen einer zufälligen Nachricht basierend auf dem Typ
function getRandomMessage(type: string): string {
    const filteredMessages = messages.filter(msg => msg.type === type);
    if (filteredMessages.length === 0) return '';

    const randomIndex = Math.floor(Math.random() * filteredMessages.length);
    return filteredMessages[randomIndex].text;
}

// Funktionen zum Zeichnen der statischen Elemente
function drawLargeCircles() {
    const largeCircles = [
        { x: 100, y: 100, radius: 50 },
        { x: 300, y: 100, radius: 50 },
        { x: 100, y: 300, radius: 50 },
        { x: 300, y: 300, radius: 50 }
    ];

    largeCircles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = '#FF0000'; // Farbe für große Kreise
        ctx.fill();
        ctx.closePath();
    });
}

function drawSmallCircles() {
    smallCirclePositions.forEach(position => {
        ctx.beginPath();
        ctx.arc(position.x, position.y, 20, 0, Math.PI * 2, false);
        ctx.fillStyle = '#00FF00'; // Farbe für kleine grüne Kreise
        ctx.fill();
        ctx.closePath();
    });
}

function drawRectangles() {
    const rectWidth = 100;
    const rectHeight = 50;
    const padding = 20;
    const canvasHeight = canvas.height;
    const lowerThird = canvasHeight * 2 / 3;

    ctx.fillStyle = '#0000FF'; // Farbe für Rechtecke

    ctx.fillRect(padding, lowerThird + padding, rectWidth, rectHeight);
    ctx.fillRect(canvas.width - rectWidth - padding, lowerThird + padding, rectWidth, rectHeight);
}

// Funktion zum Erstellen und Animieren von sich bewegenden Pilzen
interface MovingMushroom {
    x: number;
    y: number;
    radius: number;
    color: string;
    dx: number;
    dy: number;
    state: 'moveToMiddle' | 'moveToGreen' | 'wait';
    target: { x: number, y: number };
    lastOutput: number; // Zeit des letzten Outputs
    shouldDisplay: boolean; // Ob der Pilz aktuell eine Nachricht anzeigen soll
    positionOccupied: boolean; // Ob die Position erreicht und besetzt ist
    messageType: string; // Typ der Nachricht für den Pilz
}

const maxMovingMushrooms = 20;
const movingMushrooms: MovingMushroom[] = [];
const colors = ['#FF5733', '#33FF57', '#3357FF'];

let lastSpawnTime = 0;
const spawnInterval = 3000; // Verlängert auf 3000 ms (3 Sekunden)

// Funktion zum Erstellen eines neuen beweglichen Pilzes
function createMovingMushroom(): MovingMushroom {
    const radius = 10;
    const x = 20; // Startpunkt unten links
    const y = canvas.height - 20;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const state = 'moveToMiddle';
    const target = { x: canvas.width / 2, y: canvas.height / 2 }; // Ziel ist die Mitte des Canvas
    const lastOutput = Date.now();
    const shouldDisplay = false;
    const positionOccupied = false;

    // Wähle zufällig einen Nachrichtentyp aus
    const messageTypes = ['schoko', 'vanille', 'erdbeer'];
    const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
    
    return { x, y, radius, color, dx: 0, dy: 0, state, target, lastOutput, shouldDisplay, positionOccupied, messageType };
}

function updateMovingMushrooms() {
    const now = Date.now();
    movingMushrooms.forEach(mushroom => {
        if (mushroom.state === 'moveToMiddle' || mushroom.state === 'moveToGreen') {
            // Berechne die Bewegung in Richtung Ziel
            const angle = Math.atan2(mushroom.target.y - mushroom.y, mushroom.target.x - mushroom.x);
            mushroom.dx = Math.cos(angle) * 2;
            mushroom.dy = Math.sin(angle) * 2;
            mushroom.x += mushroom.dx;
            mushroom.y += mushroom.dy;

            // Überprüfen, ob das Ziel erreicht wurde
            if (Math.abs(mushroom.x - mushroom.target.x) < 5 && Math.abs(mushroom.y - mushroom.target.y) < 5) {
                if (mushroom.state === 'moveToMiddle') {
                    // Suche einen freien Platz unter den kleinen grünen Kreisen
                    let freePosition = smallCirclePositions.find(pos => !pos.occupied);

                    if (freePosition) {
                        freePosition.occupied = true; // Belege die Position
                        mushroom.state = 'moveToGreen';
                        mushroom.target = { x: freePosition.x, y: freePosition.y };
                        mushroom.positionOccupied = false;
                    } else {
                        mushroom.state = 'wait';
                        mushroom.target = { x: canvas.width / 2, y: canvas.height * 2 / 3 }; // Zurück in die Mitte des unteren Drittels
                    }
                } else if (mushroom.state === 'moveToGreen') {
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
    movingMushrooms.forEach(mushroom => {
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
            setTimeout(() => {
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
    const now = Date.now();
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
