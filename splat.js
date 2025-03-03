let img;
let blaster;
let yogurtBalls = [];
let splats = [];
let shotsLeft = 10;
let gameOver = false;
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
    x: mouseX, // Initialize at mouse position
    y: mouseY,
    angle: 0,
    size: 20, // Made blaster smaller
    color: color(100, 100, 255)
  };
}

function draw() {
  background(220);

  if (loading) {
    drawLoadingScreen();
    return;
  }

  image(img, width / 2, height / 2, width, height);
  updateYogurtBalls();
  drawSplats();
  drawBlaster();
  drawHUD();
  checkGameOver();
}

function updateYogurtBalls() {
  for (let i = yogurtBalls.length - 1; i >= 0; i--) {
    let ball = yogurtBalls[i];
    ball.x += ball.speed * cos(ball.angle);
    ball.y += ball.speed * sin(ball.angle);

    if (ball.x < 0 || ball.x > width || ball.y < 0 || ball.y > height) {
      yogurtBalls.splice(i, 1);
      continue;
    }

    fill(255, 250, 220);
    noStroke();
    circle(ball.x, ball.y, 10);

    // Create splat upon impact with target
    if (checkCollisionWithTarget(ball.x, ball.y)) { //New Collision Detection
      createSplat(ball.x, ball.y);
      yogurtBalls.splice(i, 1);
    }
  }
}

function checkCollisionWithTarget(x, y) {
  // Here, we're checking if the yogurt ball hits anywhere on the screen
  //which can be adjusted.
  return true;
}

function createSplat(x, y) {
  if (splats.length > 30) {
    splats.shift(); // Remove oldest splat if too many
  }

  let newSplat = {
    x: x,
    y: y,
    size: random(5, 10), // Drastically reduced splat size
    points: [],
    alpha: 255,
    lifespan: 100 // Set a lifespan for splats
  };

  let numPoints = floor(random(5, 8));
  for (let i = 0; i < numPoints; i++) {
    newSplat.points.push({
      angle: (TWO_PI / numPoints) * i,
      rad: random(0.8, 1.2)
    });
  }

  splats.push(newSplat);
}

function drawSplats() {
  for (let i = splats.length - 1; i >= 0; i--) {
    let splat = splats[i];
    splat.lifespan--;

    if (splat.lifespan <= 0) {
        splats.splice(i, 1);
    } else {
      push();
      translate(splat.x, splat.y);
      fill(255, 250, 220, splat.alpha);
      noStroke();

      beginShape();
      for (let j = 0; j <= splat.points.length; j++) {
        let point = splat.points[j % splat.points.length];
        let rad = splat.size * point.rad;
        let x = cos(point.angle) * rad;
        let y = sin(point.angle) * rad;
        curveVertex(x, y);
      }
      endShape(CLOSE);
      pop();
    }
  }
}

function mousePressed() {
  if (!gameOver && !loading && shotsLeft > 0) {
    yogurtBalls.push({
      x: blaster.x, // Start from the blaster's position
      y: blaster.y,
      angle: blaster.angle,
      speed: 10
    });
    shotsLeft--;
  }
}

function mouseMoved() {
  if (!gameOver) {
    // Smooth following of mouse
    blaster.x = mouseX;
    blaster.y = mouseY;
    blaster.angle = atan2(mouseY - blaster.y, mouseX - blaster.x);
  }
}

function drawBlaster() {
  push();
  translate(blaster.x, blaster.y);
  rotate(blaster.angle);
  fill(blaster.color);
  noStroke();
  rect(-blaster.size / 2, -blaster.size / 4, blaster.size, blaster.size / 2);
  pop();
}

function drawHUD() {
  fill(0);
  noStroke();
  textSize(20);
  textAlign(LEFT);
  text(`Shots Left: ${shotsLeft}`, 10, 30);
}

function drawLoadingScreen() {
  fill(0);
  noStroke();
  textSize(30);
  textAlign(CENTER, CENTER);
  text('Loading...', width / 2, height / 2);
}

function checkGameOver() {
  if (shotsLeft <= 0 && yogurtBalls.length === 0) {
    gameOver = true;

    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('Game Over!', width / 2, height / 2);
  }
}
