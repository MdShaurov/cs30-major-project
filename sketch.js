// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let leftTank, rightTank, bullet;

function setup() {
  createCanvas(windowWidth, windowHeight);

  leftTank = new Tank(100, 700);
}

function draw() {
  background(220);

  leftTank.update();
  leftTank.display();
}


class Tank {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
  }

  shootBullet() {
    if (mouseIsPressed) {
      bullet = new Bullet(mouseX, mouseY);
    }
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 3;
  }

  display() {
    circle(this.x, this.y, 5);
  }

  update() {
    this.x += this.dx;
  }
}