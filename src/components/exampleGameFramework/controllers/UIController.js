export default class UIControllerClass {

    constructor(gameManager){
        this.gameManager = gameManager;
    }

    click = (x, y) => {
        for (let [key, value] of this.gameManager.ui.buttonMap) {
           if (value.data.state == this.gameManager.ui.elementStates.active && value.controller.click(x, y)) {
  
              value.data.setState(this.gameManager.ui.elementStates.clicked);
  
              let clickTimer = setInterval(() => {
                 if(value.data.state == this.gameManager.ui.elementStates.clicked) value.data.setState(this.gameManager.ui.elementStates.active);
                 clearInterval(clickTimer);
                 this.gameManager.state.gameStates.current.draw();
              }, 200)
  
              this.gameManager.state.gameStates.current.draw();
              return {
                 key: key,
                 value: value.controller.click(x, y)
              }
           }
        }
        return null;
     }
}