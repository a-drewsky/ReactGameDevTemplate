export default class PixelEdgeViewClass {

    constructor(ctx, pixelEdgeData){
        this.ctx = ctx;

        this.pixelEdgeData = pixelEdgeData;
    }

    draw = () => {

        let mainColor = 'rgba(25,25,25,1.0)';
        let alphaColor = 'rgba(25,25,25,0.5)';
  
        if(this.pixelEdgeData.color){
           mainColor = this.pixelEdgeData.color;
           alphaColor = `${this.pixelEdgeData.color}${Math.floor(0.5 * 255).toString(16).padStart(2, 0)}`;
        }
  
        let testVec = {
           x: (this.pixelEdgeData.x2) - (this.pixelEdgeData.x1),
           y: (this.pixelEdgeData.y2) - (this.pixelEdgeData.y1)
        }
        let testLen = Math.sqrt(testVec.x * testVec.x + testVec.y * testVec.y);
  
        for (let i = 0; i < testLen; i += this.pixelEdgeData.pixelSize) {
           this.ctx.fillStyle = mainColor
           this.ctx.fillRect(this.pixelEdgeData.x1 + testVec.x * (i / testLen) - this.pixelEdgeData.pixelSize / 2, this.pixelEdgeData.y1 + testVec.y * (i / testLen) - this.pixelEdgeData.pixelSize / 2, this.pixelEdgeData.pixelSize, this.pixelEdgeData.pixelSize);
  
           this.ctx.fillStyle = alphaColor
           this.ctx.fillRect(this.pixelEdgeData.x1 + testVec.x * (i / testLen) - this.pixelEdgeData.pixelSize * 1.5 / 2, this.pixelEdgeData.y1 + testVec.y * (i / testLen) - this.pixelEdgeData.pixelSize * 1.5 / 2, this.pixelEdgeData.pixelSize * 1.5, this.pixelEdgeData.pixelSize * 1.5);
        }
     }

}