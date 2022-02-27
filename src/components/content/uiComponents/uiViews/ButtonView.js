import PixelUIClass from "../../utilities/pixelUI";

export default class ButtonViewClass {

   constructor(){
      this.pixelUI = new PixelUIClass();
   }

   //should be a switch statement
   draw = (ctx, button) => {

      switch(button.state){
         case 'active':
            this.pixelUI.drawButton(ctx, button.x, button.y, button.width, button.height, button.pixelSize, button.text, button.font, 'lightGrey');
            break;
         case 'inactive':
            this.pixelUI.drawButton(ctx, button.x, button.y, button.width, button.height, button.pixelSize, button.text, button.font, 'darkGrey');
            break;
         case 'clicked':
            this.pixelUI.drawButton(ctx, button.x, button.y, button.width, button.height, button.pixelSize, button.text, button.font, 'grey');
            break;
      }
      
   }

}