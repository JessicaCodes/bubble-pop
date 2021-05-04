let gravity = 1;
let friction = 0.85;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const restart = document.querySelector("#startGame")
const gamewrap = document.querySelector("#gameWrapper")
const bubbleColumnCount = 6
const bubbleRowCount = 12
//const score = 0;


const gameState = {
  userBubble: null,
  gameBubbles: [],
  colors: ["rgb(255,153,153,0.900)", "rgb(153,255,204,0.900)", "rgb(153,204,255,0.900)", "rgb(255,255,153,0.900)"],
  areBubblesDrawn: false,
  generateColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  },
  drawBubbles() {
    this.gameBubbles.forEach(bub => {
      bub.draw()
    })
  },
  fallingBubbles: []
}

///////////////////////////////////------------------------- BUBBLE CLASS ------------------//////////////////////////////

class Bubble {
  constructor(x, y, radius, color = gameState.generateColor()) {
    this.x = x;
    this.y = y;
    this.dy = 0;
    this.dx = 0;
    this.radius = radius;
    this.color = color;
    this.cachedColor = this.color
    this.status = 1;
    this.isFalling = false;
    // this.timer = 10;
  }

  draw() {
    if(this.isFalling) this.fall();
    ctx.strokeStyle = this.color
    ctx.fillStyle = ctx.strokeStyle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
    ctx.stroke();
    ctx.fill();
  }
  
  checkHasCollided(bubble1, bubble2, extraRadius = 0){
    let bx = bubble1.x - bubble2.x;
    let by = bubble1.y - bubble2.y;
    let distance = Math.sqrt(bx * bx + by * by);
    if (distance < bubble1.radius + extraRadius + bubble2.radius) {
      return true;
    } 
    return false;
  }
  
  checkForCollisions(){
    if(this.dx === 0) return;
    for (let i = gameState.gameBubbles.length-1; i >= 0 ; i--){
      const curBub = gameState.gameBubbles[i];
      if(this.checkHasCollided(this, curBub) === true){
        this.actionOnCollision(curBub);
        break;
      }
    }
  }

  countDownToRemove(){
  setTimeout(this.removeFromGameState , 1000) 
  }


  removeFromGameState = ()=> {
    gameState.gameBubbles.splice(gameState.gameBubbles.indexOf(this), 1);
    if(gameState.userBubble == this){
      gameState.userBubble = new UserBubble(250, 425, 20, 1, -3)
    } 
  }
  
  actionOnCollision(target) {
    if (this.cachedColor == target.cachedColor) {
      this.isFalling = true;
      target.checkForSameColorsNearby();
      this.countDownToRemove();
      this.dx = 0; 
      this.dy = 0;
    } else { 
      console.log('<---')
      this.dx = 0; 
      this.dy = 0;
      gameState.gameBubbles.push(this);
      gameState.userBubble = new UserBubble(250, 425, 20, 1, -3);
    }
  }

  checkForSameColorsNearby(){
    this.color = "red";
    this.isFalling = true;
    this.countDownToRemove();
    for (let i = gameState.gameBubbles.length-1; i >= 0; i--) {
      let curBub = gameState.gameBubbles[i];
      if(this === curBub) continue;
      if(this.checkHasCollided(this, curBub, 5) && curBub.cachedColor === this.cachedColor && curBub.color !== "red"){
        curBub.color = "red";
        curBub.checkForSameColorsNearby();
        break;
      }
    }
  }

  fall(){
    // console.log("falling?")
    if (this.y + this.radius + this.dy > canvas.height) {
      //  console.log("here1")
        this.dy =- this.dy * friction;
    } else {
        // console.log(this.dy, "<---?")
        this.dy += gravity;
        // console.log(this.dy, "<--- 2")
    }
    if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius <= 0){
        this.dx = -this.dx;
        // console.log("here3")

    }
    // console.log(this.y, "<--- y before")
    this.x += this.dx;
    this.y += this.dy;
    // console.log(this.y, "<--- y after")
  }
}

////////////////////////////////////------------------------- USER BUBBLE CLASS ------------------//////////////////////////////

class UserBubble extends Bubble {
  constructor(x, y, radius, dx, dy) {
    super(x, y, radius);
    this.moving = false
    this.dx = dx;
    this.dy = dy;
    this.speed = 5;
  }

  shootBubble() {
    if(this.moving){
      this.x += this.dx;
      this.y += this.dy;
    }
    
  }
  
  checkBoundaries() {
    if (this.y + this.dy > canvas.height || this.y + this.dy < 0) {
      this.dy = -this.dy;
    }
    if (this.x + this.dx > canvas.width || this.x + this.dx < 0) {
      this.dx = -this.dx;
    }
  }
}


///////////////////////////////////------------------------- AIMER CLASS ------------------//////////////////////////////
class Aimer {
  constructor(){
    this.color = 'rgb(168, 82, 253)';
    this.x = canvas.width/2;
    this.y = canvas.height -100;
    this.width = 3;
    this.height = 40;
    this.rotation = Math.PI/2;
    this.rotationSpeed = .01;
  }

  draw(){
    ctx.beginPath();
    ctx.translate(this.x,this.y);
    ctx.rotate(-this.rotation - Math.PI/2);
    ctx.fillStyle = this.color;
    ctx.rect(0,0,this.width, this.height);
    ctx.fill();
    ctx.rotate(this.rotation + Math.PI/2);
    ctx.translate(-this.x,-this.y);
    ctx.closePath();
  }

  move(){
    if(leftPressed && this.rotation < Math.PI){
      this.rotation += this.rotationSpeed;
    }
    if(rightPressed && this.rotation > 0){
      this.rotation -= this.rotationSpeed;
    }
  }
}

//////////////////////////------------------------- LOOP FOR STARTING BUBBLES ------------------------////////////////////////////
  function generateStartingBubbles() {
    for (let c = 0; c < bubbleColumnCount; c++) {
      for (let r = 0; r < bubbleRowCount; r++) {
        gameState.gameBubbles.push(new Bubble(20 + r * 42, 20 + c * 42, 20));
      }
    }
  }

  // function newBubbleRow() {
  //   for (let c = 0; c < 1; c++) {
  //     for (let r = 0; r < bubbleRowCount; r++) {
  //       gameState.gameBubbles.push(new Bubble(20 + r * 42, 20 + c * 42, 20))
  //     }
  //   }
  // }

  gameState.userBubble = new UserBubble(250, 425, 20, 1, -3)
  const aimer = new Aimer()

  ////////////////////////////------------------ DRAW FUNCTION ---------------------///////////////////////////

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gameState.areBubblesDrawn === false) {
      generateStartingBubbles();
      gameState.areBubblesDrawn = true
    }

    gameState.drawBubbles();
    gameState.userBubble.shootBubble();
    gameState.userBubble.draw();
    gameState.userBubble.checkForCollisions();
    gameState.userBubble.checkBoundaries();
    aimer.move();
    aimer.draw();
  }

//////////////////---------------EVENT LISTENERS------------------//////////////////
let leftPressed = false;
let rightPressed = false;

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    // console.log("right")
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    // console.log("left")
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  } else if (e.key == " "){
    gameState.userBubble.moving = true;
    gameState.userBubble.dx = Math.cos(-aimer.rotation)* gameState.userBubble.speed;
    gameState.userBubble.dy = Math.sin(-aimer.rotation)* gameState.userBubble.speed;
  }
}

window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);


function runGame() {
  // console.log('anything');
  setInterval(draw, 30);
}

restart.addEventListener("click", runGame);