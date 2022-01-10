// CS30 Major Project - ShellShock
// Md Shaurov
// January 27, 2022
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let shellshockLogoImg;
let leftTank, rightTank, bullet;
let turn, leftTurn, rightTurn;
let rectHeights = [];
let numberOfRects;
let gameOn;
let userInfo, rectWidth;
let startScreen = true;
let tankTouchGround;
let leftTextBox, rightTextBox, leftInputButton, rightInputButton;
let leftTankName, rightTankName;
let leftTankReady = false;
let rightTankReady= false;

function preload() {
  shellshockLogoImg = loadImage("assets/shellshock-logo.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  numberOfRects = width;
  generateTerrain();

  leftTank = new Tank(100, 100);
  rightTank = new Tank(width-100, height-100);

  turn = random(0, 100);
  if (turn > 50) {
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
  displayTerrain();
  keyPressed();

  interfaceScreens();


  leftTank.physics();
  leftTank.update();
  leftTank.display();

  rightTank.physics();
  rightTank.update();
  rightTank.display();
}

function keyPressed() {
  if (keyIsDown(13)) {
    startScreen = false;
    userInfo = true;
  }
  if (keyIsDown(68)) {
    if (leftTank.x >= 0 + leftTank.width/2 && leftTank.x < width - leftTank.width/2) {
      leftTank.x++;
    }
  }
  if (keyIsDown(65)) {
    if (leftTank.x > 0 + leftTank.width/2 && leftTank.x <= width - leftTank.width/2) {
      leftTank.x--;
    }
  }
  // if (keyIsDown(32)) {
  //   leftTank.x = mouseX;
  //   leftTank.y = mouseY;
  // }
}

function mousePressed() {

  // Shoots bullet
  if (leftTurn && mouseIsPressed) {
    rectMode(CENTER);
    leftTank.shootBullet(leftTank.x, leftTank.y);
  }
  else if (rightTurn && mouseIsPressed) {
    rectMode(CENTER);
    rightTank.shootBullet(rightTank.x, rightTank.y);
  }
}

function mouseWheel(event) {

  // Increases and decreases bullet speed
  if (leftTank.bulletSpeed >= 3 && leftTank.bulletSpeed <= 103) {
    leftTank.bulletSpeed -= event.delta/100;
    if (leftTank.bulletSpeed <= 2) {
      leftTank.bulletSpeed = 3;
    }
    else if (leftTank.bulletSpeed >= 104) {
      leftTank.bulletSpeed = 103;
    }
  }
}

function main() {

}

function interfaceScreens() {

  // Game logo
  if (startScreen || userInfo) {
    imageMode(CENTER);
    image(shellshockLogoImg, width/2, height/5);
  }
  if (startScreen && !userInfo) {

    // Prompt to start
    textSize(20);
    textAlign(CENTER);
    text("Press ENTER to start!", width/2, height/2);
  }
  else if (!startScreen && userInfo) {

    // Text box & button for name of left tank input
    leftTextBox = createInput("How so");
    leftTextBox.size(150, 20);
    leftTextBox.position(width/4 - leftTextBox.width/2, height/2 - leftTextBox.height);

    leftInputButton = createButton("Submit");
    leftInputButton.position(width/4 - leftInputButton.width/2, height/2 + leftTextBox.height/3);

    // Text box & button for name of right tank input
    rightTextBox = createInput("");
    rightTextBox.size(150, 20);
    rightTextBox.position(width*0.75 - rightTextBox.width/2, height/2 - rightTextBox.height);

    rightInputButton = createButton("Submit");
    rightInputButton.position(width*0.75 - rightInputButton.width/2, height/2 + rightTextBox.height/3);

    // Name input prompt
    textSize(24);
    text("Enter LEFT TANK name:", width/4, height/2 - leftTextBox.height*1.5);
    text("Enter RIGHT TANK name:", width*0.75, height/2 - rightTextBox.height*1.5);
  }

  if (leftTankReady === true && rightTankReady === true) {
    userInfo = false;
    gameOn = true;
    leftTextBox.remove();
    leftInputButton.remove();
    rightTextBox.remove();
    rightInputButton.remove();
  }
}

function displayTerrain() {

  // Show terrain
  rectWidth = width/rectHeights.length;
  rectMode(CORNER);
  for (let i=0; i<rectHeights.length; i++) {
    fill(255);
    noStroke();
    rect(rectWidth*i, height - rectHeights[i], 10, rectHeights[i]);
  }
}

function generateTerrain() {

  // Generate noise array for terrain
  let time = 0;
  for (let i=0; i<numberOfRects; i++) {
    let theHeight = noise(time) * height/2;
    rectHeights.push(theHeight);
    time += 0.0015;
  }
}

class Tank {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.bulletArray = [];
    this.bulletSpeed = 53;
    this.health = 100;
  }

  display() {
    if (!this.isDead()) {

      // Show health points
      rectMode(CENTER);
      fill("green");
      rect(this.x, this.y - this.height*1.5, this.health/2, 10);

      // Show bullet power representation
      rectMode(CENTER);
      fill(255, 255, 0, 30);
      circle(this.x, this.y, 150);
      fill(255, 255, 0, 60);
      circle(this.x, this.y, (this.bulletSpeed - 3)*1.5);

      // Show tank
      fill("red");
      rectMode(CENTER);
      rect(this.x, this.y, this.width, this.height);
  
    }
  }

  update() {

    // Update/remove bullet
    for (let bullet of this.bulletArray) {
      bullet.update();
      bullet.display();
      if (this.bulletArray.length >= 2) {
        this.bulletArray.shift();
      }
    }

    // if (this.bulletArray.length > 0) {
    //   if (this.bulletArray[0].x > this.x - this.width/2 && bullet.x < this.x + this.width/2 && bullet.y > this.y - height/2 && bullet.y < this.y + height/2) {
    //     this.health -= 20;
    //     this.bulletArray.shift();
    //   }
    // }
    
  }

  physics() {

    angleMode(DEGREES);
    let angleToTerrain = atan2(mouseY - this.y, mouseX - this.x);

    translate(this.x, this.y);
    rotate(angleToTerrain);

    // Tank interaction with terrain
    for (let i=0; i<rectHeights.length; i++) {
      tankTouchGround = collidePointRect(this.x, this.y + this.height/2 + 1, rectWidth*i, height - rectHeights[i], 10, rectHeights[i]);
      if (tankTouchGround) {
        break;
      }
      while (!tankTouchGround) {
        this.y += 1;
        if (this.y >= height - rectHeights[i] - this.height/2) {
          this.y = height - rectHeights[i] - this.height/2;
          break;
        }
      }
    }
  }

  isDead() {
    if (this.health <= 0) {
      return true;
    }
  }

  shootBullet(x, y) {

    // Aiming and shooting the bullet
    angleMode(DEGREES);
    let angleToMouse = atan2(mouseY - this.y, mouseX - this.x);
    
    let bullet = new Bullet(x, y, angleToMouse, (this.bulletSpeed - 3)/10);
    this.bulletArray.push(bullet);
  }
}

class Bullet {
  constructor(x, y, angle, speed) {
    this.x = x;
    this.y = y;
    this.speedX = speed;
    this.speedY = speed;
    this.angle = angle;
  }

  physics() {
  }

  update() {

    // Bullet physics
    this.speedY -= 0.07;
    this.x += cos(this.angle) * this.speedX;
    this.y += sin(this.angle) * this.speedY;
  }

  display() {

    // Show bullet
    rectMode(CENTER);
    fill(255);
    circle(this.x, this.y, 5);
  }
}