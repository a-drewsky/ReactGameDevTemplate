import PixelEdgeViewClass from "./PixelEdgeView";

export default class PixelButtonViewClass {

   constructor(ctx){
      this.ctx = ctx;

      this.pixelEdgeView = new PixelEdgeViewClass(ctx);
   }

   //should be a switch statement
   draw = (button) => {

      switch(button.state){
         case 'active':
            this.drawButton(this.ctx, button.x, button.y, button.width, button.height, button.pixelSize, button.text, button.font, button.colorList.active || 'lightGrey');
            break;
         case 'inactive':
            this.drawButton(this.ctx, button.x, button.y, button.width, button.height, button.pixelSize, button.text, button.font, button.colorList.inactive || 'darkGrey');
            break;
         case 'clicked':
            this.drawButton(this.ctx, button.x, button.y, button.width, button.height, button.pixelSize, button.text, button.font, button.colorList.clicked || 'grey');
            break;
      }
      
   }

   drawButton = (ctx, x, y, width, height, pixelSize, text, font, color) => {
      
      this.ctx.font = font;
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


      this.pixelEdgeView.drawPixelEdge(this.ctx, x, y + radius, x, y + height - radius, pixelSize)
      this.pixelEdgeView.drawPixelEdge(this.ctx, x, y + height - radius, x + radius, y + height, pixelSize)
      this.pixelEdgeView.drawPixelEdge(this.ctx, x + radius, y + height, x + width - radius, y + height, pixelSize)
      this.pixelEdgeView.drawPixelEdge(this.ctx, x + width - radius, y + height, x + width, y + height - radius, pixelSize)
      this.pixelEdgeView.drawPixelEdge(this.ctx, x + width, y + height - radius, x + width, y + radius, pixelSize)
      this.pixelEdgeView.drawPixelEdge(this.ctx, x + width, y + radius, x + width - radius, y, pixelSize)
      this.pixelEdgeView.drawPixelEdge(this.ctx, x + width - radius, y, x + radius, y, pixelSize)
      this.pixelEdgeView.drawPixelEdge(this.ctx, x + radius, y, x, y + radius, pixelSize)

      this.ctx.fillStyle = 'black'
      this.ctx.fillText(text, x + width / 2, y + height / 2)
   }

}