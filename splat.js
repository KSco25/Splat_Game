// Yogurt Blaster Face Cover Game in P5.js (No Face Detection)

let img;
let blaster; // Now an object with x, y, angle, and color
let yogurtBalls = [];
let splats = [];
let score = 0;
let startTime;
let gameOver = false;
let coverage = 0; // Percentage of image covered
let targetCoverage = 20; // Goal: 20% coverage (updated)
let coveredPixels = [];
let totalPixels;

function preload() {
  // Load the image (replace with your image URL or file)
  img = loadImage('your_image.jpg');
}

function setup() {
  createCanvas(img.width, img.height);
  // Initialize blaster as an object (no image)
  blaster = {
    x: width / 2,
    y: height / 2, // Start in the center
    angle: 0,
    color: color(50, 50, 200), // Dark blue color for the blaster
    size: 30, // Reduced the size, now a shape.
    width: 10, // the width of the base of the blaster
    height: 20 // the height of the blaster
  };
  startTime = millis();

  // Initialize coveredPixels array and totalPixels
  totalPixels = width * height;
  for (let x = 0; x < width; x++) {
    coveredPixels[x] = [];
    for (let y = 0; y < height; y++) {
      coveredPixels[x][y] = false; // Initially, no pixels are covered
    }
  }
}

function draw() {
  background(220);

  // Display the image
  image(img, 0, 0);

  // Update blaster position to follow mouse
  blaster.x = mouseX;
  blaster.y = mouseY;

  // Update and display yogurt balls
  for (let i = yogurtBalls.length - 1; i >= 0; i--) {
    yogurtBalls[i].update();
    yogurtBalls[i].display();

    // Check for collisions (now with any pixel) and create splats
    if (checkCollision(yogurtBalls[i])) {
      createSplats(yogurtBalls[i].x, yogurtBalls[i].y);
      yogurtBalls.splice(i, 1); // Remove the yogurt ball
      score++;
    } else if (yogurtBalls[i].isOffScreen()) {
      yogurtBalls.splice(i, 1); // Remove off-screen yogurt balls
    }
  }

  // Update and display splats
  for (let i = splats.length - 1; i >= 0; i--) {
    splats[i].update();
    splats[i].display();
    if (splats[i].isDone()) {
      splats.splice(i, 1); // Remove finished splats
    }
  }

  // Display the blaster
  displayBlaster();

  // Display score, timer, and coverage
  fill(0);
  textSize(20);
  text(`Score: ${score}`, 10, 30);

  let elapsedTime = (millis() - startTime) / 1000;
  text(`Time: ${elapsedTime.toFixed(1)}`, 10, 60);

  text(`Coverage: ${coverage.toFixed(1)}%`, 10, 90);

  // Game Over Logic
  if (elapsedTime >= 30 || coverage >= targetCoverage) {
    gameOver = true;
  }

  if (gameOver) {
    fill(255, 0, 0);
    textSize(40);
    text('GAME OVER!', width / 2 - 100, height / 2);
    textSize(20);
    text(`Final score: ${score}`, width / 2 - 60, height / 2 + 30);
    text(`Final Coverage: ${coverage.toFixed(1)}%`, width / 2 - 80, height / 2 + 60);
  }
}

function mouseMoved() {
  // Rotate the blaster towards the mouse
  let dx = mouseX - blaster.x;
  let dy = mouseY - blaster.y;
  blaster.angle = atan2(dy, dx);
}

function mousePressed() {
  if (!gameOver) {
    // Shoot a yogurt ball
    let ball = new YogurtBall(blaster.x, blaster.y, blaster.angle);
    yogurtBalls.push(ball);
  }
}

// --- Yogurt Ball Class ---
class YogurtBall {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 10;
    this.size = 15;
  }

  update() {
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
  }

  display() {
    fill(255, 250, 205); // Creamy yogurt color
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  isOffScreen() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}

// --- Splat Class ---
class Splat {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(20, 60);
    this.alpha = 255;
    this.lifespan = 100; // Number of frames to exist
    this.pixelsCovered = [];
    this.coveragePercentage = random(2, 7); // Random coverage between 2% and 7%
  }

  update() {
    this.lifespan--;
    this.alpha = map(this.lifespan, 100, 0, 255, 0);

    // Mark pixels as covered based on percentage
    if (this.lifespan > 0) {
      let pixelsToCover = Math.floor((this.coveragePercentage / 100) * totalPixels);
      let count = 0;

      while (count < pixelsToCover) {
          let pixelX = Math.floor(random(this.x-this.size/2,this.x+this.size/2));
          let pixelY = Math.floor(random(this.y-this.size/2,this.y+this.size/2));
          if (
            pixelX >= 0 &&
            pixelX < width &&
            pixelY >= 0 &&
            pixelY < height &&
            !coveredPixels[pixelX][pixelY]
          ) {
            coveredPixels[pixelX][pixelY] = true;
            count++;
          }
      }
      calculateCoverage(); // Update coverage percentage
    }
  }

  display() {
    fill(255, 250, 205, this.alpha); // Creamy yogurt color with transparency
    noStroke();
    ellipse(this.x + random(-5, 5), this.y + random(-5, 5), this.size); // Jitter for splatter effect
  }

  isDone() {
    return this.lifespan <= 0;
  }
}

// --- Helper Functions ---

function createSplats(x, y) {
  for (let i = 0; i < 5; i++) {
    splats.push(new Splat(x + random(-10, 10), y + random(-10, 10)));
  }
}

function checkCollision(ball) {
  //check if the ball's coordinates are within the canvas
  if (
    ball.x >= 0 &&
    ball.x < width &&
    ball.y >= 0 &&
    ball.y < height
  ) {
    return true;
  }
  return false;
}

function calculateCoverage() {
  let numCovered = 0;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (coveredPixels[x][y]) {
        numCovered++;
      }
    }
  }
  coverage = (numCovered / totalPixels) * 100;
}

function displayBlaster() {
  push();
  translate(blaster.x, blaster.y);
  rotate(blaster.angle);

  // Draw a shape to represent the blaster
  fill(blaster.color);
  noStroke();
  beginShape();
  vertex(-blaster.width/2, -blaster.height/2);
  vertex(blaster.width/2, -blaster.height/2);
  vertex(0, blaster.height/2);
  endShape(CLOSE);

  pop();
}
