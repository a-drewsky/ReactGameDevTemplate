export default class HexagonClass {

   constructor(ctx, size, squish){
      this.ctx = ctx;
      this.size = size;
      this.squish = squish;
   }

   drawHexagon = (x, y, color) => {
      this.ctx.fillStyle = 'grey';
      this.ctx.strokeStyle = 'white';
      if(color) this.ctx.fillStyle = color;
      if(color) this.ctx.strokeStyle = color;
      let sideLength = Math.PI / 3;
      this.ctx.beginPath();
      this.ctx.moveTo(x + Math.sin(0) * this.size, y + Math.cos(0) * (this.size * this.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.size, y + Math.cos(sideLength * 1) * (this.size * this.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 2) * this.size, y + Math.cos(sideLength * 2) * (this.size * this.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 3) * this.size, y + Math.cos(sideLength * 3) * (this.size * this.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 4) * this.size, y + Math.cos(sideLength * 4) * (this.size * this.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.size, y + Math.cos(sideLength * 5) * (this.size * this.squish));
      this.ctx.lineTo(x + Math.sin(sideLength * 6) * this.size, y + Math.cos(sideLength * 6) * (this.size * this.squish));
      this.ctx.fill();
      this.ctx.stroke();
   }

   drawEdges = (x, y, edges, testPixelSize, lineStyle) => {

      this.ctx.strokeStyle = 'black';
      let sideLength = Math.PI / 3;


      if(edges.includes('TL')){

         if(lineStyle == "smooth"){
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.sin(sideLength * 3) * this.size, y + Math.cos(sideLength * 3) * (this.size * this.squish));
            this.ctx.lineTo(x + Math.sin(sideLength * 4) * this.size, y + Math.cos(sideLength * 4) * (this.size * this.squish));
            this.ctx.stroke();
         } else {
            let testX = x + Math.sin(sideLength * 3) * this.size;
            let testY = y + Math.cos(sideLength * 3) * (this.size * this.squish);
   
            let testVec = {
               x: (x + Math.sin(sideLength * 4) * this.size) - (x + Math.sin(sideLength * 3) * this.size),
               y: (y + Math.cos(sideLength * 4) * (this.size * this.squish)) - (y + Math.cos(sideLength * 3) * (this.size * this.squish))
            }
            let testLen = Math.sqrt(testVec.x*testVec.x+testVec.y*testVec.y);
   
            for(let i=0; i<testLen; i+=testPixelSize){
               this.ctx.fillStyle = 'rgba(25,25,25,1.0)';
               this.ctx.fillRect(testX + testVec.x*(i/testLen) - testPixelSize/2, testY + testVec.y*(i/testLen) - testPixelSize/2, testPixelSize, testPixelSize);

               this.ctx.fillStyle = 'rgba(25,25,25,0.5)';
               this.ctx.fillRect(testX + testVec.x*(i/testLen) - testPixelSize*1.5/2, testY + testVec.y*(i/testLen) - testPixelSize*1.5/2, testPixelSize*1.5, testPixelSize*1.5);
            }
         }

      }

      if(edges.includes('TR')){

         if(lineStyle == "smooth"){
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.sin(sideLength * 2) * this.size, y + Math.cos(sideLength * 2) * (this.size * this.squish));
            this.ctx.lineTo(x + Math.sin(sideLength * 3) * this.size, y + Math.cos(sideLength * 3) * (this.size * this.squish));
            this.ctx.stroke();
         } else {
            let testX = x + Math.sin(sideLength * 2) * this.size;
            let testY = y + Math.cos(sideLength * 2) * (this.size * this.squish);
   
            let testVec = {
               x: (x + Math.sin(sideLength * 3) * this.size) - (x + Math.sin(sideLength * 2) * this.size),
               y: (y + Math.cos(sideLength * 3) * (this.size * this.squish)) - (y + Math.cos(sideLength * 2) * (this.size * this.squish))
            }
            let testLen = Math.sqrt(testVec.x*testVec.x+testVec.y*testVec.y);
   
            for(let i=0; i<testLen; i+=testPixelSize){
               this.ctx.fillStyle = 'rgba(25,25,25,1.0)';
               this.ctx.fillRect(testX + testVec.x*(i/testLen) - testPixelSize/2, testY + testVec.y*(i/testLen) - testPixelSize/2, testPixelSize, testPixelSize);

               this.ctx.fillStyle = 'rgba(25,25,25,0.5)';
               this.ctx.fillRect(testX + testVec.x*(i/testLen) - testPixelSize*1.5/2, testY + testVec.y*(i/testLen) - testPixelSize*1.5/2, testPixelSize*1.5, testPixelSize*1.5);
            }
         }

      }

      if(edges.includes('R')){

         if(lineStyle == "smooth"){
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.sin(sideLength * 1) * this.size, y + Math.cos(sideLength *1) * (this.size * this.squish));
            this.ctx.lineTo(x + Math.sin(sideLength * 2) * this.size, y + Math.cos(sideLength * 2) * (this.size * this.squish));
            this.ctx.stroke();
         } else {
            let testX = x + Math.sin(sideLength * 1) * this.size;
            let testY = y + Math.cos(sideLength *1) * (this.size * this.squish);
   
            let testVec = {
               x: (x + Math.sin(sideLength * 2) * this.size) - (x + Math.sin(sideLength * 1) * this.size),
               y: (y + Math.cos(sideLength * 2) * (this.size * this.squish)) - (y + Math.cos(sideLength *1) * (this.size * this.squish))
            }
            let testLen = Math.sqrt(testVec.x*testVec.x+testVec.y*testVec.y);
   
            for(let i=0; i<testLen; i+=testPixelSize){
               this.ctx.fillStyle = 'rgba(25,25,25,1.0)';
               this.ctx.fillRect(testX + testVec.x*(i/testLen) - testPixelSize/2, testY + testVec.y*(i/testLen) - testPixelSize/2, testPixelSize, testPixelSize);

               this.ctx.fillStyle = 'rgba(25,25,25,0.5)';
               this.ctx.fillRect(testX + testVec.x*(i/testLen) - testPixelSize*1.5/2, testY + testVec.y*(i/testLen) - testPixelSize*1.5/2, testPixelSize*1.5, testPixelSize*1.5);
            }
   
            this.ctx.fillRect(x + Math.sin(sideLength * 2) * this.size - testPixelSize/2, y + Math.cos(sideLength * 2) * (this.size * this.squish) - testPixelSize/2, testPixelSize, testPixelSize);
         }

      }

      if(edges.includes('BR')){

         if(lineStyle == "smooth"){
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.sin(sideLength * 6) * this.size, y + Math.cos(sideLength * 6) * (this.size * this.squish));
            this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.size, y + Math.cos(sideLength * 1) * (this.size * this.squish));
            this.ctx.stroke();
         } else {
            let testX = x + Math.sin(sideLength * 1) * this.size;
            let testY = y + Math.cos(sideLength * 1) * (this.size * this.squish);
   
            let testVec = {
               x: (x + Math.sin(sideLength * 6) * this.size) - (x + Math.sin(sideLength * 1) * this.size),
               y: (y + Math.cos(sideLength * 6) * (this.size * this.squish)) - (y + Math.cos(sideLength * 1) * (this.size * this.squish))
            }
            let testLen = Math.sqrt(testVec.x*testVec.x+testVec.y*testVec.y);
   
            for(let i=0; i<testLen; i+=testPixelSize){
               this.ctx.fillStyle = 'rgba(25,25,25,1.0)';
               this.ctx.fillRect(testX + testVec.x*(i/testLen) - testPixelSize/2, testY + testVec.y*(i/testLen) - testPixelSize/2, testPixelSize, testPixelSize);

               this.ctx.fillStyle = 'rgba(25,25,25,0.5)';
               this.ctx.fillRect(testX + testVec.x*(i/testLen) - testPixelSize*1.5/2, testY + testVec.y*(i/testLen) - testPixelSize*1.5/2, testPixelSize*1.5, testPixelSize*1.5);
            }
         }

      }

      if(edges.includes('BL')){

         if(lineStyle == "smooth"){
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.sin(sideLength * 5) * this.size, y + Math.cos(sideLength * 5) * (this.size * this.squish));
            this.ctx.lineTo(x + Math.sin(sideLength * 6) * this.size, y + Math.cos(sideLength * 6) * (this.size * this.squish));
            this.ctx.stroke();
         } else {
            let testX = x + Math.sin(sideLength * 6) * this.size;
            let testY = y + Math.cos(sideLength * 6) * (this.size * this.squish);
   
            let testVec = {
               x: (x + Math.sin(sideLength * 5) * this.size) - (x + Math.sin(sideLength * 6) * this.size),
               y: (y + Math.cos(sideLength * 5) * (this.size * this.squish)) - (y + Math.cos(sideLength * 6) * (this.size * this.squish))
            }
            let testLen = Math.sqrt(testVec.x*testVec.x+testVec.y*testVec.y);
   
            for(let i=0; i<testLen; i+=testPixelSize){
               this.ctx.fillStyle = 'rgba(25,25,25,1.0)';
               this.ctx.fillRect(testX + testVec.x*(i/testLen) - testPixelSize/2, testY + testVec.y*(i/testLen) - testPixelSize/2, testPixelSize, testPixelSize);

               this.ctx.fillStyle = 'rgba(25,25,25,0.5)';
               this.ctx.fillRect(testX + testVec.x*(i/testLen) - testPixelSize*1.5/2, testY + testVec.y*(i/testLen) - testPixelSize*1.5/2, testPixelSize*1.5, testPixelSize*1.5);
            }
         }

      }

      if(edges.includes('L')){

         if(lineStyle == "smooth"){
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.sin(sideLength * 4) * this.size, y + Math.cos(sideLength * 4) * (this.size * this.squish));
            this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.size, y + Math.cos(sideLength * 5) * (this.size * this.squish));
            this.ctx.stroke();
         } else {
            let testX = x + Math.sin(sideLength * 4) * this.size;
            let testY = y + Math.cos(sideLength * 4) * (this.size * this.squish);
   
            let testVec = {
               x: (x + Math.sin(sideLength * 5) * this.size) - (x + Math.sin(sideLength * 4) * this.size),
               y: (y + Math.cos(sideLength * 5) * (this.size * this.squish)) - (y + Math.cos(sideLength * 4) * (this.size * this.squish))
            }
            let testLen = Math.sqrt(testVec.x*testVec.x+testVec.y*testVec.y);
   
            for(let i=0; i<testLen; i+=testPixelSize){
               this.ctx.fillStyle = 'rgba(25,25,25,1.0)';
               this.ctx.fillRect(testX + testVec.x*(i/testLen) - testPixelSize/2, testY + testVec.y*(i/testLen) - testPixelSize/2, testPixelSize, testPixelSize);

               this.ctx.fillStyle = 'rgba(25,25,25,0.5)';
               this.ctx.fillRect(testX + testVec.x*(i/testLen) - testPixelSize*1.5/2, testY + testVec.y*(i/testLen) - testPixelSize*1.5/2, testPixelSize*1.5, testPixelSize*1.5);
            }
   
            this.ctx.fillRect(x + Math.sin(sideLength * 5) * this.size - testPixelSize/2, y + Math.cos(sideLength * 5) * (this.size * this.squish) - testPixelSize/2, testPixelSize, testPixelSize);
         }

      }

   }

}