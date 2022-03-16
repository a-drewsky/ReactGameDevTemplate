import ExampleState1ControllerClass from "./ExampleState1Controller";
import ExampleState2ControllerClass from "./ExampleState2Controller";

export default class InputControllerClass {

   constructor(stateManager, uiController) {
      this.stateManager = stateManager;
      this.uiController = uiController;

      this.exampleState1Controller = new ExampleState1ControllerClass(this.stateManager, this.uiController);
      this.exampleState2Controller = new ExampleState2ControllerClass(this.stateManager, this.uiController)

   }

   click = (x, y) => {

      switch (this.stateManager.gameStates.current.stateName) {
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