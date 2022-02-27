

export default class UIControllerClass {

    constructor(uiManager, stateManager){
        this.uiManager = uiManager
        this.stateManager = stateManager
    }

    click = (x, y) => {
        for (let [key, value] of this.uiManager.buttonMap) {
           if (value.state == this.uiManager.buttonStates.active && value.click(x, y)) {
  
              value.setState(this.uiManager.buttonStates.clicked);
  
              let clickTimer = setInterval(() => {
                 if(value.state == this.uiManager.buttonStates.clicked) value.setState(this.uiManager.buttonStates.active);
                 clearInterval(clickTimer);
                 this.stateManager.gameStates.current.draw();
              }, 200)
  
              this.stateManager.gameStates.current.draw();
              return key;
           }
        }
        return null;
     }
}