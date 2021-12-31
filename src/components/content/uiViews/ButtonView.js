import PixelUIClass from "../utilities/pixelUI";

export default class ButtonViewClass {

   constructor(){
      this.pixelUI = new PixelUIClass();
   }

   draw = (ctx, button) => {
      if (button.state == 'active') this.pixelUI.drawButton(ctx, button.x, button.y, button.width, button.height, button.pixelSize, button.text, button.font, 'lightGrey')
      if (button.state == 'inactive') this.pixelUI.drawButton(ctx, button.x, button.y, button.width, button.height, button.pixelSize, button.text, button.font, 'darkGrey')
      if (button.state == 'clicked') this.pixelUI.drawButton(ctx, button.x, button.y, button.width, button.height, button.pixelSize, button.text, button.font, 'grey')
   }

}