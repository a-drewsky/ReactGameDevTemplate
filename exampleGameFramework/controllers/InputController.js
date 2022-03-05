export default class InputControllerClass {

   constructor(stateManager, uiController) {
      this.stateManager = stateManager;
      this.uiController = uiController;

   }

   click = (x, y) => {

      switch (this.stateManager.gameStates.current.stateName) {
         case 'stateOne':
            //stateOneController.click(x, y);
            break;
         case 'stateTwo':
            //stateTwoController.click(x, y);
            break;
         default:
            break;
      }

   }

}