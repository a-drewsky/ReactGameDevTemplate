export default class ExampleGameObject1ViewClass {

   constructor(ctx, exampleGameObject2Data){

      this.ctx = ctx;

      this.exampleGameObject2Data = exampleGameObject2Data;

   }
   
   draw = () => {
      this.ctx.fillStyle = 'grey';
      this.ctx.strokeStyle = 'white';
      if(this.exampleGameObject2Data.color) this.ctx.fillStyle = this.exampleGameObject2Data.color;
      if(this.exampleGameObject2Data.color) this.ctx.strokeStyle = this.exampleGameObject2Data.color;

      let sideLength = Math.PI / 3;
      this.ctx.beginPath();
      this.ctx.moveTo(this.exampleGameObject2Data.x + Math.sin(sideLength * 0) * this.exampleGameObject2Data.size, this.exampleGameObject2Data.y + Math.cos(sideLength * 0) * this.exampleGameObject2Data.size);
      this.ctx.lineTo(this.exampleGameObject2Data.x + Math.sin(sideLength * 1) * this.exampleGameObject2Data.size, this.exampleGameObject2Data.y + Math.cos(sideLength * 1) * this.exampleGameObject2Data.size);
      this.ctx.lineTo(this.exampleGameObject2Data.x + Math.sin(sideLength * 2) * this.exampleGameObject2Data.size, this.exampleGameObject2Data.y + Math.cos(sideLength * 2) * this.exampleGameObject2Data.size);
      this.ctx.lineTo(this.exampleGameObject2Data.x + Math.sin(sideLength * 3) * this.exampleGameObject2Data.size, this.exampleGameObject2Data.y + Math.cos(sideLength * 3) * this.exampleGameObject2Data.size);
      this.ctx.lineTo(this.exampleGameObject2Data.x + Math.sin(sideLength * 4) * this.exampleGameObject2Data.size, this.exampleGameObject2Data.y + Math.cos(sideLength * 4) * this.exampleGameObject2Data.size);
      this.ctx.lineTo(this.exampleGameObject2Data.x + Math.sin(sideLength * 5) * this.exampleGameObject2Data.size, this.exampleGameObject2Data.y + Math.cos(sideLength * 5) * this.exampleGameObject2Data.size);
      this.ctx.lineTo(this.exampleGameObject2Data.x + Math.sin(sideLength * 6) * this.exampleGameObject2Data.size, this.exampleGameObject2Data.y + Math.cos(sideLength * 6) * this.exampleGameObject2Data.size);
      this.ctx.fill();
      this.ctx.stroke();
   }

   

}