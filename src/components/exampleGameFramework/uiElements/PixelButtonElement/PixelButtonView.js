import PixelEdgeElementClass from "./PixelEdgeElement/PixelEdgeElement";

export default class PixelButtonViewClass {

   constructor(ctx, pixelButtonData) {
      this.ctx = ctx;

      this.pixelButtonData = pixelButtonData;

      this.pixelEdgeElement = new PixelEdgeElementClass(ctx);
   }

   draw = (state) => {

      let color;

      switch(state){
         case 'disabled':
            return;
         case 'active':
            color = this.pixelButtonData.colorList ? this.pixelButtonData.colorList.active : 'lightGrey';
            break;
         case 'clicked':
            color = this.pixelButtonData.colorList ? this.pixelButtonData.colorList.active : 'grey';
            break;
         default:
            color = this.pixelButtonData.colorList ? this.pixelButtonData.colorList.inactive : 'darkGrey';
            break;
      }

      this.ctx.font = this.pixelButtonData.font;
      this.ctx.fillStyle = color;

      this.ctx.beginPath();
      this.ctx.moveTo(this.pixelButtonData.x + this.pixelButtonData.radius, this.pixelButtonData.y);
      this.ctx.lineTo(this.pixelButtonData.x + this.pixelButtonData.width - this.pixelButtonData.radius, this.pixelButtonData.y);
      this.ctx.quadraticCurveTo(this.pixelButtonData.x + this.pixelButtonData.width, this.pixelButtonData.y, this.pixelButtonData.x + this.pixelButtonData.width, this.pixelButtonData.y + this.pixelButtonData.radius);
      this.ctx.lineTo(this.pixelButtonData.x + this.pixelButtonData.width, this.pixelButtonData.y + this.pixelButtonData.height - this.pixelButtonData.radius);
      this.ctx.quadraticCurveTo(this.pixelButtonData.x + this.pixelButtonData.width, this.pixelButtonData.y + this.pixelButtonData.height, this.pixelButtonData.x + this.pixelButtonData.width - this.pixelButtonData.radius, this.pixelButtonData.y + this.pixelButtonData.height);
      this.ctx.lineTo(this.pixelButtonData.x + this.pixelButtonData.radius, this.pixelButtonData.y + this.pixelButtonData.height);
      this.ctx.quadraticCurveTo(this.pixelButtonData.x, this.pixelButtonData.y + this.pixelButtonData.height, this.pixelButtonData.x, this.pixelButtonData.y + this.pixelButtonData.height - this.pixelButtonData.radius);
      this.ctx.lineTo(this.pixelButtonData.x, this.pixelButtonData.y + this.pixelButtonData.radius);
      this.ctx.quadraticCurveTo(this.pixelButtonData.x, this.pixelButtonData.y, this.pixelButtonData.x + this.pixelButtonData.radius, this.pixelButtonData.y);
      this.ctx.closePath();
      this.ctx.fill();
      
      this.pixelEdgeElement.data.setPixelSize(this.pixelButtonData.pixelSize);
      this.pixelEdgeElement.data.setColor(color);

      this.pixelEdgeElement.data.setPositions(
         this.pixelButtonData.x, 
         this.pixelButtonData.y + this.pixelButtonData.radius, 
         this.pixelButtonData.x, 
         this.pixelButtonData.y + this.pixelButtonData.height - this.pixelButtonData.radius
         );
      this.pixelEdgeElement.view.draw();

      this.pixelEdgeElement.data.setPositions(
         this.pixelButtonData.x, 
         this.pixelButtonData.y + this.pixelButtonData.height - this.pixelButtonData.radius, 
         this.pixelButtonData.x + this.pixelButtonData.radius, 
         this.pixelButtonData.y + this.pixelButtonData.height
         );
      this.pixelEdgeElement.view.draw();

      this.pixelEdgeElement.data.setPositions(
         this.pixelButtonData.x + this.pixelButtonData.radius, 
         this.pixelButtonData.y + this.pixelButtonData.height, 
         this.pixelButtonData.x + this.pixelButtonData.width - this.pixelButtonData.radius, 
         this.pixelButtonData.y + this.pixelButtonData.height
         );
      this.pixelEdgeElement.view.draw();

      this.pixelEdgeElement.data.setPositions(
         this.pixelButtonData.x + this.pixelButtonData.width - this.pixelButtonData.radius, 
         this.pixelButtonData.y + this.pixelButtonData.height, 
         this.pixelButtonData.x + this.pixelButtonData.width, 
         this.pixelButtonData.y + this.pixelButtonData.height - this.pixelButtonData.radius
         );
      this.pixelEdgeElement.view.draw();

      this.pixelEdgeElement.data.setPositions(
         this.pixelButtonData.x + this.pixelButtonData.width, 
         this.pixelButtonData.y + this.pixelButtonData.height - this.pixelButtonData.radius, 
         this.pixelButtonData.x + this.pixelButtonData.width, 
         this.pixelButtonData.y + this.pixelButtonData.radius
         );
      this.pixelEdgeElement.view.draw();

      this.pixelEdgeElement.data.setPositions(
         this.pixelButtonData.x + this.pixelButtonData.width, 
         this.pixelButtonData.y + this.pixelButtonData.radius, 
         this.pixelButtonData.x + this.pixelButtonData.width - this.pixelButtonData.radius, 
         this.pixelButtonData.y
         );
      this.pixelEdgeElement.view.draw();

      this.pixelEdgeElement.data.setPositions(
         this.pixelButtonData.x + this.pixelButtonData.width - this.pixelButtonData.radius, 
         this.pixelButtonData.y, 
         this.pixelButtonData.x + this.pixelButtonData.radius, 
         this.pixelButtonData.y
         );
      this.pixelEdgeElement.view.draw();

      this.pixelEdgeElement.data.setPositions(
         this.pixelButtonData.x + this.pixelButtonData.radius, 
         this.pixelButtonData.y, 
         this.pixelButtonData.x, 
         this.pixelButtonData.y + this.pixelButtonData.radius
         );
      this.pixelEdgeElement.view.draw();

      this.ctx.fillStyle = 'black'
      this.ctx.fillText(this.pixelButtonData.text, this.pixelButtonData.x + this.pixelButtonData.width / 2, this.pixelButtonData.y + this.pixelButtonData.height / 2)
   }

}