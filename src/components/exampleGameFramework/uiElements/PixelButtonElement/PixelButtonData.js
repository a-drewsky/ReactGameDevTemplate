import CollisionClass from "../../utilities/collision";

export default class PixelButtonDataClass {

   constructor(text, x, y, width, height, radius, pixelSize, font, colorList) {
      this.text = text;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.radius = radius;
      this.pixelSize = pixelSize
      this.font = font;
      this.colorList = colorList;

      this.state = 'active';

      this.collision = new CollisionClass();

   }

   setText = (text) => {
      this.text = text;
   }

   setDimensions = (x, y, width, height, radius) => {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      if(radius) this.radius = radius;
  }

  setPixelSize = (pixelSize) => {
     this.pixelSize = pixelSize;
  }

  setFont = (font) => {
     this.font = font;
  }

  setColorList = (colorList) => {
     this.colorList = colorList;
  }

   setState = (state) => {
      this.state = state;
   }



}