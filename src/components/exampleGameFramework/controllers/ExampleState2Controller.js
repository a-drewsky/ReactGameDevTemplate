export default class ExampleState2ControllerClass {

    constructor(gameManager, uiController){
        this.gameManager = gameManager;
        this.uiController = uiController
    }

    click = (x, y) => {

        let uiElement = this.uiController.click(x, y);

        if(uiElement){
            //if ui element clicked (do something)


            return;
        }

        //if no ui element clicked (do something)

  
     }

}