// CS30 Major Project - ShellShock
// Md Shaurov
// January 27, 2022
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let leftTank, rightTank, bullet;
let leftTurn, rightTurn;
let rectHeights = [];
let numberOfRects;
let gameOn;
let userInfo, rectWidth;
let startScreen = true;
let tankTouchGround, shellshockLogoImg;
let leftTextBox, rightTextBox, leftInputButton, rightInputButton;
let leftTankName, rightTankName;
let leftTankReady = false;
let rightTankReady= false;

function preload() {
  shellshockLogoImg = loadImage("assets/shellshock-logo.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  numberOfRects = width/10;
  generateTerrain();

  leftTank = new Tank(100, 100);
}

function draw() {
  background(0);
  displayTerrain();
  keyPressed();

  interfaceScreens();

  // leftTank.physics();
  // leftTank.update();
  // leftTank.display();
}

function keyPressed() {
  if (startScreen) {
    if (keyIsDown(13)) {
      startScreen = !startScreen;
      userInfo = true;
    }
  }
  else if (!startScreen) {
    if (keyIsDown(68)) {
      if (leftTank.x >= 0) {
        leftTank.x++;
      }
    }
    if (keyIsDown(65)) {
      if (leftTank.x > 0) {
        leftTank.x--;
      }
    }
    if (keyIsDown(32)) {
      leftTank.x = mouseX;
      leftTank.y = mouseY;
    }
  }
}

function mousePressed() {

  // Mouse interaction
  if (mouseIsPressed) {
    leftTank.shootBullet(leftTank.x, leftTank.y);
  }
}

function mouseWheel(event) {
  if (leftTank.bulletSpeed >= 3 && leftTank.bulletSpeed <= 13) {
    leftTank.bulletSpeed -= event.delta/100;
    if (leftTank.bulletSpeed <= 2) {
      leftTank.bulletSpeed = 3;
    }
    else if (leftTank.bulletSpeed >= 14) {
      leftTank.bulletSpeed = 13;
    }

function interfaceScreens() {
  if (startScreen && !userInfo) {
    rectMode(CENTER);
    rect(width/2, 100, 100, 75);
    textAlign(CENTER);
    textSize(18);
    text("Press ENTER to start!", width/2, height/2);
  }
  else if (!startScreen && userInfo) {
    textSize(18);
    textAlign(CENTER);
    text("Enter left tank name:", width*0.25, height/2);
    text("Enter right tank name:", width*0.75, height/2);
  }
}

function main() {
  let turn = random(0, 100);
  if (turn > 50) {
    rightTurn = true;
    leftTurn = false;
  }
  else {
    leftTurn = true;
    rightTurn = false;
  }
}

function interfaceScreens() {

  if (startScreen || userInfo) {
    imageMode(CENTER);
    image(shellshockLogoImg, width/2, height/5);
  }
  if (startScreen && !userInfo) {
    textSize(20);
    textAlign(CENTER);
    text("Press ENTER to start!", width/2, height/2);
  }
  else if (!startScreen && userInfo) {

    // Text box & button for name of left tank input
    leftTextBox = createInput("");
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

  if (leftInputButton.mousePressed(event)) {
    leftTankName = leftTextBox.value();
    leftTankReady = true;
  }
  if (rightInputButton.mousePressed(event)) {
    rightTankName = rightTextBox.value();
    rightTankReady = true;
  }

  if (leftTankReady === true && rightTankReady === true) {
    userInfo = false;
    gameOn = true;
  }
}

function displayTerrain() {
  rectWidth = width/rectHeights.length;
  rectMode(CORNER);
  for (let i=0; i<rectHeights.length; i++) {
    fill(255);
    noStroke();
    rect(rectWidth*i, height - rectHeights[i], 10, rectHeights[i]);
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
    this.bulletSpeed = 3;
  }

  display() {

    // Show bullet power representation
    rectMode(CENTER);
    fill(255, 255, 0, 30);
    circle(this.x, this.y, 150);
    fill(255, 255, 0, 50);
    circle(this.x, this.y, (this.bulletSpeed - 3) * 15);

    // Show tank
    fill("red");
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);
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
  }

  physics() {

    // Tank interaction with physical objects
    for (let i=0; i<rectHeights.length; i++) {
      tankTouchGround = collidePointRect(mouseX, mouseY, rectWidth*i, height - rectHeights[i], 10, rectHeights[i]);
      if (tankTouchGround) {
        break;
      }
    }

    for (let j=0; j<rectHeights.length; j++) {
      if (!tankTouchGround) {
        this.y += 1;
        if (this.y >= height - rectHeights[j] - this.height/2) {
          this.y = height - rectHeights[j] - this.height/2;
          break;
        }
      }
    }

  }

  shootBullet(x, y) {

    // Aiming and shooting the bullet
    angleMode(DEGREES);
    let angleToMouse = atan2(mouseY - this.y, mouseX - this.x);
    
    let bullet = new Bullet(x + this.width/2, y + this.height/2, angleToMouse, this.bulletSpeed);
    this.bulletArray.push(bullet);
  }
}

class Bullet {
  constructor(x, y, angle, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = angle;
  }

  physics() {

  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
  }

  display() {
    fill(255);
    circle(this.x, this.y, 5);
  }
}