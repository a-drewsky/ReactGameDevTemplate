export default class UIControllerClass {

    constructor(stateManager, uiManager){
        this.uiManager = uiManager
        this.stateManager = stateManager
    }

    click = (x, y) => {
        for (let [key, value] of this.uiManager.buttonMap) {
           if (value.data.state == this.uiManager.buttonStates.active && value.controller.click(x, y)) {
  
              value.data.setState(this.uiManager.buttonStates.clicked);
  
              let clickTimer = setInterval(() => {
                 if(value.data.state == this.uiManager.buttonStates.clicked) value.data.setState(this.uiManager.buttonStates.active);
                 clearInterval(clickTimer);
                 this.stateManager.gameStates.current.draw();
              }, 200)
  
              this.stateManager.gameStates.current.draw();
              return {
                 key: key,
                 x: x-value.data.x,
                 y: y-value.data.y
              }
           }
        }
        return null;
     }
}