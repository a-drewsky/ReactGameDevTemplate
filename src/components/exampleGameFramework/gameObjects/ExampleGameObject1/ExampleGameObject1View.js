export default class ExampleGameObject1ViewClass {

   constructor(ctx, exampleGameObject1Data){

      this.ctx = ctx;

      this.exampleGameObject1Data = exampleGameObject1Data;

   }
   
   draw = () => {
      this.ctx.fillStyle = 'grey';
      this.ctx.strokeStyle = 'black';
      if(this.exampleGameObject1Data.color) this.ctx.fillStyle = this.exampleGameObject1Data.color;
      if(this.exampleGameObject1Data.color) this.ctx.strokeStyle = this.exampleGameObject1Data.color;

      let sideLength = Math.PI / 3;
      this.ctx.beginPath();
      this.ctx.moveTo(this.exampleGameObject1Data.x + Math.sin(sideLength * 0) * this.exampleGameObject1Data.size, this.exampleGameObject1Data.y + Math.cos(sideLength * 0) * this.exampleGameObject1Data.size);
      this.ctx.lineTo(this.exampleGameObject1Data.x + Math.sin(sideLength * 1) * this.exampleGameObject1Data.size, this.exampleGameObject1Data.y + Math.cos(sideLength * 1) * this.exampleGameObject1Data.size);
      this.ctx.lineTo(this.exampleGameObject1Data.x + Math.sin(sideLength * 2) * this.exampleGameObject1Data.size, this.exampleGameObject1Data.y + Math.cos(sideLength * 2) * this.exampleGameObject1Data.size);
      this.ctx.lineTo(this.exampleGameObject1Data.x + Math.sin(sideLength * 3) * this.exampleGameObject1Data.size, this.exampleGameObject1Data.y + Math.cos(sideLength * 3) * this.exampleGameObject1Data.size);
      this.ctx.lineTo(this.exampleGameObject1Data.x + Math.sin(sideLength * 4) * this.exampleGameObject1Data.size, this.exampleGameObject1Data.y + Math.cos(sideLength * 4) * this.exampleGameObject1Data.size);
      this.ctx.lineTo(this.exampleGameObject1Data.x + Math.sin(sideLength * 5) * this.exampleGameObject1Data.size, this.exampleGameObject1Data.y + Math.cos(sideLength * 5) * this.exampleGameObject1Data.size);
      this.ctx.lineTo(this.exampleGameObject1Data.x + Math.sin(sideLength * 6) * this.exampleGameObject1Data.size, this.exampleGameObject1Data.y + Math.cos(sideLength * 6) * this.exampleGameObject1Data.size);
      this.ctx.fill();
      this.ctx.stroke();
   }

   

}