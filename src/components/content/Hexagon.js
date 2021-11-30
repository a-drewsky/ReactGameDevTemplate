export default class HexagonClass {

   constructor(ctx, size){
      this.ctx = ctx;
      this.size = size;
   }

   drawHexagon = (x, y, color) => {
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = 'black';
      let sideLength = Math.PI / 3;
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(0) * this.size, y + Math.cos(0) * this.size);
      this.ctx.lineTo(x + Math.sin(sideLength) * this.size, y + Math.cos(sideLength) * this.size);
      this.ctx.lineTo(x + Math.sin(sideLength * 2) * this.size, y + Math.cos(sideLength * 2) * this.size);
      this.ctx.lineTo(x + Math.sin(sideLength * 3) * this.size, y + Math.cos(sideLength * 3) * this.size);
      this.ctx.lineTo(x + Math.sin(sideLength * 4) * this.size, y + Math.cos(sideLength * 4) * this.size);
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.size, y + Math.cos(sideLength * 5) * this.size);
      this.ctx.lineTo(x + Math.sin(sideLength * 6) * this.size, y + Math.cos(sideLength * 6) * this.size);
      this.ctx.fill();
      this.ctx.stroke();
   }

}