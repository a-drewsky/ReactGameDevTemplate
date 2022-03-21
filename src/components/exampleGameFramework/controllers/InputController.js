import UIControllerClass from './UIController';
import ExampleState1ControllerClass from "./ExampleState1Controller";
import ExampleState2ControllerClass from "./ExampleState2Controller";

export default class InputControllerClass {

   constructor(gameManager) {
      this.gameManager = gameManager;
      this.uiController = new UIControllerClass(this.gameManager);

      //State controller List
      this.exampleState1Controller = new ExampleState1ControllerClass(this.gameManager, this.uiController);
      this.exampleState2Controller = new ExampleState2ControllerClass(this.gameManager, this.uiController);

   }

   click = (x, y) => {

      //State controller functions
      switch (this.gameManager.state.gameStates.current.stateName) {
         case 'stateOne':
            this.exampleState1Controller.click(x, y);
            break;
         case 'stateTwo':
            this.exampleState2Controller.click(x, y);
            break;
         default:
            break;
      }

   }

}