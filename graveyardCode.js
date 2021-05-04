// keys = []
// const rightPressed = false;
// const leftPressed = false;
// const background = new Image();
//background.src = "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_1280.jpg";

function drawBubbles() {
    // for (let i = 0; i < 8; i++){
    //     ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)]
    // } 
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 12; j++) {
        ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)]
        ctx.fillStyle = ctx.strokeStyle
        ctx.beginPath();
        ctx.arc(20 + j * 42, 20 + i * 42, 20, 0, Math.PI * 2, true);
        //ctx.arc(15 + j * 37, 15 + i * 37, 20, 0, Math.PI * 2, true)
        ctx.stroke();
        ctx.fill();
      }
    }
  }

// create and animate user bubble

  var raf;

var userBubble = {
  x: 250,
  y: 425,
  vx: 5,
  vy: -2,
  radius: 20,
  color: colors[Math.floor(Math.random() * colors.length)],
  draw: function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};

function collisionDetection() {
  for (var c = 0; c < bubbleColumnCount; c++) {
      for (var r = 0; r < bubbleRowCount; r++) {
          var b = bubbles[c][r];
          if (b.status == 1) {
              if (x > b.x && x < b.x + radius && y > b.y && y < b.y + radius) {
                  dy = -dy;
                  b.status = 0;
                  score++;
                  if(score == bubbleRowCount*bubbleColumnCount) {
                      alert("YOU WIN, CONGRATULATIONS!");
                      document.location.reload();
                      clearInterval(interval); // Needed for Chrome to end game
                  }
              }
          }
      }
  }
}

class shooterBubble {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = colors[Math.floor(Math.random() * colors.length)];

    this.update = function () {

      this.draw();
    };

    this.draw = function () {
      b.beginPath();
      b.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      b.fillStyle = this.color;
      b.fill();
      c.closePath();
    };
  }
}

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  if (gameState.areBubblesDrawn === false){
    generateStartingBubbles();
    gameState.areBubblesDrawn = true
  }
  gameState.drawBubbles();
  userBubble.draw();
  // userBubble.x += userBubble.vx;
  // userBubble.y += userBubble.vy;
  // if (userBubble.y + userBubble.vy > canvas.height || userBubble.y + userBubble.vy < 0) {
  //   userBubble.vy = -userBubble.vy;
  // }
  // if (userBubble.x + userBubble.vx > canvas.width || userBubble.x + userBubble.vx < 0) {
  //   userBubble.vx = -userBubble.vx;
  // }
  //raf = window.requestAnimationFrame(draw);
}

// document.addEventListener('mouseover', function(e) {
//   raf = window.requestAnimationFrame(draw);
// });

// document.addEventListener('mouseout', function(e) {
//   window.cancelAnimationFrame(raf);
// });


// let startBubble;
// function init() {
//   startBubble = new shooterBubble(250, 425, 20);
// }
//  let raf;