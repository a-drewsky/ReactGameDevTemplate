import ButtonClass from "./Button";

export default class ButtonManagerClass {

   constructor(uiManager, drawGameObjects) {
      this.uiManager = uiManager;
      this.drawGameObjects = drawGameObjects;

      this.buttonMap = new Map();
      this.buttonStates = {
         disabled: 'disabled',
         inactive: 'inactive',
         active: 'active',
         clicked: 'clicked'
      }
   }

   addButton(buttonName, x, y, width, height, text) {
      this.buttonMap.set(buttonName, new ButtonClass(x, y, width, height, text, this.uiManager));
   }

   drawButtons = () => {
      for (let [key, value] of this.buttonMap) {
         value.drawButton();
      }
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

   click = (x, y) => {
      for (let [key, value] of this.buttonMap) {
         if (value.click(x, y)) {

            value.setState(this.buttonStates.clicked);

            let clickTimer = setInterval(() => {
               console.log("clickTimer")
               value.setState(this.buttonStates.active);
               this.drawGameObjects();
               clearInterval(clickTimer);
            }, 1000 / 20)

            return key;
         }
      }
      return null;
   }



}