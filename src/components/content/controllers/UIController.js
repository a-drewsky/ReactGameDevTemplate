

export default class UIControllerClass {

    constructor(drawGameObjects, buttonMap, buttonStates){
        this.drawGameObjects = drawGameObjects;
        this.buttonMap = buttonMap;
        this.buttonStates = buttonStates;
    }

    click = (x, y) => {
        for (let [key, value] of this.buttonMap) {
           if (value.state=='active' && value.click(x, y)) {
  
              value.setState(this.buttonStates.clicked);
  
              let clickTimer = setInterval(() => {
                 console.log("click")
                 if(value.state == 'click') value.setState(this.buttonStates.active);
                 clearInterval(clickTimer);
                 this.drawGameObjects();
              }, 200)
  
              this.drawGameObjects();
              return key;
           }
        }
        return null;
     }
}