// CS30 Major Project
// Md Shaurov
// January 7, 2022
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let leftTank, rightTank, bullet;
let leftTurn, rightTurn;
let rectHeights = [];
let numberOfRects;

function setup() {
  createCanvas(windowWidth, windowHeight);
  numberOfRects = width;
  generateTerrain();

  leftTank = new Tank(100, 100);
  
  let turn = random(0, 1);
  if (turn > 0) {
    rightTurn = true;
    leftTurn = false;
  }
  else {
    leftTurn = true;
    rightTurn = false;
  }
}

function draw() {
  background(0);

  leftTank.update();
  leftTank.display();
  displayTerrain();
}

function mousePressed() {
  if (mouseIsPressed) {
    leftTank.shootBullet(leftTank.x, leftTank.y);
  }
}

function displayTerrain() {
  let theWidth = width/rectHeights.length;
  for (let i=0; i<rectHeights.length; i++) {
    let theHeight = rectHeights[i];
    fill(255);
    rect(theWidth*i, height, 10, -theHeight);
  }
}

function generateTerrain() {
  let time = 0;
  for (let i=0; i<numberOfRects; i++) {
    let theHeight = noise(time) * height/2;
    rectHeights.push(theHeight);
    time += 0.002;
  }
}

class Tank {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.bulletArray = [];
  }

  display() {
    rect(this.x, this.y, this.width, this.height);
  }

  update() {
    if (keyIsDown(68)) {
      if (this.x >= 0) {
        this.x++;
      }
    }
    if (keyIsDown(65)) {
      if (this.x > 0) {
        this.x--;
      }
    }

    for (let bullet of this.bulletArray) {
      bullet.update();
      bullet.display();
      if (this.bulletArray.length >= 2) {
        this.bulletArray.shift();
      }
    }
  }

  shootBullet(x, y) {
    angleMode(DEGREES);
    let theta = atan2(mouseY - this.y, mouseX - this.x);
    
    let bullet = new Bullet(x, y, theta);
    this.bulletArray.push(bullet);
  }
}

class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.speed = 3;
    this.angle = angle;
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
  }

  display() {
    circle(this.x, this.y, 5);
  }
}