let bgImage;
let blaster;
let splatters = [];
let shotsRemaining = 10;
let gameOver = false;

function preload() {
    bgImage = loadImage('your_image.jpg');
}

function setup() {
    createCanvas(800, 600);
    // Create blaster sprite
    blaster = {
        x: width/2,
        y: height/2,
        display: function() {
            push();
            translate(this.x, this.y);
            rotate(atan2(mouseY - this.y, mouseX - this.x));
            // Draw blaster
            fill(200);
            rect(-20, -10, 40, 20);
            rect(0, -5, 30, 10);
            pop();
        },
        update: function() {
            // Smooth follow mouse
            this.x = lerp(this.x, mouseX, 0.1);
            this.y = lerp(this.y, mouseY, 0.1);
        }
    };
}

function draw() {
    if (!gameOver) {
        // Draw background
        image(bgImage, 0, 0, width, height);
        
        // Draw splatters
        for (let splatter of splatters) {
            fill(255, 255, 255, 180); // Semi-transparent white for yogurt
            beginShape();
            for (let point of splatter) {
                vertex(point.x, point.y);
            }
            endShape(CLOSE);
        }
        
        // Update and display blaster
        blaster.update();
        blaster.display();
        
        // Show remaining shots
        fill(0);
        textSize(24);
        text(`Shots remaining: ${shotsRemaining}`, 20, 30);
    }
}

function mousePressed() {
    if (!gameOver && shotsRemaining > 0) {
        // Create new splatter
        let splatterPoints = [];
        let centerX = mouseX;
        let centerY = mouseY;
        let points = random(8, 12);
        
        // Generate irregular shape
        for (let i = 0; i < points; i++) {
            let angle = map(i, 0, points, 0, TWO_PI);
            let radius = random(20, 50); // Controls splatter size
            let x = centerX + cos(angle) * radius;
            let y = centerY + sin(angle) * radius;
            splatterPoints.push({x, y});
        }
        
        splatters.push(splatterPoints);
        shotsRemaining--;
        
        if (shotsRemaining === 0) {
            gameOver = true;
            setTimeout(() => {
                if (confirm('Game Over! Play again?')) {
                    resetGame();
                }
            }, 500);
        }
    }
}

function resetGame() {
    splatters = [];
    shotsRemaining = 10;
    gameOver = false;
}