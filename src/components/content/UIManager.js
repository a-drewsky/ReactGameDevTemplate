export default class UIManagerClass {

   constructor(ctx, canvas, colorMap, dieSize){
      this.ctx = ctx;
      this.canvas = canvas;
      this.colorMap = colorMap;
      this.diceSheet = null;
      this.imageSize = null;
      this.dieSize = dieSize
   }

   setDiceSheet = (diceSheet, imageSize) => {
      this.diceSheet = diceSheet;
      this.imageSize = imageSize;
   }

   drawLoading = () => {
      this.ctx.font = "30px Arial";
      this.ctx.fillText("Loading...", 10, 50);
   }

   drawPixelEdge = (ctx, x1, y1, x2, y2, pixelSize, playerTurn) => {

      let testVec = {
         x: (x2) - (x1),
         y: (y2) - (y1)
      }
      let testLen = Math.sqrt(testVec.x * testVec.x + testVec.y * testVec.y);

      for (let i = 0; i < testLen; i += pixelSize) {
         ctx.fillStyle = 'rgba(25,25,25,1.0)';
         if (playerTurn) ctx.fillStyle = 'rgb(255, 215, 0, 1.0)';
         ctx.fillRect(x1 + testVec.x * (i / testLen) - pixelSize / 2, y1 + testVec.y * (i / testLen) - pixelSize / 2, pixelSize, pixelSize);

         ctx.fillStyle = 'rgba(25,25,25,0.5)';
         if (playerTurn) ctx.fillStyle = 'rgb(255, 215, 0, 0.5)';
         ctx.fillRect(x1 + testVec.x * (i / testLen) - pixelSize * 1.5 / 2, y1 + testVec.y * (i / testLen) - pixelSize * 1.5 / 2, pixelSize * 1.5, pixelSize * 1.5);
      }
   }

   drawFightBox = () => {

      let x = this.canvas.width / 2 - this.fightBoxSize / 2;
      let y = this.canvas.height / 2 - this.fightBoxSize / 4;
      let width = this.fightBoxSize;
      let height = this.fightBoxSize / 3;

      this.ctx.fillStyle = "lightGrey"
      let radius = 20;

      this.ctx.beginPath();
      this.ctx.moveTo(x + radius, y);
      this.ctx.lineTo(x + width - radius, y);
      this.ctx.lineTo(x + width, y + radius);
      this.ctx.lineTo(x + width, y + height - radius);
      this.ctx.lineTo(x + width - radius, y + height);
      this.ctx.lineTo(x + radius, y + height);
      this.ctx.lineTo(x, y + height - radius);
      this.ctx.lineTo(x, y + radius);
      this.ctx.lineTo(x + radius, y);
      this.ctx.closePath();
      this.ctx.fill();


      this.drawPixelEdge(this.ctx, x, y + radius, x, y + height - radius, Math.floor(this.canvasDims.width / 100))
      this.drawPixelEdge(this.ctx, x, y + height - radius, x + radius, y + height, Math.floor(this.canvasDims.width / 100))
      this.drawPixelEdge(this.ctx, x + radius, y + height, x + width - radius, y + height, Math.floor(this.canvasDims.width / 100))
      this.drawPixelEdge(this.ctx, x + width - radius, y + height, x + width, y + height - radius, Math.floor(this.canvasDims.width / 100))
      this.drawPixelEdge(this.ctx, x + width, y + height - radius, x + width, y + radius, Math.floor(this.canvasDims.width / 100))
      this.drawPixelEdge(this.ctx, x + width, y + radius, x + width - radius, y, Math.floor(this.canvasDims.width / 100))
      this.drawPixelEdge(this.ctx, x + width - radius, y, x + radius, y, Math.floor(this.canvasDims.width / 100))
      this.drawPixelEdge(this.ctx, x + radius, y, x, y + radius, Math.floor(this.canvasDims.width / 100))

      this.ctx.drawImage(this.diceSheet, this.imageSize * 5, this.imageSize * (this.groupMap.get(this.currentBattle.attacker).playerNumber+1), this.imageSize, this.imageSize, x + width/6 - this.diceSize, y + height/2 - this.diceSize, this.diceSize * 2, this.diceSize * 2);
      this.ctx.drawImage(this.diceSheet, this.imageSize * 5, this.imageSize * (this.groupMap.get(this.currentBattle.defender).playerNumber+1), this.imageSize, this.imageSize, x + width - width/6 - this.diceSize, y + height/2 - this.diceSize, this.diceSize * 2, this.diceSize * 2);

      this.ctx.fillStyle = 'black'
      this.ctx.font = `bold ${this.canvas2Dims.width * 0.05}px Arial`;
      this.ctx.fillText("Fight", x + width / 2, y + height / 2)
   }

   drawButton = (ctx, text, color, x, y, width, height) => {
      ctx.fillStyle = color
      let radius = 4;

      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();


      this.drawPixelEdge(ctx, x, y + radius, x, y + height - radius, Math.floor(this.canvasDims.width / 250))
      this.drawPixelEdge(ctx, x, y + height - radius, x + radius, y + height, Math.floor(this.canvasDims.width / 250))
      this.drawPixelEdge(ctx, x + radius, y + height, x + width - radius, y + height, Math.floor(this.canvasDims.width / 250))
      this.drawPixelEdge(ctx, x + width - radius, y + height, x + width, y + height - radius, Math.floor(this.canvasDims.width / 250))
      this.drawPixelEdge(ctx, x + width, y + height - radius, x + width, y + radius, Math.floor(this.canvasDims.width / 250))
      this.drawPixelEdge(ctx, x + width, y + radius, x + width - radius, y, Math.floor(this.canvasDims.width / 250))
      this.drawPixelEdge(ctx, x + width - radius, y, x + radius, y, Math.floor(this.canvasDims.width / 250))
      this.drawPixelEdge(ctx, x + radius, y, x, y + radius, Math.floor(this.canvasDims.width / 250))

      ctx.fillStyle = 'black'
      ctx.fillText(text, x + width / 2, y + height / 2)
   }

   drawEndTurnButton = (battleInProgress) => {

      let x = this.buttonWidth * 0.0625
      let y = 60
      let width = this.buttonWidth;
      let height = this.buttonWidth / 3;
      let color = 'lightGrey'
      if (battleInProgress) color = 'grey'

      this.drawButton(this.ctx, "End Turn", color, x, y, width, height);
   }

   drawDie = (x, y, number, colorIndex) => {
      let sheetHasImage = (this.imageSize * (colorIndex + 1) < this.diceSheet.height)
      this.ctx.drawImage(this.diceSheet, this.imageSize * (number - 1), sheetHasImage ? this.imageSize * (colorIndex + 1) : 0, this.imageSize, this.imageSize, x - this.dieSize * 0.5, y - this.dieSize * 0.5, this.dieSize, this.dieSize);
   }

   drawScoreboard = (players, playerTurn) => {

      let drawScore = (x, y, width, height, radius, colorIndex, score, playerTurn) => {



         this.ctx.fillStyle = this.colorMap[colorIndex];
         if (playerTurn) this.ctx.fillStyle = 'snow';

         this.ctx.beginPath();
         this.ctx.moveTo(x + radius, y);
         this.ctx.lineTo(x + width - radius, y);
         this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
         this.ctx.lineTo(x + width, y + height - radius);
         this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
         this.ctx.lineTo(x + radius, y + height);
         this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
         this.ctx.lineTo(x, y + radius);
         this.ctx.quadraticCurveTo(x, y, x + radius, y);
         this.ctx.closePath();
         this.ctx.fill();


         this.drawPixelEdge(this.ctx, x, y + radius, x, y + height - radius, Math.floor(this.canvasDims.width / 250), playerTurn)
         this.drawPixelEdge(this.ctx, x, y + height - radius, x + radius, y + height, Math.floor(this.canvasDims.width / 250), playerTurn)
         this.drawPixelEdge(this.ctx, x + radius, y + height, x + width - radius, y + height, Math.floor(this.canvasDims.width / 250), playerTurn)
         this.drawPixelEdge(this.ctx, x + width - radius, y + height, x + width, y + height - radius, Math.floor(this.canvasDims.width / 250), playerTurn)
         this.drawPixelEdge(this.ctx, x + width, y + height - radius, x + width, y + radius, Math.floor(this.canvasDims.width / 250), playerTurn)
         this.drawPixelEdge(this.ctx, x + width, y + radius, x + width - radius, y, Math.floor(this.canvasDims.width / 250), playerTurn)
         this.drawPixelEdge(this.ctx, x + width - radius, y, x + radius, y, Math.floor(this.canvasDims.width / 250), playerTurn)
         this.drawPixelEdge(this.ctx, x + radius, y, x, y + radius, Math.floor(this.canvasDims.width / 250), playerTurn)

         this.drawDie(x + (width / 4) * 1.15, y + height / 2, 6, colorIndex)
         this.ctx.font = `${this.canvasDims.width * 0.03}px Arial`;
         this.ctx.textAlign = 'center';
         this.ctx.textBaseline = 'middle'
         this.ctx.fillStyle = 'black'
         if (score) this.ctx.fillText(score, x + (width / 4) * 2.85, y + height / 2)

      }

      let scoreWidth = this.canvasDims.width / 11.25;

      for (let i = 0; i < players.length; i++) {
         //drawScore(scoreWidth * 0.0625 + scoreWidth * i * 1.125, 10, scoreWidth, scoreWidth / 2, 4, i, this.groupMap.getNumPlayerGroups(i), this.playerTurn == i)
         drawScore(scoreWidth * 0.0625 + scoreWidth * i * 1.125, 10, scoreWidth, scoreWidth / 2, 4, i, players[i], playerTurn == i)
      }

   }

}