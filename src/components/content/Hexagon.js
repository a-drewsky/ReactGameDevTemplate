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

   drawEdges = (x, y, edges, pixelSize, lineStyle, color) => {

      this.ctx.strokeStyle = 'black';
      if(color) this.ctx.strokeStyle = color;

      let mainColor = 'rgb(0, 0, 0, 1.0)';
      let alphaColor = 'rgb(0, 0, 0, 0.5)';

      if(color){
         mainColor = color;
         alphaColor = `${color}${Math.floor(0.5 * 255).toString(16).padStart(2, 0)}`
      }

      let sideLength = Math.PI / 3;

      let drawPixelEdge = (edgeX, edgeY, vec, length) => {
         for(let i=0; i<length; i+=pixelSize){
            this.ctx.fillStyle = mainColor;
            this.ctx.fillRect(edgeX + vec.x*(i/length) - pixelSize/2, edgeY + vec.y*(i/length) - pixelSize/2, pixelSize, pixelSize);

            this.ctx.fillStyle = alphaColor;
            this.ctx.fillRect(edgeX + vec.x*(i/length) - pixelSize*1.5/2, edgeY + vec.y*(i/length) - pixelSize*1.5/2, pixelSize*1.5, pixelSize*1.5);
         }
      }

      if(edges.includes('TL')){

         if(lineStyle == "smooth"){
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.sin(sideLength * 3) * this.size, y + Math.cos(sideLength * 3) * (this.size * this.squish));
            this.ctx.lineTo(x + Math.sin(sideLength * 4) * this.size, y + Math.cos(sideLength * 4) * (this.size * this.squish));
            this.ctx.stroke();
         } else {
            let edgeX = x + Math.sin(sideLength * 3) * this.size;
            let edgeY = y + Math.cos(sideLength * 3) * (this.size * this.squish);
   
            let lineVec = {
               x: (x + Math.sin(sideLength * 4) * this.size) - (x + Math.sin(sideLength * 3) * this.size),
               y: (y + Math.cos(sideLength * 4) * (this.size * this.squish)) - (y + Math.cos(sideLength * 3) * (this.size * this.squish))
            }
            let lineLength = Math.sqrt(lineVec.x*lineVec.x+lineVec.y*lineVec.y);
            drawPixelEdge(edgeX, edgeY, lineVec, lineLength);
            
         }

      }

      if(edges.includes('TR')){

         if(lineStyle == "smooth"){
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.sin(sideLength * 2) * this.size, y + Math.cos(sideLength * 2) * (this.size * this.squish));
            this.ctx.lineTo(x + Math.sin(sideLength * 3) * this.size, y + Math.cos(sideLength * 3) * (this.size * this.squish));
            this.ctx.stroke();
         } else {
            let edgeX = x + Math.sin(sideLength * 2) * this.size;
            let edgeY = y + Math.cos(sideLength * 2) * (this.size * this.squish);
   
            let lineVec = {
               x: (x + Math.sin(sideLength * 3) * this.size) - (x + Math.sin(sideLength * 2) * this.size),
               y: (y + Math.cos(sideLength * 3) * (this.size * this.squish)) - (y + Math.cos(sideLength * 2) * (this.size * this.squish))
            }
            let lineLength = Math.sqrt(lineVec.x*lineVec.x+lineVec.y*lineVec.y);
            drawPixelEdge(edgeX, edgeY, lineVec, lineLength);
            
         }

      }

      if(edges.includes('R')){

         if(lineStyle == "smooth"){
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.sin(sideLength * 1) * this.size, y + Math.cos(sideLength *1) * (this.size * this.squish));
            this.ctx.lineTo(x + Math.sin(sideLength * 2) * this.size, y + Math.cos(sideLength * 2) * (this.size * this.squish));
            this.ctx.stroke();
         } else {
            let edgeX = x + Math.sin(sideLength * 1) * this.size;
            let edgeY = y + Math.cos(sideLength *1) * (this.size * this.squish);
   
            let lineVec = {
               x: (x + Math.sin(sideLength * 2) * this.size) - (x + Math.sin(sideLength * 1) * this.size),
               y: (y + Math.cos(sideLength * 2) * (this.size * this.squish)) - (y + Math.cos(sideLength *1) * (this.size * this.squish))
            }
            let lineLength = Math.sqrt(lineVec.x*lineVec.x+lineVec.y*lineVec.y);
            drawPixelEdge(edgeX, edgeY, lineVec, lineLength);
   
            this.ctx.fillRect(x + Math.sin(sideLength * 2) * this.size - pixelSize/2, y + Math.cos(sideLength * 2) * (this.size * this.squish) - pixelSize/2, pixelSize, pixelSize);
         }

      }

      if(edges.includes('BR')){

         if(lineStyle == "smooth"){
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.sin(sideLength * 6) * this.size, y + Math.cos(sideLength * 6) * (this.size * this.squish));
            this.ctx.lineTo(x + Math.sin(sideLength * 1) * this.size, y + Math.cos(sideLength * 1) * (this.size * this.squish));
            this.ctx.stroke();
         } else {
            let edgeX = x + Math.sin(sideLength * 1) * this.size;
            let edgeY = y + Math.cos(sideLength * 1) * (this.size * this.squish);
   
            let lineVec = {
               x: (x + Math.sin(sideLength * 6) * this.size) - (x + Math.sin(sideLength * 1) * this.size),
               y: (y + Math.cos(sideLength * 6) * (this.size * this.squish)) - (y + Math.cos(sideLength * 1) * (this.size * this.squish))
            }
            let lineLength = Math.sqrt(lineVec.x*lineVec.x+lineVec.y*lineVec.y);
            drawPixelEdge(edgeX, edgeY, lineVec, lineLength)
         }

      }

      if(edges.includes('BL')){

         if(lineStyle == "smooth"){
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.sin(sideLength * 5) * this.size, y + Math.cos(sideLength * 5) * (this.size * this.squish));
            this.ctx.lineTo(x + Math.sin(sideLength * 6) * this.size, y + Math.cos(sideLength * 6) * (this.size * this.squish));
            this.ctx.stroke();
         } else {
            let edgeX = x + Math.sin(sideLength * 6) * this.size;
            let edgeY = y + Math.cos(sideLength * 6) * (this.size * this.squish);
   
            let lineVec = {
               x: (x + Math.sin(sideLength * 5) * this.size) - (x + Math.sin(sideLength * 6) * this.size),
               y: (y + Math.cos(sideLength * 5) * (this.size * this.squish)) - (y + Math.cos(sideLength * 6) * (this.size * this.squish))
            }
            let lineLength = Math.sqrt(lineVec.x*lineVec.x+lineVec.y*lineVec.y);
            drawPixelEdge(edgeX, edgeY, lineVec, lineLength)
         }

      }

      if(edges.includes('L')){

         if(lineStyle == "smooth"){
            this.ctx.beginPath();
            this.ctx.moveTo(x + Math.sin(sideLength * 4) * this.size, y + Math.cos(sideLength * 4) * (this.size * this.squish));
            this.ctx.lineTo(x + Math.sin(sideLength * 5) * this.size, y + Math.cos(sideLength * 5) * (this.size * this.squish));
            this.ctx.stroke();
         } else {
            let edgeX = x + Math.sin(sideLength * 4) * this.size;
            let edgeY = y + Math.cos(sideLength * 4) * (this.size * this.squish);
   
            let lineVec = {
               x: (x + Math.sin(sideLength * 5) * this.size) - (x + Math.sin(sideLength * 4) * this.size),
               y: (y + Math.cos(sideLength * 5) * (this.size * this.squish)) - (y + Math.cos(sideLength * 4) * (this.size * this.squish))
            }
            let lineLength = Math.sqrt(lineVec.x*lineVec.x+lineVec.y*lineVec.y);
            drawPixelEdge(edgeX, edgeY, lineVec, lineLength)
   
            this.ctx.fillRect(x + Math.sin(sideLength * 5) * this.size - pixelSize/2, y + Math.cos(sideLength * 5) * (this.size * this.squish) - pixelSize/2, pixelSize, pixelSize);
         }

      }

   }

}