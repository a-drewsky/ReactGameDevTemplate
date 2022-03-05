import PixelEdgeViewClass from "./PixelEdgeView";

export default class PixelBoxViewClass {

    constructor(ctx){
        this.ctx = ctx;

        this.pixelEdgeView = new PixelEdgeViewClass(ctx);
    }

    drawBox = (x, y, width, height, radius, pixelSize, color, stroke) => {
        this.ctx.fillStyle = color;
  
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.lineTo(x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.lineTo(x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.lineTo(x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.lineTo(x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
  
  
        this.pixelEdgeView.drawPixelEdge(this.ctx, x, y + radius, x, y + height - radius, pixelSize, stroke && stroke)
        this.pixelEdgeView.drawPixelEdge(this.ctx, x, y + height - radius, x + radius, y + height, pixelSize, stroke && stroke)
        this.pixelEdgeView.drawPixelEdge(this.ctx, x + radius, y + height, x + width - radius, y + height, pixelSize, stroke && stroke)
        this.pixelEdgeView.drawPixelEdge(this.ctx, x + width - radius, y + height, x + width, y + height - radius, pixelSize, stroke && stroke)
        this.pixelEdgeView.drawPixelEdge(this.ctx, x + width, y + height - radius, x + width, y + radius, pixelSize, stroke && stroke)
        this.pixelEdgeView.drawPixelEdge(this.ctx, x + width, y + radius, x + width - radius, y, pixelSize, stroke && stroke)
        this.pixelEdgeView.drawPixelEdge(this.ctx, x + width - radius, y, x + radius, y, pixelSize, stroke && stroke)
        this.pixelEdgeView.drawPixelEdge(this.ctx, x + radius, y, x, y + radius, pixelSize, stroke && stroke)
     }

}