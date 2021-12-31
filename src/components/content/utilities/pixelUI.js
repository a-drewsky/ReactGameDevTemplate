export default class PixelUIClass {


   drawLoading = (ctx) => {
      ctx.font = "30px Arial";
      ctx.fillStyle = "black"
      let text = "Loading..."
      ctx.fillText(text, 10 + ctx.measureText(text).width/2, 50);
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

   drawBox = (ctx, x, y, width, height, radius, pixelSize, color, stroke) => {
      ctx.fillStyle = color;

      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.lineTo(x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.lineTo(x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.lineTo(x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.lineTo(x + radius, y);
      ctx.closePath();
      ctx.fill();


      this.drawPixelEdge(ctx, x, y + radius, x, y + height - radius, pixelSize, stroke && stroke)
      this.drawPixelEdge(ctx, x, y + height - radius, x + radius, y + height, pixelSize, stroke && stroke)
      this.drawPixelEdge(ctx, x + radius, y + height, x + width - radius, y + height, pixelSize, stroke && stroke)
      this.drawPixelEdge(ctx, x + width - radius, y + height, x + width, y + height - radius, pixelSize, stroke && stroke)
      this.drawPixelEdge(ctx, x + width, y + height - radius, x + width, y + radius, pixelSize, stroke && stroke)
      this.drawPixelEdge(ctx, x + width, y + radius, x + width - radius, y, pixelSize, stroke && stroke)
      this.drawPixelEdge(ctx, x + width - radius, y, x + radius, y, pixelSize, stroke && stroke)
      this.drawPixelEdge(ctx, x + radius, y, x, y + radius, pixelSize, stroke && stroke)
   }

   drawButton = (ctx, x, y, width, height, pixelSize, text, font, color) => {
      
      ctx.font = font;
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


      this.drawPixelEdge(ctx, x, y + radius, x, y + height - radius, pixelSize)
      this.drawPixelEdge(ctx, x, y + height - radius, x + radius, y + height, pixelSize)
      this.drawPixelEdge(ctx, x + radius, y + height, x + width - radius, y + height, pixelSize)
      this.drawPixelEdge(ctx, x + width - radius, y + height, x + width, y + height - radius, pixelSize)
      this.drawPixelEdge(ctx, x + width, y + height - radius, x + width, y + radius, pixelSize)
      this.drawPixelEdge(ctx, x + width, y + radius, x + width - radius, y, pixelSize)
      this.drawPixelEdge(ctx, x + width - radius, y, x + radius, y, pixelSize)
      this.drawPixelEdge(ctx, x + radius, y, x, y + radius, pixelSize)

      ctx.fillStyle = 'black'
      ctx.fillText(text, x + width / 2, y + height / 2)
   }
   

}