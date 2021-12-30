export default class UIManagerClass {

   constructor(ctx, canvas){
      this.ctx = ctx;
      this.canvas = canvas;
      this.diceSheet = null;
      this.imageSize = null;
   }

   //move to drawGameObjects in HexWarsGame
   clearCanvas = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
   }


   drawLoading = () => {
      this.ctx.font = "30px Arial";
      this.ctx.fillStyle = "black"
      let text = "Loading..."
      this.ctx.fillText(text, 10 + this.ctx.measureText(text).width/2, 50);
   }

   drawPixelEdge = (ctx, x1, y1, x2, y2, pixelSize, color) => {

      let mainColor = 'rgba(25,25,25,1.0)';
      let alphaColor = 'rgba(25,25,25,0.5)';

      if(color){
         mainColor = color;
         alphaColor = `${color}${Math.floor(0.5 * 255).toString(16).padStart(2, 0)}`;
      }

      let testVec = {
         x: (x2) - (x1),
         y: (y2) - (y1)
      }
      let testLen = Math.sqrt(testVec.x * testVec.x + testVec.y * testVec.y);

      for (let i = 0; i < testLen; i += pixelSize) {
         ctx.fillStyle = mainColor
         ctx.fillRect(x1 + testVec.x * (i / testLen) - pixelSize / 2, y1 + testVec.y * (i / testLen) - pixelSize / 2, pixelSize, pixelSize);

         ctx.fillStyle = alphaColor
         ctx.fillRect(x1 + testVec.x * (i / testLen) - pixelSize * 1.5 / 2, y1 + testVec.y * (i / testLen) - pixelSize * 1.5 / 2, pixelSize * 1.5, pixelSize * 1.5);
      }
   }

   drawBox = (x, y, width, height, radius, pixelSize, color, stroke) => {

      this.ctx.fillStyle = color;

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


      this.drawPixelEdge(this.ctx, x, y + radius, x, y + height - radius, pixelSize, stroke && stroke)
      this.drawPixelEdge(this.ctx, x, y + height - radius, x + radius, y + height, pixelSize, stroke && stroke)
      this.drawPixelEdge(this.ctx, x + radius, y + height, x + width - radius, y + height, pixelSize, stroke && stroke)
      this.drawPixelEdge(this.ctx, x + width - radius, y + height, x + width, y + height - radius, pixelSize, stroke && stroke)
      this.drawPixelEdge(this.ctx, x + width, y + height - radius, x + width, y + radius, pixelSize, stroke && stroke)
      this.drawPixelEdge(this.ctx, x + width, y + radius, x + width - radius, y, pixelSize, stroke && stroke)
      this.drawPixelEdge(this.ctx, x + width - radius, y, x + radius, y, pixelSize, stroke && stroke)
      this.drawPixelEdge(this.ctx, x + radius, y, x, y + radius, pixelSize, stroke && stroke)
   }

   drawButton = (x, y, width, height, text, color) => {
      this.ctx.font = `${this.canvas.width * 0.03}px Arial`;
      this.ctx.fillStyle = color
      let radius = 4;

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


      this.drawPixelEdge(this.ctx, x, y + radius, x, y + height - radius, Math.floor(this.canvas.width / 250))
      this.drawPixelEdge(this.ctx, x, y + height - radius, x + radius, y + height, Math.floor(this.canvas.width / 250))
      this.drawPixelEdge(this.ctx, x + radius, y + height, x + width - radius, y + height, Math.floor(this.canvas.width / 250))
      this.drawPixelEdge(this.ctx, x + width - radius, y + height, x + width, y + height - radius, Math.floor(this.canvas.width / 250))
      this.drawPixelEdge(this.ctx, x + width, y + height - radius, x + width, y + radius, Math.floor(this.canvas.width / 250))
      this.drawPixelEdge(this.ctx, x + width, y + radius, x + width - radius, y, Math.floor(this.canvas.width / 250))
      this.drawPixelEdge(this.ctx, x + width - radius, y, x + radius, y, Math.floor(this.canvas.width / 250))
      this.drawPixelEdge(this.ctx, x + radius, y, x, y + radius, Math.floor(this.canvas.width / 250))

      this.ctx.fillStyle = 'black'
      this.ctx.fillText(text, x + width / 2, y + height / 2)
   }
   

}