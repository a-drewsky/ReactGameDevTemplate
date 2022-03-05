export default class HexagonViewClass {

   constructor(ctx){

      this.ctx = ctx;

   }
   
   draw = (size, x, y, color) => {
      this.ctx.fillStyle = 'grey';
      this.ctx.strokeStyle = 'white';
      if(color) this.ctx.fillStyle = color;
      if(color) this.ctx.strokeStyle = color;

      let sideLength = Math.PI / 3;
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(0) * size, y + Math.cos(0) * size);
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * size, y + Math.cos(sideLength * 1) * size);
      this.ctx.lineTo(x + Math.sin(sideLength * 2) * size, y + Math.cos(sideLength * 2) * size);
      this.ctx.lineTo(x + Math.sin(sideLength * 3) * size, y + Math.cos(sideLength * 3) * size);
      this.ctx.lineTo(x + Math.sin(sideLength * 4) * size, y + Math.cos(sideLength * 4) * size);
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * size, y + Math.cos(sideLength * 5) * size);
      this.ctx.lineTo(x + Math.sin(sideLength * 6) * size, y + Math.cos(sideLength * 6) * size);
      this.ctx.fill();
      this.ctx.stroke();
   }

   

}