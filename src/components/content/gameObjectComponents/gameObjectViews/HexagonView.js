export default class HexagonViewClass {
   
   draw = (ctx, size, squish, x, y, color) => {
      ctx.fillStyle = 'grey';
      ctx.strokeStyle = 'white';
      if(color) ctx.fillStyle = color;
      if(color) ctx.strokeStyle = color;

      let sideLength = Math.PI / 3;
      ctx.beginPath();
      ctx.moveTo(x + Math.sin(0) * size, y + Math.cos(0) * (size * squish));
      ctx.lineTo(x + Math.sin(sideLength * 1) * size, y + Math.cos(sideLength * 1) * (size * squish));
      ctx.lineTo(x + Math.sin(sideLength * 2) * size, y + Math.cos(sideLength * 2) * (size * squish));
      ctx.lineTo(x + Math.sin(sideLength * 3) * size, y + Math.cos(sideLength * 3) * (size * squish));
      ctx.lineTo(x + Math.sin(sideLength * 4) * size, y + Math.cos(sideLength * 4) * (size * squish));
      ctx.lineTo(x + Math.sin(sideLength * 5) * size, y + Math.cos(sideLength * 5) * (size * squish));
      ctx.lineTo(x + Math.sin(sideLength * 6) * size, y + Math.cos(sideLength * 6) * (size * squish));
      ctx.fill();
      ctx.stroke();
   }

   

}