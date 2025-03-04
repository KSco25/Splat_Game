import React, { useEffect, useRef } from 'react';
import Sketch from 'react-p5';

const YogurtBlasterGame = () => {
  const blasterRef = useRef({
    x: 0,
    y: 0,
    shots: 0,
    gameOver: false,
    splatters: [],
    backgroundImage: null,
    loading: true
  });

  const preload = (p5) => {
    // Load image with proper error handling
    p5.loadImage('target.jpg', 
      // Success callback
      (img) => {
        blasterRef.current.backgroundImage = img;
        blasterRef.current.loading = false;
      },
      // Error callback
      (err) => {
        console.error('Error loading image:', err);
        blasterRef.current.loading = false;
      }
    );
  };

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(600, 400);
    canvas.parent(canvasParentRef);
    p5.noStroke();
  };

  const drawBlaster = (p5) => {
    // Space blaster sprite
    p5.push();
    p5.translate(blasterRef.current.x, blasterRef.current.y);
    p5.rotate(p5.PI / 4);
    
    // Blaster body
    p5.fill(100, 150, 200);
    p5.rect(-20, -10, 40, 20, 5);
    
    // Blaster barrel
    p5.fill(80, 120, 180);
    p5.rect(20, -5, 15, 10);
    
    p5.pop();
  };

  const drawSplatters = (p5) => {
    blasterRef.current.splatters.forEach(splatter => {
      p5.push();
      p5.fill(splatter.color);
      p5.translate(splatter.x, splatter.y);
      p5.rotate(splatter.rotation);
      
      // Irregular splatter shape
      p5.beginShape();
      splatter.points.forEach(pt => {
        p5.vertex(pt.x, pt.y);
      });
      p5.endShape(p5.CLOSE);
      
      p5.pop();
    });
  };

  const generateSplatterPoints = (p5, x, y) => {
    const points = [];
    const numPoints = p5.random(5, 10);
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: p5.random(-30, 30),
        y: p5.random(-30, 30)
      });
    }
    return points;
  };

  const shootYogurt = (p5) => {
    if (blasterRef.current.shots >= 10) {
      blasterRef.current.gameOver = true;
      return;
    }

    const splatterColor = p5.color(
      p5.random(200, 255), 
      p5.random(200, 255), 
      p5.random(200, 255), 
      200
    );

    blasterRef.current.splatters.push({
      x: blasterRef.current.x,
      y: blasterRef.current.y,
      color: splatterColor,
      rotation: p5.random(0, p5.TWO_PI),
      points: generateSplatterPoints(p5, blasterRef.current.x, blasterRef.current.y)
    });

    blasterRef.current.shots++;
  };

  const draw = (p5) => {
    // Clear the canvas
    p5.clear();

    // Check if image is loaded
    if (blasterRef.current.loading) {
      p5.background(200);
      p5.fill(0);
      p5.textSize(20);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('Loading...', p5.width/2, p5.height/2);
      return;
    }

    // Draw background if image is loaded
    if (blasterRef.current.backgroundImage) {
      p5.image(blasterRef.current.backgroundImage, 0, 0, p5.width, p5.height);
    }

    // Update blaster position to mouse
    blasterRef.current.x = p5.mouseX;
    blasterRef.current.y = p5.mouseY;

    // Draw existing splatters
    drawSplatters(p5);

    // Draw blaster
    drawBlaster(p5);

    // Game over screen
    if (blasterRef.current.gameOver) {
      p5.fill(0, 0, 0, 200);
      p5.rect(0, 0, p5.width, p5.height);
      p5.fill(255);
      p5.textSize(32);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('Game Over!\nClick to Play Again', p5.width/2, p5.height/2);
    }
  };

  const mousePressed = (p5) => {
    if (blasterRef.current.gameOver) {
      // Reset game
      blasterRef.current.shots = 0;
      blasterRef.current.splatters = [];
      blasterRef.current.gameOver = false;
    } else {
      // Shoot yogurt
      shootYogurt(p5);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="border-4 border-blue-500">
        <Sketch 
          preload={preload}
          setup={setup} 
          draw={draw}
          mousePressed={mousePressed}
        />
      </div>
    </div>
  );
};

export default YogurtBlasterGame;