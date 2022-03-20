
//Import Managers
import StateManagerClass from './managers/StateManager';
import UIElementManagerClass from './managers/UIElementManager';
import GameObjectManagerClass from './managers/GameObjectManager';

//Import Input Controller
import InputControllerClass from './controllers/InputController';

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
      this.settings = settings;

      //Images
      this.images = new ImagesClass();

      //intervalsList
      this.intervalsList = {
         state1Interval: this.state1Interval,
         state2Interval: this.state2Interval
      }

      //Managers
      this.uiElementManager = new UIElementManagerClass(this.ctx);
      this.gameObjectManager = new GameObjectManagerClass(this.ctx);
      this.stateManager = new StateManagerClass(this.draw, this.intervalsList, this.gameObjectManager, this.uiElementManager);

      //Input controller
      this.inputController = new InputControllerClass(this.stateManager, this.uiController);
   }


   //TOP LEVEL CONTROLLERS
   clear = () => {
      clearInterval(this.stateManager.interval);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
   }

   click = (x, y) => {
      this.inputController.click(x, y);
   }
   //END TOP LEVEL CONTROLLERS


   //SETUP FUNCTIONS
   startGame = () => {
      this.stateManager.setState1(0);
   }


   createGame = () => {

      //Clear previous game
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Show loading screen
      let loadingView = new LoadingViewClass(this.ctx);
      loadingView.draw();

      //Create game objects
      this.gameObjectManager.createObjects(this.settings);

      //Create ui elements
      this.uiElementManager.createElements(this.canvas);

      //load images and pass start game function
      this.images.loadImages(this.startGame);

   }
   //END SETUP FUNCTIONS


   //DRAW FUNCTION
   draw = () => {
      //clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //draw game objects
      for (let [key, value] of this.gameObjectManager.objectMap) {
         if(value.state != 'disabled') value.object.view.draw(value.state);
      }
      
      //draw UI
      for (let [key, value] of this.uiElementManager.elementMap) {
         if(value.state != 'disabled') value.element.view.draw(value.state);
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