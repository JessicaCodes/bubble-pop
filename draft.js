const gameState = {
    gameBubbles: [],
    colors: ["rgb(255,153,153,0.900)", "rgb(153,255,204,0.900)", "rgb(153,204,255,0.900)", "rgb(255,255,153,0.900)"],
    generateColor: ()=>{
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}

class Bubble {
    constructor(x, y, radius, color = gameState.generateColor()){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(){
        ctx.strokeStyle = this.color
        ctx.fillStyle = ctx.strokeStyle
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.radius, 0, Math.PI * 2, true)
        ctx.stroke();
        ctx.fill();
    }
}
//ctx.arc(20 + this.x * 42, 20 + this.y * 42, 20, 0, Math.PI * 2, true)
function generateStartingBubbles() {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 12; j++) {
        gameState.gameBubbles.push(new Bubble(20 + j * 42, 20 + i * 42, 20));
      }
    }
  }

  generateStartingBubbles()