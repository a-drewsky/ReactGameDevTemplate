export default class HexagonEdgesViewClass {

   draw = (ctx, size, squish, x, y, edges, pixelSize, lineStyle, color) => {

      ctx.strokeStyle = 'black';
      if(color) ctx.strokeStyle = color;

      let mainColor = 'rgb(0, 0, 0, 1.0)';
      let alphaColor = 'rgb(0, 0, 0, 0.5)';

      if(color){
         mainColor = color;
         alphaColor = `${color}${Math.floor(0.5 * 255).toString(16).padStart(2, 0)}`
      }

      let sideLength = Math.PI / 3;

      let drawPixelEdge = (edgeX, edgeY, vec, length) => {
         for(let i=0; i<length; i+=pixelSize){
            ctx.fillStyle = mainColor;
            ctx.fillRect(edgeX + vec.x*(i/length) - pixelSize/2, edgeY + vec.y*(i/length) - pixelSize/2, pixelSize, pixelSize);

            ctx.fillStyle = alphaColor;
            ctx.fillRect(edgeX + vec.x*(i/length) - pixelSize*1.5/2, edgeY + vec.y*(i/length) - pixelSize*1.5/2, pixelSize*1.5, pixelSize*1.5);
         }
      }

      if(edges.includes('TL')){

         if(lineStyle == "smooth"){
            ctx.beginPath();
            ctx.moveTo(x + Math.sin(sideLength * 3) * size, y + Math.cos(sideLength * 3) * (size * squish));
            ctx.lineTo(x + Math.sin(sideLength * 4) * size, y + Math.cos(sideLength * 4) * (size * squish));
            ctx.stroke();
         } else {
            let edgeX = x + Math.sin(sideLength * 3) * size;
            let edgeY = y + Math.cos(sideLength * 3) * (size * squish);
   
            let lineVec = {
               x: (x + Math.sin(sideLength * 4) * size) - (x + Math.sin(sideLength * 3) * size),
               y: (y + Math.cos(sideLength * 4) * (size * squish)) - (y + Math.cos(sideLength * 3) * (size * squish))
            }
            let lineLength = Math.sqrt(lineVec.x*lineVec.x+lineVec.y*lineVec.y);
            drawPixelEdge(edgeX, edgeY, lineVec, lineLength);
            
         }

      }

      if(edges.includes('TR')){

         if(lineStyle == "smooth"){
            ctx.beginPath();
            ctx.moveTo(x + Math.sin(sideLength * 2) * size, y + Math.cos(sideLength * 2) * (size * squish));
            ctx.lineTo(x + Math.sin(sideLength * 3) * size, y + Math.cos(sideLength * 3) * (size * squish));
            ctx.stroke();
         } else {
            let edgeX = x + Math.sin(sideLength * 2) * size;
            let edgeY = y + Math.cos(sideLength * 2) * (size * squish);
   
            let lineVec = {
               x: (x + Math.sin(sideLength * 3) * size) - (x + Math.sin(sideLength * 2) * size),
               y: (y + Math.cos(sideLength * 3) * (size * squish)) - (y + Math.cos(sideLength * 2) * (size * squish))
            }
            let lineLength = Math.sqrt(lineVec.x*lineVec.x+lineVec.y*lineVec.y);
            drawPixelEdge(edgeX, edgeY, lineVec, lineLength);
            
         }

      }

      if(edges.includes('R')){

         if(lineStyle == "smooth"){
            ctx.beginPath();
            ctx.moveTo(x + Math.sin(sideLength * 1) * size, y + Math.cos(sideLength *1) * (size * squish));
            ctx.lineTo(x + Math.sin(sideLength * 2) * size, y + Math.cos(sideLength * 2) * (size * squish));
            ctx.stroke();
         } else {
            let edgeX = x + Math.sin(sideLength * 1) * size;
            let edgeY = y + Math.cos(sideLength *1) * (size * squish);
   
            let lineVec = {
               x: (x + Math.sin(sideLength * 2) * size) - (x + Math.sin(sideLength * 1) * size),
               y: (y + Math.cos(sideLength * 2) * (size * squish)) - (y + Math.cos(sideLength *1) * (size * squish))
            }
            let lineLength = Math.sqrt(lineVec.x*lineVec.x+lineVec.y*lineVec.y);
            drawPixelEdge(edgeX, edgeY, lineVec, lineLength);
   
            ctx.fillRect(x + Math.sin(sideLength * 2) * size - pixelSize/2, y + Math.cos(sideLength * 2) * (size * squish) - pixelSize/2, pixelSize, pixelSize);
         }

      }

      if(edges.includes('BR')){

         if(lineStyle == "smooth"){
            ctx.beginPath();
            ctx.moveTo(x + Math.sin(sideLength * 6) * size, y + Math.cos(sideLength * 6) * (size * squish));
            ctx.lineTo(x + Math.sin(sideLength * 1) * size, y + Math.cos(sideLength * 1) * (size * squish));
            ctx.stroke();
         } else {
            let edgeX = x + Math.sin(sideLength * 1) * size;
            let edgeY = y + Math.cos(sideLength * 1) * (size * squish);
   
            let lineVec = {
               x: (x + Math.sin(sideLength * 6) * size) - (x + Math.sin(sideLength * 1) * size),
               y: (y + Math.cos(sideLength * 6) * (size * squish)) - (y + Math.cos(sideLength * 1) * (size * squish))
            }
            let lineLength = Math.sqrt(lineVec.x*lineVec.x+lineVec.y*lineVec.y);
            drawPixelEdge(edgeX, edgeY, lineVec, lineLength)
         }

      }

      if(edges.includes('BL')){

         if(lineStyle == "smooth"){
            ctx.beginPath();
            ctx.moveTo(x + Math.sin(sideLength * 5) * size, y + Math.cos(sideLength * 5) * (size * squish));
            ctx.lineTo(x + Math.sin(sideLength * 6) * size, y + Math.cos(sideLength * 6) * (size * squish));
            ctx.stroke();
         } else {
            let edgeX = x + Math.sin(sideLength * 6) * size;
            let edgeY = y + Math.cos(sideLength * 6) * (size * squish);
   
            let lineVec = {
               x: (x + Math.sin(sideLength * 5) * size) - (x + Math.sin(sideLength * 6) * size),
               y: (y + Math.cos(sideLength * 5) * (size * squish)) - (y + Math.cos(sideLength * 6) * (size * squish))
            }
            let lineLength = Math.sqrt(lineVec.x*lineVec.x+lineVec.y*lineVec.y);
            drawPixelEdge(edgeX, edgeY, lineVec, lineLength)
         }

      }

      if(edges.includes('L')){

         if(lineStyle == "smooth"){
            ctx.beginPath();
            ctx.moveTo(x + Math.sin(sideLength * 4) * size, y + Math.cos(sideLength * 4) * (size * squish));
            ctx.lineTo(x + Math.sin(sideLength * 5) * size, y + Math.cos(sideLength * 5) * (size * squish));
            ctx.stroke();
         } else {
            let edgeX = x + Math.sin(sideLength * 4) * size;
            let edgeY = y + Math.cos(sideLength * 4) * (size * squish);
   
            let lineVec = {
               x: (x + Math.sin(sideLength * 5) * size) - (x + Math.sin(sideLength * 4) * size),
               y: (y + Math.cos(sideLength * 5) * (size * squish)) - (y + Math.cos(sideLength * 4) * (size * squish))
            }
            let lineLength = Math.sqrt(lineVec.x*lineVec.x+lineVec.y*lineVec.y);
            drawPixelEdge(edgeX, edgeY, lineVec, lineLength)
   
            ctx.fillRect(x + Math.sin(sideLength * 5) * size - pixelSize/2, y + Math.cos(sideLength * 5) * (size * squish) - pixelSize/2, pixelSize, pixelSize);
         }

      }

   }

}