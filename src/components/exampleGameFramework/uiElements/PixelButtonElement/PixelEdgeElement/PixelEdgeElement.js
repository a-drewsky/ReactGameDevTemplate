import PixelEdgeDataClass from "./PixelEdgeData";
import PixelEdgeViewClass from "./PixelEdgeView";

export default class PixelEdgeElementClass {

    constructor(ctx, x1, y1, x2, y2, pixelSize, color) {
        this.data = new PixelEdgeDataClass(x1, y1, x2, y2, pixelSize, color);
        this.view = new PixelEdgeViewClass(ctx, this.data);
    }

}