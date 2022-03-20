export default class PixelEdgeDataClass {

    constructor(x1, y1, x2, y2, pixelSize, color){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2; 
        this.y2 = y2;
        this.pixelSize = pixelSize;
        this.color = color;
    }

    setPositions = (x1, y1, x2, y2) => {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    setPixelSize = (pixelSize) => {
        this.pixelSize = pixelSize;
    }

    setColor = (color) => {
        this.color = color;
    }

}