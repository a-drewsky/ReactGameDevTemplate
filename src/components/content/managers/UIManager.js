import ButtonClass from "../uiComponents/uiElements/Button";
import UIControllerClass from "../controllers/UIController";

export default class UIManagerClass {

   constructor() {
      this.buttonMap = new Map();
      this.buttonStates = {
         disabled: 'disabled',
         inactive: 'inactive',
         active: 'active',
         clicked: 'clicked'
      }
   }

   getButtons = () => {
      return this.buttonMap;
   }

   addButton(buttonName, x, y, width, height, pixelSize, font, text) {
      this.buttonMap.set(buttonName, new ButtonClass(x, y, width, height, pixelSize, font, text));
   }

   setDisabled = (buttonName) => {
      this.buttonMap.get(buttonName).setState(this.buttonStates.disabled);
   }
   setInactive = (buttonName) => {
      this.buttonMap.get(buttonName).setState(this.buttonStates.inactive);
   }
   setActive = (buttonName) => {
      this.buttonMap.get(buttonName).setState(this.buttonStates.active);
   }

   // click = (x, y) => {

   //    return this.uiController.click(x, y);

   //    // for (let [key, value] of this.buttonMap) {
   //    //    if (value.state=='active' && value.click(x, y)) {

   //    //       value.setState(this.buttonStates.clicked);

   //    //       let clickTimer = setInterval(() => {
   //    //          console.log("click")
   //    //          if(value.state == 'click') value.setState(this.buttonStates.active);
   //    //          clearInterval(clickTimer);
   //    //          this.drawGameObjects();
   //    //       }, 200)

   //    //       this.drawGameObjects();
   //    //       return key;
   //    //    }
   //    // }
   //    // return null;
   // }



}