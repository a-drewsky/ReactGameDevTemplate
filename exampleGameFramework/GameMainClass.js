
//Import Game Object Controllers
import ExampleGameObjectControllerClass from './gameObjectComponents/gameObjectControllers/ExampleGameObjectController.js';

//Import Managers
import StateManagerClass from './managers/StateManager.js';
import UIManagerClass from "./managers/UIManager";

//Import Controllers
import InputControllerClass from './controllers/InputController.js';
import UIControllerClass from "./controllers/UIController";

//Import Game Object Views
import ExampleGameObjectViewClass from './gameObjectComponents/gameObjectViews/ExampleGameObjectView.js';

//Import Game Object
import ExampleGameObjectClass from './gameObjectComponents/gameObjects/ExampleGameObjectClass.js.js.js';

//Import UI 
import ButtonViewClass from './uiComponents/uiViews/ButtonView.js.js.js';

//Import Images
import diceSheet from './images/diceSheet.png'

//Import Utilities
import pixelUIClass from './utilities/pixelUI.js.js.js';

export default class hexWarsGameClass {

   constructor(ctx, canvas, mapSize, numPlayers, mapGeneration, setWinCondition) {


      //TOP LEVEL VARIABLES
      
      //canvas
      this.ctx = ctx;
      this.canvas = canvas;

      //win condition
      this.setWinCondition = setWinCondition;

      //settings (should be in a seperate file)
      this.size = (mapSize == "small" ? canvas.width / 200 * 9 : mapSize == "medium" ? canvas.width / 200 * 7 : canvas.width / 200 * 5)
      this.mapGeneration = mapGeneration
      this.numPlayers = numPlayers

      //Images (should be in a seperate file)
      this.imageMap = new Map();
      this.diceSheet = new Image();

      //draw methods
      this.drawMethods = {
         defaultDrawMethod: this.defaultDrawMethod,
         state1DrawMethod: this.state1DrawMethod
      }

      //intervals
      this.intervals = {
         endTurnInterval: this.endTurnInterval,
         battleInterval: this.battleInterval,
         endBattleInterval: this.endBattleInterval
      }

      
      //Managers
      this.uiManager = new UIManagerClass();
      this.stateManager = new StateManagerClass(this.drawMethods, this.intervals, this.uiManager1, this.uiManager2);

      //Game Objects
      this.ExampleGameObject = new ExampleGameObjectClass(this.mapX, this.mapY, this.size);

      //Game Object Builders
      this.ExampleGameObjectBuilder = new HexGroupDiceMapBuilderClass(this.ExampleGameObjectClass, mapSize);

      //Controllers
      this.uiController1 = new UIControllerClass(this.uiManager1, this.stateManager);
      this.uiController2 = new UIControllerClass(this.uiManager2, this.stateManager);
      this.ExampleGameObjectControllerClass = new ExampleGameObjectControllerClass(this.ExampleGameObjectClass);
      this.inputController = new InputControllerClass(this.hexGroupDiceMap, this.hexGroupDiceMapController, this.uiController1, this.uiController2, this.diceBattle, this.stateManager);

      //Game Object Views
      this.ExampleGameObjectView = new ExampleGameObjectViewClass(this.ctx, this.ExampleGameObject, this.size, this.imageMap);

      //Ui Object Views
      this.buttonView = new ButtonViewClass();
      this.scoreboardView = new ScoreboardViewClass(this.ctx, this.imageMap, this.hexGroupDiceMap, this.stateManager, this.canvas.width / 11.25, this.canvas.width / 200 * 5 * 1.5, Math.floor(this.canvas.width / 250), `${this.canvas.width * 0.03}px Arial`);
    
      //END TOP LEVEL VARIABLES


   }


   //DRAW METHODS
   globalDrawMethod = () => {
      //clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx2.clearRect(0, 0, this.canvas.width, this.canvas.height)

      //global draw methods
      this.ExampleGameObjectView.draw();
   }

   uiDrawMethod = () => {
      //draw UI
      for (let [key, value] of this.uiManager1.getButtons()) {
         this.buttonView.draw(this.ctx, value);
      }
      for (let [key, value] of this.uiManager2.getButtons()) {
         this.buttonView.draw(this.ctx2, value);
      }
   }

   defaultDrawMethod = () => {
      this.globalDrawMethod();
      this.uiDrawMethod();
   }

   state1DrawMethod = () => {
      this.globalDrawMethod();
      this.scoreboardView.draw();
      this.uiDrawMethod();
   }

   //END DRAW METHODS


   //TOP LEVEL CONTROLLERS

   click = (x, y) => {
      this.inputController.click(x, y);
   }
   
   //END TOP LEVEL CONTROLLERS


   //SETUP FUNCTIONS
   createUIElements = () => {
      //use a canvas percentage function here instead of cavnas width
      this.uiManager.addButton("exampleButton", 0, 0, 0, 0, 0, `${this.canvas.width * 0.01}px Arial`, 'Example')
      this.uiManager.setActive("exampleButton");
   }

   //Should be in images file
   loadImages = () => {

      this.imageMap.set('exampleImage', new Image());

      let imagesLoaded = 0;
      for (let [key, value] of this.imageMap) {
         value.onload = () => {
            imagesLoaded++;
            if (imagesLoaded == this.imageMap.size) this.stateManager.setState1(0);
         }
      }

      this.imageMap.get('exampleImage').src = diceSheet;

   }


   createGame = () => {

      let pixelUI = new pixelUIClass();
      pixelUI.drawLoading(this.ctx);


      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ExampleGameObjectBuilder.build(this.mapGeneration, this.numGroups)

      this.createUIElements();

      this.loadImages();

   }
   //END SETUP FUNCTIONS


   //INTERVAL FUNCTIONS
   clear = () => {
      clearInterval(this.stateManager.interval);
   }

   state1Interval = () => {
      

   }

   state2Interval = () => {

      
   }

   //END INTERVAL FUNCTIONS

}