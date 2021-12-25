import UIManagerClass from "./UIManager";

export default class ButtonClass {

   constructor(x, y, width, height, text, uiManager){
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.text = text;

      
      this.state = 'disabled';

      this.uiManager = uiManager;
   }

   drawButton = () => {
      if(this.state == 'active') this.uiManager.drawButton(this.x, this.y, this.width, this.height, this.text, 'lightGrey')
      if(this.state == 'inactive') this.uiManager.drawButton(this.x, this.y, this.width, this.height, this.text, 'darkGrey')
      if(this.state == 'clicked') this.uiManager.drawButton(this.x, this.y, this.width, this.height, this.text, 'grey')
   }

   click = (x, y) => {
      if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height && this.state == 'active') return true;
      return false;
   }

   setState = (state) => {
      this.state = state;
   }

}