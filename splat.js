let img;
let blaster;
let yogurtBalls = [];
let splats = [];
let score = 0;
let startTime;
let gameOver = false;
let coverage = 0;
let targetCoverage = 25; // Target is 25% coverage
let coveredAreas = []; // Track circular areas instead of pixels
let loading = true;

function preload() {
  img = loadImage('target.jpg', () => {
    loading = false;
  });
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  
  blaster = {
    x: width / 2,
    y: height - 50,
    angle: 0,
    size: 40
  };
  
  startTime = millis();
  coveredAreas = [];
}

function draw() {
  background(220);
  
  if (loading) {
    drawLoadingScreen();
    return;
  }

  // Draw background image
  image(img, width/2, height/2, width, height);
  
  // Update and draw yogurt balls
  updateYogurtBalls();
  
  // Draw splats
  drawSplats();
  
  // Draw blaster
  drawBlaster();
  
  // Draw HUD
  drawHUD();
  
  // Check win condition
  checkGameOver();
}

function updateYogurtBalls() {
  for (let i = yogurtBalls.length - 1; i >= 0; i--) {
    let ball = yogurtBalls[i];
    ball.x += ball.speed * cos(ball.angle);
    ball.y += ball.speed * sin(ball.angle);
    
    // Check collision with canvas
    if (ball.x < 0 || ball.x > width || ball.y < 0 || ball.y > height) {
      yogurtBalls.splice(i, 1);
      continue;
    }
    
    // Draw ball
    fill(255, 250, 220);
    noStroke();
    circle(ball.x, ball.y, 10);
    
    // Check collision with image area
    if (ball.y < height - 100) { // Avoid bottom area where blaster is
      createSplat(ball.x, ball.y);
      yogurtBalls.splice(i, 1);
      score++;
    }
  }
}

function createSplat(x, y) {
  let newSplat = {
    x: x,
    y: y,
    size: random(50, 100),
    coverage: random(0.02, 0.07), // 2-7% coverage
    deformPoints: [], // Points to create irregular shape
    alpha: 255,
    lifespan: 255
  };
  
  // Create irregular shape points
  let points = floor(random(6, 12));
  for (let i = 0; i < points; i++) {
    newSplat.deformPoints.push({
      angle: (TWO_PI / points) * i,
      rad: random(0.7, 1.3) // Deformation factor
    });
  }
  
  splats.push(newSplat);
  updateCoverage();
}

function drawSplats() {
  for (let splat of splats) {
    push();
    translate(splat.x, splat.y);
    fill(255, 250, 220, splat.alpha);
    noStroke();
    
    beginShape();
    for (let i = 0; i <= splat.deformPoints.length; i++) {
      let point = splat.deformPoints[i % splat.deformPoints.length];
      let rad = splat.size * point.rad;
      let x = cos(point.angle) * rad;
      let y = sin(point.angle) * rad;
      curveVertex(x, y);
    }
    endShape();
    pop();
  }
}

function updateCoverage() {
  let totalArea = width * height;
  let coveredArea = 0;
  
  for (let splat of splats) {
    coveredArea += (PI * splat.size * splat.size) * splat.coverage;
  }
  
  coverage = (coveredArea / totalArea) * 100;
}

function mousePressed() {
  if (!gameOver && !loading) {
    yogurtBalls.push({
      x: blaster.x,
      y: blaster.y,
      angle: blaster.angle,
      speed: 10
    });
  }
}

function mouseMoved() {
  if (!gameOver) {
    blaster.angle = atan2(mouseY - blaster.y, mouseX - blaster.x);
  }
}

function drawBlaster() {
  push();
  translate(blaster.x, blaster.y);
  rotate(blaster.angle);
  fill(100, 100, 255);
  noStroke();
  rect(-blaster.size/2, -blaster.size/4, blaster.size, blaster.size/2);
  pop();
}

function drawHUD() {
  fill(0);
  noStroke();
  textSize(20);
  textAlign(LEFT);
  
  let elapsedTime = (millis() - startTime) / 1000;
  text(`Time: ${elapsedTime.toFixed(1)}s`, 10, 30);
  text(`Coverage: ${coverage.toFixed(1)}%`, 10, 60);
  text(`Score: ${score}`, 10, 90);
}

function drawLoadingScreen() {
  fill(0);
  noStroke();
  textSize(30);
  textAlign(CENTER, CENTER);
  text('Loading...', width/2, height/2);
}

function checkGameOver() {
  if (coverage >= targetCoverage) {
    gameOver = true;
    let finalTime = (millis() - startTime) / 1000;
    
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('Victory!', width/2, height/2 - 40);
    textSize(24);
    text(`Time: ${finalTime.toFixed(1)} seconds`, width/2, height/2 + 10);
    text(`Final Coverage: ${coverage.toFixed(1)}%`, width/2, height/2 + 40);
  }
}