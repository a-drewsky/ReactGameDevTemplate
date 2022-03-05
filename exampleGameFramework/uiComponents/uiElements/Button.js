import CollisionClass from "../../utilities/collision";

export default class ButtonClass {

   constructor(text, x, y, width, height, pixelSize, font, colorList) {
      this.text = text;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.pixelSize = pixelSize
      this.font = font;
      this.colorList = colorList;

      this.collision = new CollisionClass();

      this.state = 'active';

   }

   setState = (state) => {
      this.state = state;
   }

   click = (x, y) => {
      if (this.collision.pointRect(x, y, this.x, this.y, this.width, this.height) && this.state == 'active') return true;
      return null;
   }

}