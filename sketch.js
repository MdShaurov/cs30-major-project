// CS30 Major Project - ShellShock
// Md Shaurov
// January 27, 2022
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let shellshockLogoImg, blueTankImg, redTankImg, backgroundImg;
let shotSfx;
let leftTank, rightTank, bullet;
let turn, leftTurn, rightTurn;
let rectHeights = [];
let numberOfRects;
let gameOn, gameOver;
let removeBullet;
let userInfo, rectWidth;
let startScreen = true;
let leftTextBox, rightTextBox, leftInputButton, rightInputButton, startElements;
let leftTankName = "";
let rightTankName = "";
let leftButtonCreate = true;
let rightButtonCreate = true;
let leftTextCreate = true;
let rightTextCreate = true;
let leftTankReady = false;
let rightTankReady= false;
let lastSwitchStart = 0;

function preload() {
  shellshockLogoImg = loadImage("assets/menu/shellshock-logo.png");
  blueTankImg = loadImage("assets/tank/blueTank.png");
  redTankImg = loadImage("assets/tank/redTank.png");
  backgroundImg = loadImage("assets/background/background.jpg");
  shotSfx = loadSound("assets/sound/shotSfx.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  numberOfRects = width;
  generateTerrain();


  turn = random(0, 100);
  if (turn > 50) {
    rightTurn = true;
    leftTurn = false;
  }
  else {
    leftTurn = true;
    rightTurn = false;
  }

  leftTank = new Tank(400, 100, 0);
  rightTank = new Tank(width-400, 100, 1);
}

function draw() {
  background(0);
  displayTerrain();
  keyPressed();

  interfaceScreens();
  playerInteractions();

  leftTank.physics();
  leftTank.update();
  leftTank.display(leftTankName);

  rightTank.physics();
  rightTank.update();
  rightTank.display(rightTankName);

}

function keyPressed() {
  if (keyIsDown(13)) {
    startScreen = false;
    userInfo = true;
  }
  if (gameOn && leftTurn) {
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
  }
  if (gameOn && rightTurn) {
    if (keyIsDown(39)) {
      if (rightTank.x >= 0 + rightTank.width/2 && rightTank.x < width - rightTank.width/2) {
        rightTank.x++;
      }
    }
    if (keyIsDown(37)) {
      if (rightTank.x > 0 + rightTank.width/2 && rightTank.x <= width - rightTank.width/2) {
        rightTank.x--;
      }
    }
  }
}

function mousePressed() {

  // Shoots bullet
  if (gameOn) {
    if (leftTurn && mouseIsPressed && !leftTank.isDead()) {
      rectMode(CENTER);
      leftTank.shootBullet(leftTank.x, leftTank.y - leftTank.height*0.7);
      shotSfx.play();

      leftTurn = false;
      rightTurn = true;
    }
    else if (rightTurn && mouseIsPressed && !rightTank.isDead()) {
      rectMode(CENTER);
      rightTank.shootBullet(rightTank.x, rightTank.y - rightTank.height*0.7);
      shotSfx.play();

      rightTurn = false;
      leftTurn = true;
    }
  }
}

function mouseWheel(event) {

  // Increases and decreases bullet speed
  if (gameOn) {
    if (leftTank.bulletSpeed >= 3 && leftTank.bulletSpeed <= 103 && leftTurn) {
      leftTank.bulletSpeed -= event.delta/100;
      if (leftTank.bulletSpeed <= 2) {
        leftTank.bulletSpeed = 3;
      }
      else if (leftTank.bulletSpeed >= 104) {
        leftTank.bulletSpeed = 103;
      }
    }
    if (rightTank.bulletSpeed >= 3 && rightTank.bulletSpeed <= 103 && rightTurn) {
      rightTank.bulletSpeed -= event.delta/100;
      if (rightTank.bulletSpeed <= 2) {
        rightTank.bulletSpeed = 3;
      }
      else if (rightTank.bulletSpeed >= 104) {
        rightTank.bulletSpeed = 103;
      }
    }
  }
}

function interfaceScreens() {

  // Game logo
  if (startScreen || userInfo && !gameOn && !gameOver) {
    imageMode(CENTER);
    image(shellshockLogoImg, width/2, height/5);
  }
  if (startScreen && !userInfo && !gameOn && !gameOver) {

    // Prompt to start

    textSize(20);
    textAlign(CENTER);
    if (frameCount % 120 < 60) {
      fill(255, 255, 255, alpha);
      text("Press ENTER to start!", width/2, height/2);
    }
  }
  else if (!startScreen && userInfo && !gameOn && !gameOver) {

    // Name input prompt
    textSize(24);
    text("Enter LEFT TANK name:", width/4, height/2 - 30*1.5);
    text("Enter RIGHT TANK name:", width*0.75, height/2 - 30*1.5);

    if (leftTextCreate && rightTextCreate && leftButtonCreate && rightButtonCreate) {
      // Text box & button for name of left tank input
      leftTextBox = createInput("");
      leftTextBox.size(150, 20);
      leftTextBox.position(width/4 - leftTextBox.width/2, height/2 - leftTextBox.height);
      leftTextCreate = false;

      leftInputButton = createButton("Submit");
      leftInputButton.position(width/4 - leftInputButton.width/2, height/2 + leftTextBox.height/3);
      leftInputButton.mousePressed(leftInput);
      leftButtonCreate = false;

      // Text box & button for name of right tank input
      rightTextBox = createInput("");
      rightTextBox.size(150, 20);
      rightTextBox.position(width*0.75 - rightTextBox.width/2, height/2 - rightTextBox.height);
      rightTextCreate = false;

      rightInputButton = createButton("Submit");
      rightInputButton.position(width*0.75 - rightInputButton.width/2, height/2 + rightTextBox.height/3);
      rightInputButton.mousePressed(rightInput);
      rightButtonCreate = false;
    }
  }

  if (leftTankReady === true && rightTankReady === true) {
    userInfo = false;
    gameOn = true;
    gameOver = false;
    leftTextBox.remove();
    leftInputButton.remove();
    rightTextBox.remove();
    rightInputButton.remove();
  }
}

function leftInput() {
  leftTankName = leftTextBox.value();
  // if (leftTankName.length < 1) {
  //   let temp = frameCount + 180;
  //   while (frameCount < temp) {
  //     textSize(24);
  //     textAlign(CENTER);
  //     text("Name is too short!", width/4, height*0.60);
  //     text("Must be at least 1 character!", width/4, height*0.75);
  //   }
  // } 
  // else if (leftTankName.length > 15) {
  //   let temp = frameCount + 180;
  //   while (frameCount < temp) {
  //     textSize(24);
  //     textAlign(CENTER);
  //     text("Name is too long!", width/4, height*0.60);
  //     text("Must be less than 15 characters long!", width/4, height*0.75);
  //   }
  // }
  // else {
  //   leftTankReady = true;
  // }
  leftTankReady = true;
}

function rightInput() {
  rightTankName = rightTextBox.value();
  rightTankReady = true;
}

function playerInteractions() {

  // push();
  // let angleToMouse = atan2(mouseY - leftTank.y, mouseX - leftTank.x);

  // fill("blue");
  // translate(leftTank.x, rightTank.y)
  // rotate(angleToMouse);
  // rect(0, 0, 20, 5);
  // pop()

  // Show bullet power representation
  if(gameOn) {
    if (leftTurn && !rightTurn && !leftTank.isDead()) {
      push();
      rectMode(CENTER);
      noStroke();
      fill(255, 255, 0, 30);
      ellipse(leftTank.x, leftTank.y, 500, 500);

      let angleToMouse = atan2(mouseY - leftTank.y, mouseX - leftTank.x);

      fill(255, 255, 0, 60);
      translate(leftTank.x, leftTank.y);
      rotate(angleToMouse);
      arc(0, 0, (leftTank.bulletSpeed - 3)*5, 500, 0, PI*2.5);
      pop();
    }
    else if (rightTurn && !leftTurn && !rightTank.isDead()) {
      push();
      rectMode(CENTER);
      noStroke();
      fill(255, 255, 0, 25);
      ellipse(rightTank.x, rightTank.y, 500, 500);

      let angleToMouse = atan2(mouseY - rightTank.y, mouseX - rightTank.x);

      fill(255, 255, 0, 50);
      translate(rightTank.x, rightTank.y);
      rotate(angleToMouse);
      arc(0, 0, (rightTank.bulletSpeed - 3)*5, 500, 0, PI*2.5);
      pop();
    }

    if (leftTank.bulletArray.length > 0) {
      if (leftTank.bulletArray[0].x > rightTank.x - rightTank.width/2 && leftTank.bulletArray[0].x < rightTank.x + rightTank.width/2 && leftTank.bulletArray[0].y > rightTank.y - rightTank.height/2 && leftTank.bulletArray[0].y < rightTank.y + rightTank.height/2) {
        removeBullet = true;
        rightTank.health -= 20;
      }
    }
    if (rightTank.bulletArray.length > 0) {
      if (rightTank.bulletArray[0].x > leftTank.x - leftTank.width/2 && rightTank.bulletArray[0].x < leftTank.x + leftTank.width/2 && rightTank.bulletArray[0].y > leftTank.y - leftTank.height/2 && rightTank.bulletArray[0].y < leftTank.y + leftTank.height/2) {
        removeBullet = true;
        leftTank.health -= 20;
      }
    }
  }
}

function displayTerrain() {
  // backgroundImg.size(width, height);

  // Show terrain
  rectWidth = width/rectHeights.length;
  rectMode(CORNER);
  for (let i=0; i<rectHeights.length; i++) {
    fill(255);
    noStroke();
    rect(rectWidth*i, height - rectHeights[i], 1, rectHeights[i]);
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
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 30;
    this.theColor = color;
    this.bulletArray = [];
    this.bulletSpeed = 53;
    this.health = 100;
    this.angleToTerrain, this.angleToMouse, this.tankTouchGround, this.removeBullet;
  }

  display(name) {
    if (!this.isDead()) {

      // Show tank
      for (let i=0; i<rectHeights.length; i++) {
        if (i === this.x) {
          angleMode(DEGREES);
          this.angleToTerrain = atan2(height - rectHeights[i+4] - (this.y + this.height/2), rectWidth*(i+4) - this.x);
          break;
        }
      }

      // Show health points
      if (gameOn) {
        push();
        rectMode(CENTER);
        textSize(24);
        textAlign(CENTER);
        fill(255);
        text(name, this.x, this.y - this.height*2);

        fill("green");
        translate(this.x, this.y - this.height*1.5);
        rect(0, 0, this.health/2, 10);
        pop();
      }
      
      // Show tank
      push();
      rectMode(CENTER);
      translate(this.x, this.y);
      rotate(this.angleToTerrain);
      if (this.theColor === 0) {
        image(blueTankImg, 0, 0, this.width, this.height);
      }
      else {
        image(redTankImg, 0, 0, this.width, this.height);
      }
      pop();
    }
  }

  update() {

    // Update/remove bullet
    for (let bullet of this.bulletArray) {
      bullet.update();
      bullet.physics();
      bullet.display();

      if (removeBullet) {
        this.removeBullet = true;
      }

      // if (this.bulletArray[bullet].x > this.x - this.width/2 && this.bulletArray[bullet].x < this.x + this.width/2 && this.bulletArray[bullet].y > this.y - this.height/2 && this.bulletArray[bullet].y < this.y + this.height/2) {
        
      // }

      if (this.bulletArray.length >= 2 || this.removeBullet || bullet.x < 0 || bullet.x > width) {
        this.bulletArray.shift();
        removeBullet = false;
        this.removeBullet = false;
      }
    }
  }

  physics() {

    // Tank interaction with terrain
    for (let i=0; i<rectHeights.length; i++) {
      this.tankTouchGround = collidePointRect(this.x, this.y + this.height/2 + 1, rectWidth*i, height - rectHeights[i], 1, rectHeights[i]);

      if (this.tankTouchGround) {
        break;
      }

      while (!this.tankTouchGround) {
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
    this.angleToMouse = atan2(mouseY - this.y, mouseX - this.x);
    
    let bullet = new Bullet(x, y, this.angleToMouse, (this.bulletSpeed - 3)/10);
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
    this.radius = 5;
    this.bulletTouchGround;
  }

  physics() {

    // Bullet interation with terrain
    for (let i=0; i<rectHeights.length; i++) {
      this.bulletTouchGround = collidePointRect(this.x, this.y, rectWidth*i, height - rectHeights[i], 1, rectHeights[i]);

      if (this.bulletTouchGround) {
        removeBullet = true;
      }
    }
  }

  update() {

    // Bullet movement
    console.log(this.angle);
    this.x += cos(this.angle) * this.speedX;
    this.y += sin(this.angle) * this.speedY;
    if (this.angle > 0) {
      this.speedY += 0.07;
    }
    else {
      this.speedY -= 0.07;
    }
  }

  display() {

    // Show bullet
    rectMode(CENTER);
    fill(255);
    circle(this.x, this.y, this.radius);
  }
}