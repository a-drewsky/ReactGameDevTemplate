export default class PixelEdgeViewClass {

    constructor(ctx){
        this.ctx = ctx;
    }

    drawPixelEdge = (x1, y1, x2, y2, pixelSize, color) => {

        let mainColor = 'rgba(25,25,25,1.0)';
        let alphaColor = 'rgba(25,25,25,0.5)';
  
        if(color){
           mainColor = color;
           alphaColor = `${color}${Math.floor(0.5 * 255).toString(16).padStart(2, 0)}`;
        }
  
        let testVec = {
           x: (x2) - (x1),
           y: (y2) - (y1)
        }
        let testLen = Math.sqrt(testVec.x * testVec.x + testVec.y * testVec.y);
  
        for (let i = 0; i < testLen; i += pixelSize) {
           this.ctx.fillStyle = mainColor
           this.ctx.fillRect(x1 + testVec.x * (i / testLen) - pixelSize / 2, y1 + testVec.y * (i / testLen) - pixelSize / 2, pixelSize, pixelSize);
  
           this.ctx.fillStyle = alphaColor
           this.ctx.fillRect(x1 + testVec.x * (i / testLen) - pixelSize * 1.5 / 2, y1 + testVec.y * (i / testLen) - pixelSize * 1.5 / 2, pixelSize * 1.5, pixelSize * 1.5);
        }
     }

}