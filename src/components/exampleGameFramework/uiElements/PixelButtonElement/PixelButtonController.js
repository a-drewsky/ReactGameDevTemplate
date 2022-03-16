import CollisionClass from "../../utilities/collision";

export default class PixelButtonCotnrollerClass {

    constructor(pixelButtonData){
        this.pixelButtonData = pixelButtonData;

        this.collision = new CollisionClass();
    }

       //CONTROLLER METHODS
   click = (x, y) => {
    if (this.collision.pointRect(x, y, this.pixelButtonData.x, this.pixelButtonData.y, this.pixelButtonData.width, this.pixelButtonData.height) && this.pixelButtonData.state == 'active') return true;
    return null;
 }

}