// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  
  rect(mouseX, mouseY, 100, 50);
}

class Character {
  constructor(x, y, choice) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;

  }

  display() {
    image(characterImg, this.x, this.y);
  }
}