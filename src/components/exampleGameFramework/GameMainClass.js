
//Import Controllers
import InputControllerClass from './controllers/InputController';
import UIControllerClass from './controllers/UIController';

//Import Managers
import StateManagerClass from './managers/StateManager';
import UIManagerClass from './managers/UIElementManager';
import GameObjectManagerClass from './managers/GameObjectManager';

//Import Settings
import SettingsClass from './GameSettings';

//Import Images Class
import ImagesClass from './GameImages';

//Import Loading View
import LoadingViewClass from './uiElements/LoadingElement/LoadingView';

export default class GameMainClass {

   constructor(canvas, setWinCondition, settings) {
      //canvas
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.ctx.lineCap = 'round';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle'
      this.ctx.lineWidth = canvas.width * 0.005;

      //win condition
      this.setWinCondition = setWinCondition;

      //settings
      this.settings = new SettingsClass(settings, canvas)

      //Images
      this.images = new ImagesClass();

      //intervals
      this.intervals = {
         state1Interval: this.state1Interval,
         state2Interval: this.state2Interval
      }

      //Managers
      this.uiManager = new UIManagerClass(this.ctx);
      this.gameObjectManager = new GameObjectManagerClass(this.ctx);
      this.stateManager = new StateManagerClass(this.draw, this.intervals, this.uiManager);

      //Controllers
      this.uiController = new UIControllerClass(this.uiManager, this.stateManager);
      this.inputController = new InputControllerClass(this.stateManager, this.uiController);
   }
   
   //CLEAR FUNCTION
   clear = () => {
      clearInterval(this.stateManager.interval);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
   }
   //END CLEAR FUNCTION


   //TOP LEVEL CONTROLLERS
   click = (x, y) => {
      this.inputController.click(x, y);
   }
   //END TOP LEVEL CONTROLLERS


   //SETUP FUNCTIONS
   startGame = () => {
      console.log(this.images)
      this.stateManager.setState1(0);
   }


   createGame = () => {

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      let loadingView = new LoadingViewClass(this.ctx);
      loadingView.draw();

      this.gameObjectManager.createObjects(this.settings);

      this.gameObjectManager.objectMap.get('exampleGameObject1').object.builder.build(this.settings.size);

      this.uiManager.createElements(this.canvas);

      this.images.loadImages(this.startGame);

   }
   //END SETUP FUNCTIONS


   //DRAW FUNCTION
   draw = () => {
      //clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //draw UI
      for (let [key, value] of this.uiManager.elementMap) {
         if(value.state != 'disabled') value.element.view.draw(value.state);
      }

      //draw game objects
      for (let [key, value] of this.gameObjectManager.objectMap) {
         if(value.state != 'disabled') value.object.view.draw(value.state);
      }
   }
   //END DRAW FUNCTION


   //INTERVAL FUNCTIONS
   state1Interval = () => {


   }

   state2Interval = () => {


   }
   //END INTERVAL FUNCTIONS

}