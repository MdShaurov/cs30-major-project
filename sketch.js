// CS30 Major Project
// Md Shaurov
// february 14, 2021
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let leftTank, rightTank, bullet;
let leftTurn, rightTurn;

function setup() {
  createCanvas(windowWidth, windowHeight);

  leftTank = new Tank(100, 700);
  
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
  background(220);

  leftTank.shootBullet();
  leftTank.update();
  leftTank.display();
}


class Tank {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.bulletArray = [];
  }

  display() {
    rect(this.x, this.y, 20, 20);
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

  shootBullet() {
    if (keyIsDown(65)) {
      let bullet = new Bullet(this.x, this.y);
      this.bulletArray.push(bullet);
    }
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 3;
    this.dy = 3;
  }

  update() {
    this.x += this.dx;
  }

  display() {
    circle(this.x, this.y, 5, 5);
  }
}