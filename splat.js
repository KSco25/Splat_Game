let backgroundImage;
let blaster;
let shotsFired = 0;
let gameState = 'playing';
let splatters = [];
let splatterCoverageMin = 0.02; // 2%
let splatterCoverageMax = 0.05; // 5%
let maxShots = 10;

function preload() {
  backgroundImage = loadImage('your_image.jpg'); // Replace 'your_image.jpg' with your image file name
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  blaster = createBlaster();
}

function draw() {
  background(backgroundImage);

  if (gameState === 'playing') {
    updateBlasterPosition();
    drawBlaster();
    drawSplatters();
    displayShotCount();

    if (shotsFired >= maxShots) {
      gameState = 'gameOver';
    }
  } else if (gameState === 'gameOver') {
    displayGameOverScreen();
  }
}

function mousePressed() {
  if (gameState === 'playing') {
    shootYogurt();
  } else if (gameState === 'gameOver') {
    resetGame();
  }
}

function createBlaster() {
  return {
    x: mouseX,
    y: mouseY,
    size: 40,
    color: color(50, 50, 50), // Dark grey blaster
    accentColor: color(200, 200, 200) // Light grey accent
  };
}

function updateBlasterPosition() {
  blaster.x = mouseX;
  blaster.y = mouseY;
}

function drawBlaster() {
  push();
  translate(blaster.x, blaster.y);

  // Main body
  fill(blaster.color);
  rectMode(CENTER);
  rect(0, 0, blaster.size, blaster.size / 2, 5);

  // Barrel
  fill(blaster.accentColor);
  rect(blaster.size / 2, 0, blaster.size / 3, blaster.size / 8, 2);

  // Handle
  fill(blaster.color);
  arc(-blaster.size / 4, blaster.size / 4, blaster.size / 2, blaster.size / 2, 0, PI);

  pop();
}

function shootYogurt() {
  shotsFired++;
  createSplatter(blaster.x, blaster.y);
}

function createSplatter(x, y) {
  let splatterSizePercentage = random(splatterCoverageMin, splatterCoverageMax);
  let splatterArea = width * height * splatterSizePercentage;
  let splatterRadius = sqrt(splatterArea / PI); // Approximate radius for irregular shape

  let splatterPoints = [];
  let numPoints = 20; // Number of points to define the irregular shape
  for (let i = 0; i < numPoints; i++) {
    let angle = map(i, 0, numPoints, 0, TWO_PI);
    let radiusVariation = random(0.5, 1.5); // Vary radius for irregularity
    let px = x + cos(angle) * splatterRadius * radiusVariation;
    let py = y + sin(angle) * splatterRadius * radiusVariation;
    splatterPoints.push(createVector(px, py));
  }

  splatters.push({
    points: splatterPoints,
    color: color(255, 250, 240, 200) // Creamy yogurt color, slightly transparent
  });
}

function drawSplatters() {
  noStroke();
  for (let splatter of splatters) {
    fill(splatter.color);
    beginShape();
    for (let point of splatter.points) {
      vertex(point.x, point.y);
    }
    endShape(CLOSE);
  }
}

function displayShotCount() {
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`Shots: ${shotsFired}/${maxShots}`, 10, 10);
}


function displayGameOverScreen() {
  background(0, 150); // Semi-transparent black overlay
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Over!", width / 2, height / 2 - 40);
  textSize(24);
  text("Click to Play Again", width / 2, height / 2 + 20);
}

function resetGame() {
  gameState = 'playing';
  shotsFired = 0;
  splatters = [];
}