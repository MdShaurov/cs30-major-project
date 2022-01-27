// CS30 Major Project - Turn Based 2D Tank Game
// Md Shaurov
// January 27, 2022
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// Global variables
let shellshockLogoImg, blueTankImg, redTankImg, deadTankImg, backgroundImg, helpButtonImg, impactImg;
let startMusic, gameMusic;
let startMusicOn, gameMusicOn;
let shotSfx, moveSfx, groundHitSfx, tankHitSfx;
let leftTank, rightTank, bullet;
let turn, leftTurn, rightTurn;
let rectHeights, numberOfRects, rectWidth;
let startScreen, userInfo, gameOn, gameOver, instructionsOn;
let timer, timeSet, setTimer, seconds, minutes;
let removeBullet;
let leftHP, rightHP, setEndHp;
let leftTextBox, rightTextBox, leftInputButton, rightInputButton, startElements;
let leftTankName, rightTankName;
let fiveBox, tenBox, threeBox;
let nameElementsCreate, timeElementsCreate;
let leftTankReady, rightTankReady;

function preload() {
  shellshockLogoImg = loadImage("assets/image/menu/shellshock-logo.png");
  helpButtonImg = loadImage("assets/image/menu/help-button.png");
  impactImg = loadImage("assets/image/effects/impact.png");
  blueTankImg = loadImage("assets/image/tank/blue-tank.png");
  redTankImg = loadImage("assets/image/tank/red-tank.png");
  deadTankImg = loadImage("assets/image/tank/dead-tank.png");
  backgroundImg = loadImage("assets/image/background/background.jpg");
  startMusic = createAudio("assets/sound/music/start-music.mp3");
  gameMusic = createAudio("assets/sound/music/game-music.ogg");
  moveSfx = loadSound("assets/sound/tank/tank-engine-sfx.mp3");
  shotSfx = createAudio("assets/sound/tank/shot-sfx.ogg");
  tankHitSfx = createAudio("assets/sound/tank/tank-hit-sfx.ogg");
  groundHitSfx = createAudio("assets/sound/tank/ground-hit-sfx.ogg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  startScreen = true;
  instructionsOn = false;
  userInfo = false;
  gameOn = false;
  gameOver = false;
  startMusicOn = true;

  nameElementsCreate = true;
  timeElementsCreate = true;

  leftTankName = "";
  rightTankName = "";

  leftTankReady = false;
  rightTankReady = false;

  rectHeights = [];
  numberOfRects = width;
  generateTerrain();

  turn = random(0, 100);
  if (turn > 50) {
    rightTurn = true;
    leftTurn = false;
    turn = true;
  }
  else {
    leftTurn = true;
    rightTurn = false;
    turn = true;
  }

  leftTank = new Tank(200, 100, 0);
  rightTank = new Tank(width-200, 100, 1);
}

function draw() {
  background(0);
  displayTerrain();
  keyPressed();

  playerInteractions();

  leftTank.physics();
  leftTank.update();
  leftTank.display();

  rightTank.physics();
  rightTank.update();
  rightTank.display();

  interfaceScreens();
}

function keyPressed() {
  if(startScreen) {
    if (keyIsDown(13)) {
      startScreen = false;
      userInfo = true;
    }
  }
  if (gameOn && leftTurn) {
    if (keyIsDown(68)) {
      if (rightTank.bulletArray.length <= 0) {
        if (leftTank.x >= 0 + leftTank.width/2 && leftTank.x < width - leftTank.width/2) {

          moveSfx.playMode("untilDone");
          moveSfx.play();
          leftTank.x++;
        }
      }
    }
    else if (keyIsDown(65)) {
      if (rightTank.bulletArray.length <= 0) {
        if (leftTank.x > 0 + leftTank.width/2 && leftTank.x <= width - leftTank.width/2) {

          moveSfx.playMode("untilDone");
          moveSfx.play();
          leftTank.x--;
        }
      }
    }
    else {
      moveSfx.stop();
    }
  }
  if (gameOn && rightTurn) {
    if (keyIsDown(39)) {
      if (leftTank.bulletArray.length <= 0) {
        if (rightTank.x >= 0 + rightTank.width/2 && rightTank.x < width - rightTank.width/2) {

          moveSfx.playMode("untilDone");
          moveSfx.play();
          rightTank.x++;
        }
      }
    }
    else if (keyIsDown(37)) {
      if (leftTank.bulletArray.length <= 0) {
        if (rightTank.x > 0 + rightTank.width/2 && rightTank.x <= width - rightTank.width/2) {

          moveSfx.playMode("untilDone");
          moveSfx.play();
          rightTank.x--;
        }
      }
    }
    else {
      moveSfx.stop();
    }
  }
  if (!startScreen) {
    if (keyIsDown(27)) {
      gameMusic.stop();

      startScreen = true;
      startMusicOn = true;

      nameElementsCreate = true;
      timeElementsCreate = true;

      leftTankReady = false;
      rightTankReady = false;

      turn = random(0, 100);
      if (turn > 50) {
        rightTurn = true;
        leftTurn = false;
        turn = true;
      }
      else {
        leftTurn = true;
        rightTurn = false;
        turn = true;
      }

      leftTank = new Tank(200, 100, 0);
      rightTank = new Tank(width-200, 100, 1);

      gameOn = false;
      gameMusicOn = false;
      userInfo = false;
      gameOver = false;

      leftTextBox.remove();
      leftInputButton.remove();
      rightTextBox.remove();
      rightInputButton.remove();

      fiveBox.remove();
      tenBox.remove();
      threeBox.remove();

      if (userInfo) {
        leftTextBox.remove();
        rightTextBox.remove();
        leftInputButton.remove();
        rightInputButton.remove();
      }
    }
  }
}

function mousePressed() {

  if (startScreen || userInfo) {
    if (mouseIsPressed && mouseX > 30 && mouseX < 100 && mouseY > height - 80 && mouseY < height - 30) {
      instructionsOn = !instructionsOn;

    }
  }

  // Shoots bullet
  if (gameOn) {
    if (leftTurn && mouseIsPressed && !leftTank.isDead() && rightTank.bulletArray.length < 1) {
      rectMode(CENTER);
      leftTank.shootBullet(leftTank.x, leftTank.y);
      shotSfx.play();

      leftTurn = false;
      rightTurn = true;

      turn = true;
    }
    else if (rightTurn && mouseIsPressed && !rightTank.isDead() && leftTank.bulletArray.length < 1) {
      rectMode(CENTER);
      rightTank.shootBullet(rightTank.x, rightTank.y);
      shotSfx.play();

      rightTurn = false;
      leftTurn = true;

      turn = true;
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

function time() {

  // Duration of timer
  if (setTimer === 5) {
    if (timeSet) {
      timer = 18000;
      minutes = 5;
      seconds = 60;
      timeSet = false;
    }
  }
  else if (setTimer === 10) {
    if (timeSet) {
      timer = 36000;
      minutes = 10;
      seconds = 60;
      timeSet = false;
    }
  }
  else if (setTimer === 3) {
    if (timeSet) {
      timer = 10800;
      minutes = 3;
      seconds = 60;
      timeSet = false;
    }
  }
  else {
    if (timeSet) {
      timer = 3600;
      minutes = 1;
      seconds = 60;
      timeSet = false;
    }
  }

  // Show timer
  textAlign(CENTER);
  textSize(24);
  if (seconds < 10 && minutes < 10) {
    text("0" + minutes + " : 0" + seconds, width/2, height/10);
  }
  else if (seconds < 9 && minutes > 9) {
    text(minutes + " : 0" + seconds, width/2, height/10);
  }
  else if (seconds > 59 && minutes < 10) {
    text("0" + minutes + " : 00", width/2, height/10);
  }
  else if (seconds > 59 && minutes > 9) {
    text(minutes + " : 00", width/2, height/10);
  }
  else if (seconds > 9 && minutes < 10) {
    text("0" + minutes + " : " + seconds, width/2, height/10);
  }
  else {
    text(minutes + " : " + seconds, width/2, height/10);
  }

  // Update timer
  if (timer !== 0) {
    if (frameCount % 60 === 0) {
      timer -= 60;
      seconds--;
      if (seconds < 1) {
        seconds = 60;
      }
    }
    if (seconds === 59 && frameCount % 60 === 0 && minutes !== 0) {
      minutes--;
    }
  }
}

function interfaceScreens() {
  if (startScreen && !userInfo && !gameOn && !gameOver) {

    // Prompt to start
    fill(255);
    textSize(20);
    textAlign(CENTER);
    if (frameCount % 120 < 60 && !instructionsOn) {
      fill(255, 255, 255, alpha);
      text("Press ENTER to start!", width/2, height/2);
    }

    if (startMusicOn) {
      startMusic.volume(0.4);
      startMusic.loop();
      startMusicOn = false;
    }

    
  }
  if (startScreen || userInfo && !gameOn && !gameOver) {
    // Game logo
    imageMode(CENTER);
    image(shellshockLogoImg, width/2, height/5);
  }
  if (startScreen && !userInfo && !gameOn && !gameOver) {

    // Help button
    image(helpButtonImg, 75, height-50, 100, 50);
    if (mouseX > 25 && mouseX < 125 && mouseY > height - 75 && mouseY < height - 25) {
      image(helpButtonImg, 75, height-50, 110, 55);
    }

    if (instructionsOn) {

      fill(255, 0, 255, 75);
      rectMode(CENTER);
      rect(width/2, height/2, width*0.75, height*0.50);

      fill(255);
      textSize(24);
      textAlign(CENTER);
      text("Control:", width/2, height/8 + 150);
      textSize(18);
      textAlign(LEFT);
      text("A - Move left tank towards left.", width/8 + 15, height/8 + 180);
      text("D - Move left tank towards right.", width/8 + 15, height/8 + 210);
      text("Left Arrow - Move right tank towards left.", width/8 + 15, height/8 + 240);
      text("Right Arrow - Move right tank towards right.", width/8 + 15, height/8 + 270);

      text("Left Mouse Click - Tank shoots a shell.", width*0.6 - 15, height/8 + 180);
      text("Mouse Wheel Up - Increase shell power.", width*0.6 - 15, height/8 + 210);
      text("Mouse Wheel Down - Decrease shell power.", width*0.6 - 15, height/8 + 240);
      text("Esc - Return to home screen.", width*0.6 - 15, height/8 + 270);

      textSize(24);
      textAlign(CENTER);
      text("How to play:", width/2, height/8 + 300);
      textSize(18);
      textAlign(LEFT);
      text("Choose a unique name for each tank's name or you can choose to leave name empty. Choose the duration of the match. Click 'submit' for both", width/8 + 15, height/8 + 330);
      text("tanks. When it is a player's turn the yellow circle which surrounds their tank will appear. It is the bullet power adjustment circle.", width/8 + 15, height/8 + 350);
      text("Using the mouse wheel they can adjust the power of the bullet, and take aim towards the enemy tank, and fire! Once a player has fired", width/8 + 15, height/8 + 370);
      text("it will become the opposite player's turn. The match will be over once a tank has zero hit points or the time runs out.", width/8 + 15, height/8 + 390);

      textAlign(CENTER);
      text("Press the 'Help' button again to close this menu", width/2, height/8 + 450);
    }
  }
  if (!startScreen && userInfo && !gameOn && !gameOver) {

    // Name input prompt
    textSize(24);
    textAlign(CENTER);
    fill(255);
    text("Enter LEFT TANK name:", width/4, height/2 - 30*1.5);
    text("Enter RIGHT TANK name:", width*0.75, height/2 - 30*1.5);

    if (nameElementsCreate) {
      // Text box & button for name of left tank input
      leftTextBox = createInput("");
      leftTextBox.size(150, 20);
      leftTextBox.position(width/4 - leftTextBox.width/2, height/2 - leftTextBox.height);

      leftInputButton = createButton("Submit");
      leftInputButton.position(width/4 - leftInputButton.width/2, height/2 + leftTextBox.height/3);
      leftInputButton.mousePressed(leftInput);

      // Text box & button for name of right tank input
      rightTextBox = createInput("");
      rightTextBox.size(150, 20);
      rightTextBox.position(width*0.75 - rightTextBox.width/2, height/2 - rightTextBox.height);

      rightInputButton = createButton("Submit");
      rightInputButton.position(width*0.75 - rightInputButton.width/2, height/2 + rightTextBox.height/3);
      rightInputButton.mousePressed(rightInput);

      nameElementsCreate = false;
    }

    // Game duration labels
    textSize(18);
    textAlign(CENTER);
    text("Game Duration:", width/2, height*0.67);
    textAlign(LEFT);
    text("3 Minutes", width/2 - 20, height*0.7 + 16);
    text("5 Minutes", width/2 - 20, height*0.75 + 16);
    text("10 Minutes", width/2 - 20, height*0.8 + 16);

    if (timeElementsCreate) {
      
      // Game duration checkboxes
      threeBox = createCheckbox("", false);
      threeBox.position(width/2 - 50, height*0.7);
      threeBox.changed(threeMinTimeSet);

      fiveBox = createCheckbox("", false);
      fiveBox.position(width/2 - 50, height*0.75);
      fiveBox.changed(fiveMinTimeSet);

      tenBox = createCheckbox("", false);
      tenBox.position(width/2 - 50, height*0.8);
      tenBox.changed(tenMinTimeSet);

      timeElementsCreate = false;
    }
  }
  else if (gameOver && !gameOn && !startScreen && !userInfo) {

    // Set initial endscreen health of tank
    if (setEndHp) {
      leftHP = -100;
      rightHP = -100;
      setEndHp = false;
    }

    // Animation of health decreasing
    if (-leftHP > leftTank.health) {
      leftHP++;
    }
    if (-rightHP > rightTank.health) {
      rightHP++;
    }

    textAlign(CENTER);
    textSize(24);
    fill("white");
    text("Game Over!", width/2, height/8);

    // Show health as bars
    fill("green");
    rectMode(LEFT);
    rect(width/4 - 10, height/2, 20, leftHP);
    rect(width*0.75 - 10, height/2, 20, rightHP);

    if (-leftHP > -rightHP) {
      image(blueTankImg, width/4, height*0.65, leftTank.width, leftTank.height);
      image(deadTankImg, width*0.75, height*0.65, rightTank.width, rightTank.height);
    }
    else if (-leftHP < -rightHP) {
      image(deadTankImg, width/4, height*0.65, leftTank.width, leftTank.height);
      image(redTankImg, width*0.75, height*0.65, rightTank.width, rightTank.height);
    }
    else {
      image(blueTankImg, width/4, height*0.65, leftTank.width, leftTank.height);
      image(redTankImg, width*0.75, height*0.65, rightTank.width, rightTank.height);
    }


    // Print winner/draw message
    if (frameCount % 60 < 30) {
      if (-leftHP === leftTank.health && -rightHP === rightTank.health) {
        if (-leftHP > -rightHP) {
          fill("blue");
          text(leftTank.name + " has won!", width/2, height/2);
        }
        else if (-leftHP < -rightHP) {
          fill("red");
          text(rightTank.name + " has won!", width/2, height/2);
        }
        else {
          text("Draw!", width/2, height/2);
        }
      }
    }

    if (-leftHP === leftTank.health && -rightHP === rightTank.health) {
      fill("white");
      text("Press ESCAPE to return to home screen!", width/2, height*0.85);
    }
  }

  if (leftTankReady === true && rightTankReady === true) {

    // Game start conditions
    timeSet = true;
  
    userInfo = false;
    gameOn = true;
    gameMusicOn = true;
    gameOver = false;

    if (gameMusicOn) {
      gameMusicOn = false;
      startMusic.stop();
      gameMusic.volume(0.4);
      gameMusic.loop();
    }

    leftTextBox.remove();
    leftInputButton.remove();
    rightTextBox.remove();
    rightInputButton.remove();

    fiveBox.remove();
    tenBox.remove();
    threeBox.remove();

    leftTankReady = false;
    rightTankReady = false;
  }
}

// Text box input functions
function leftInput() {
  leftTankName = leftTextBox.value();
  if (leftTextBox.value() === "") {
    leftTank.name = "Left";
  }
  else {
    leftTank.name = leftTextBox.value();
  }

  leftTankReady = true;

}

function rightInput() {
  rightTankName = rightTextBox.value();
  if (rightTextBox.value() === "") {
    rightTank.name = "Right";
  }
  else {
    rightTank.name = rightTextBox.value();
  }

  rightTankReady = true;
}

// Setting game durations
function fiveMinTimeSet() {
  if (this.checked()) {
    setTimer = 5;
  }
  else {
    setTimer = 1;
  }
}

function tenMinTimeSet() {
  if (this.checked()) {
    setTimer = 10;
  }
  else {
    setTimer = 1;
  }
}

function threeMinTimeSet() {
  if (this.checked()) {
    setTimer = 3;
  }
  else {
    setTimer = 1;
  }
}

function playerInteractions() {

  if(gameOn) {

    time();

    if (leftTank.isDead() || rightTank.isDead()) {
      setEndHp = true;
      gameOn = false;
      gameOver = true;
    }
    
    if (timer <= 0) {
      setEndHp = true;
      gameOn = false;
      gameOver = true;
    }

    // Show bullet power representation
    if (leftTurn && !rightTurn && !leftTank.isDead()) {
      push();
      rectMode(CENTER);
      noStroke();
      fill(255, 255, 0, 30);
      ellipse(leftTank.x, leftTank.y, 500, 500);

      let angleToMouse = atan2(mouseY - leftTank.y, mouseX - leftTank.x);

      fill(255, 255, 0, 60);
      translate(leftTank.x, leftTank.y);
      rotate(angleToMouse - PI*2.5/2);
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
      rotate(angleToMouse - PI*2.5/2);
      arc(0, 0, (rightTank.bulletSpeed - 3)*5, 500, 0, PI*2.5);
      pop();
    }

    // Bullet to tank interation
    if (leftTank.bulletArray.length > 0) {
      if (leftTank.bulletArray[0].x > rightTank.x - rightTank.width/2 && leftTank.bulletArray[0].x < rightTank.x + rightTank.width/2 && leftTank.bulletArray[0].y > rightTank.y - rightTank.height/2 && leftTank.bulletArray[0].y < rightTank.y + rightTank.height/2) {
        
        image(impactImg, leftTank.bulletArray[0].x, leftTank.bulletArray[0].y, 30, 30);
        tankHitSfx.play();
        
        removeBullet = true;
        rightTank.health -= 20;
        tankHitSfx.stop();
      }
    }
    if (rightTank.bulletArray.length > 0) {
      if (rightTank.bulletArray[0].x > leftTank.x - leftTank.width/2 && rightTank.bulletArray[0].x < leftTank.x + leftTank.width/2 && rightTank.bulletArray[0].y > leftTank.y - leftTank.height/2 && rightTank.bulletArray[0].y < leftTank.y + leftTank.height/2) {
        
        image(impactImg, rightTank.bulletArray[0].x, rightTank.bulletArray[0].y, 30, 30);
        
        tankHitSfx.play();
        
        removeBullet = true;
        leftTank.health -= 20;
        tankHitSfx.stop();
      }
    }
  }
}

function displayTerrain() {

  // Show terrain
  if (startScreen || gameOn && !userInfo) {
    image(backgroundImg, width/2, height/2, width, height);

    rectWidth = width/rectHeights.length;
    rectMode(CORNER);
    for (let i=0; i<rectHeights.length; i++) {
      fill(255);
      noStroke();
      rect(rectWidth*i, height - rectHeights[i], 1, rectHeights[i]);
    }
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
    this.bulletArray = [];
    this.bulletSpeed = 53;
    this.theColor = color;
    this.health = 100;
    this.name, this.angleToTerrain, this.angleToMouse, this.tankTouchGround, this.removeBullet;
  }

  display() {
    if (!this.isDead()) {

      // Get angle to terrain
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
        text(this.name, this.x, this.y - this.height*2);

        fill("green");
        translate(this.x, this.y - this.height*1.5);
        rect(0, 0, this.health/2, 10);
        pop();
      }
      
      // Show tank
      if (startScreen || gameOn && !userInfo) {
        push();
        rectMode(CENTER);
        translate(this.x, this.y);
        rotate(this.angleToTerrain);
        if (this.theColor === 0) {
          image(blueTankImg, 0, 0, this.width, this.height);
        }
        else if (this.theColor === 1) {
          image(redTankImg, 0, 0, this.width, this.height);
        }
        else {
          image(deadTankImg, 0, 0, this.width, this.height);
        }
        pop();
      }
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

      if (this.removeBullet) {
        groundHitSfx.play();

        this.bulletArray.shift();
        removeBullet = false;
        this.removeBullet = false;
        tankHitSfx.stop();
      }

      if (this.bulletArray.length > 1 || bullet.x < 0 || bullet.x > width) {
        this.bulletArray.shift();
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
      this.theColor = 2;
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

      if (this.bulletTouchGround || timer === 0) {

        image(impactImg, this.x, this.y, 30, 30);
        removeBullet = true;
        break;
      }
    }
  }

  update() {

    // Bullet movement
    this.x += cos(this.angle) * this.speedX;
    this.y += sin(this.angle) * this.speedY;
    if (this.angle > 0) {
      this.speedY += 0.25;
    }
    else {
      this.speedY -= 0.15;
    }
  }

  display() {

    // Show bullet
    rectMode(CENTER);
    fill(255);
    circle(this.x, this.y, this.radius);
  }
}