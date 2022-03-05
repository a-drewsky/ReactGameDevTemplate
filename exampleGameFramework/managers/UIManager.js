import ButtonClass from "../uiComponents/uiElements/Button";

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

}