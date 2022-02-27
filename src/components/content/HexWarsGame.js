import HexGroupDiceMapClass from './gameObjectComponents/gameObjectControllers/HexGroupDiceMapController.js';
import HexGroupDiceMapBuilderClass from './gameObjectComponents/gameObjectBuilders/HexGroupDiceMapBuilder.js';
import DiceBattleClass from './gameObjectComponents/gameObjectControllers/DiceBattleController.js';

import HexGroupMapClass from './gameObjectComponents/gameObjects/HexGroupMap.js';

import StateManagerClass from './managers/StateManager.js';
import UIManagerClass from "./managers/UIManager";

import InputControllerClass from './controllers/InputController.js';
import UIControllerClass from "./controllers/UIController";

import ScoreboardViewClass from './gameObjectComponents/gameObjectViews/ScoreboardView.js';
import FightBoxViewClass from './gameObjectComponents/gameObjectViews/FightBoxView.js';
import DiceBattleViewClass from './gameObjectComponents/gameObjectViews/DiceBattleView.js';
import EndDiceBattleViewClass from './gameObjectComponents/gameObjectViews/EndDiceBattleView.js';

import HexGroupDiceMapViewClass from './gameObjectComponents/gameObjectViews/HexGroupDiceMapView.js';

import ButtonViewClass from './uiComponents/uiViews/ButtonView.js';

import diceSheet from './images/diceSheet.png'

import pixelUIClass from './utilities/pixelUI.js';

export default class hexWarsGameClass {

   constructor(ctx, ctx2, canvas, canvas2, mapSize, numPlayers, mapGeneration, setWinCondition) {


      //TOP LEVEL VARIABLES
      
      //canvas
      this.ctx = ctx;
      this.ctx2 = ctx2;
      this.canvas = canvas;
      this.canvas2 = canvas2;

      //win condition
      this.setWinCondition = setWinCondition;

      //settings (should be in a seperate file)
      this.size = (mapSize == "small" ? canvas.width / 200 * 9 : mapSize == "medium" ? canvas.width / 200 * 7 : canvas.width / 200 * 5)
      this.mapGeneration = mapGeneration
      this.numPlayers = numPlayers

      this.squish = 0.75;
      this.diceSize = this.size * 1.5
      this.imageSize = null;
      this.mapYPos = 0.9;
      this.fightBoxSize = canvas.width / 2.5;

      this.Q = Math.floor((this.canvas.width / (Math.sqrt(3) * this.size)) - 1);
      this.R = Math.floor((this.canvas.height / (2.7 / 2 * this.size)) - 1);

      this.numGroups = (mapSize == "small" ? 10 : mapSize == "medium" ? 20 : 30);
      this.numPlayers = numPlayers;
      this.colorMap = ['#dc143c', '#6495ed', '#90ee90', '#9370db', '#ff7f50', '#da70d6', '#40e0d0', '#fff44f', '#228b22', '#2A52BE']
      
      this.mapX = canvas.width - (this.Q * Math.sqrt(3) * this.size) - Math.sqrt(3) * this.size / (mapSize == "small" ? 1.5 : mapSize == "medium" ? 2 : 4);
      this.mapY = canvas.height - (this.R * (3 / 2.2) * this.size * this.squish / this.mapYPos);

      //Images (should be in a seperate file)
      this.imageMap = new Map();
      this.diceSheet = new Image();

      //draw methods
      this.drawMethods = {
         defaultDrawMethod: this.defaultDrawMethod,
         battleDrawMethod: this.battleDrawMethod,
         endBattleDrawMethod: this.endBattleDrawMethod
      }

      //intervals
      this.intervals = {
         endTurnInterval: this.endTurnInterval,
         battleInterval: this.battleInterval,
         endBattleInterval: this.endBattleInterval
      }

      
      //Managers
      this.uiManager1 = new UIManagerClass();
      this.uiManager2 = new UIManagerClass();
      this.stateManager = new StateManagerClass(this.drawMethods, this.intervals, this.uiManager1, this.uiManager2);

      //Game Objects
      this.hexGroupDiceMap = new HexGroupMapClass(this.mapX, this.mapY, this.size, this.squish, this.stateManager, this.numGroups, this.numPlayers, this.colorMap);

      //Game Object Builders
      this.hexGroupDiceMapBuilder = new HexGroupDiceMapBuilderClass(this.hexGroupDiceMap, mapSize);

      //Controllers
      this.uiController1 = new UIControllerClass(this.uiManager1, this.stateManager);
      this.uiController2 = new UIControllerClass(this.uiManager2, this.stateManager);
      this.hexGroupDiceMapController = new HexGroupDiceMapClass(this.hexGroupDiceMap);
      this.diceBattle = new DiceBattleClass(this.ctx2, this.canvas2, this.stateManager)
      this.inputController = new InputControllerClass(this.hexGroupDiceMap, this.hexGroupDiceMapController, this.uiController1, this.uiController2, this.diceBattle, this.stateManager);

      //Game Object Views
      this.scoreboardView = new ScoreboardViewClass(this.ctx, this.imageMap, this.hexGroupDiceMap, this.stateManager, this.canvas.width / 11.25, this.canvas.width / 200 * 5 * 1.5, Math.floor(this.canvas.width / 250), `${this.canvas.width * 0.03}px Arial`);
      this.fightBoxView = new FightBoxViewClass(this.ctx, this.imageMap, this.hexGroupDiceMap, this.stateManager, this.canvas.width / 2 - this.fightBoxSize / 2, this.canvas.height / 2 - this.fightBoxSize / 4, this.fightBoxSize, this.fightBoxSize / 3, 20, this.canvas.width / 200 * 5 * 1.5, Math.floor(this.canvas.width / 100), `bold ${this.canvas2.width * 0.05}px Arial`)
      this.diceBattleView = new DiceBattleViewClass(this.ctx2, this.imageMap, this.hexGroupDiceMap, this.stateManager, `${this.canvas2.width * 0.05}px Arial`, this.diceBattle, this.canvas2.width, this.canvas2.height)
      this.endDiceBattleView = new EndDiceBattleViewClass(this.ctx2, this.imageMap, this.hexGroupDiceMap, this.stateManager, `${this.canvas2.width * 0.05}px Arial`, canvas.width / 200 * 5 * 1.5, this.canvas2.width, this.canvas2.height)

      this.hexGroupDiceMapView = new HexGroupDiceMapViewClass(this.ctx, this.hexGroupDiceMap, this.diceSize, this.imageMap);

      //Ui Object Views
      this.buttonView = new ButtonViewClass();
      //END TOP LEVEL VARIABLES


   }


   //DRAW METHODS
   globalDrawMethod = () => {
      //clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx2.clearRect(0, 0, this.canvas.width, this.canvas.height)

      //global draw methods
      this.hexGroupDiceMapView.draw();
      this.scoreboardView.draw();
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

   battleDrawMethod = () => {
      this.globalDrawMethod();
      this.fightBoxView.draw();
      this.diceBattleView.draw();
      this.uiDrawMethod();
   }

   endBattleDrawMethod = () => {
      this.globalDrawMethod();
      this.endDiceBattleView.draw();
      this.uiDrawMethod();

   }
   //END DRAW METHODS


   //TOP LEVEL CONTROLLERS
   click2 = (x, y) => {
      this.inputController.click2(x, y);
   }

   click = (x, y) => {
      this.inputController.click(x, y);
   }
   //END TOP LEVEL CONTROLLERS


   //SETUP FUNCTIONS
   createUIElements = () => {
      //use a canvas percentage function here instead of cavnas width
      this.uiManager1.addButton("endTurnButton", this.canvas.width / 5.625 * 0.0625, 60, this.canvas.width / 5.625, this.canvas.width / 5.625 / 3, Math.floor(this.canvas.width / 250), `${this.canvas.width * 0.03}px Arial`, 'End Turn')
      this.uiManager1.setActive("endTurnButton");

      this.uiManager2.addButton("attackerStopAll", this.diceBattle.rollBuffer, this.diceBattle.rollBuffer * 3 + this.diceBattle.battleDiceSize * 4, this.canvas.width / 5.625, this.canvas.width / 5.625 / 3, Math.floor(this.canvas.width / 250), `${this.canvas.width * 0.03}px Arial`, 'Stop All')
      this.uiManager2.setDisabled("attackerStopAll");
      this.uiManager2.addButton("defenderStopAll", this.canvas2.width - this.diceBattle.rollBuffer - this.canvas.width / 5.625, this.diceBattle.rollBuffer * 3 + this.diceBattle.battleDiceSize * 4, this.canvas.width / 5.625, this.canvas.width / 5.625 / 3, Math.floor(this.canvas.width / 250), `${this.canvas.width * 0.03}px Arial`, 'Stop All')
      this.uiManager2.setDisabled("defenderStopAll");
   }

   //Should be in images file
   loadImages = () => {

      this.imageMap.set('diceSheet', new Image());

      let imagesLoaded = 0;
      for (let [key, value] of this.imageMap) {
         value.onload = () => {
            imagesLoaded++;
            if (imagesLoaded == this.imageMap.size) this.stateManager.setPlayerTurn(Math.floor(Math.random() * this.numPlayers));
         }
      }

      this.imageMap.get('diceSheet').src = diceSheet;

   }


   createGame = () => {

      let pixelUI = new pixelUIClass();
      pixelUI.drawLoading(this.ctx);


      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.hexGroupDiceMapBuilder.build(this.mapGeneration, this.Q, this.R, this.numGroups)

      this.createUIElements();

      this.loadImages();

   }
   //END SETUP FUNCTIONS


   //INTERVAL FUNCTIONS
   clear = () => {
      clearInterval(this.stateManager.interval);
   }

   endTurnInterval = () => {
      let endTurn = () => {
         let newPlayer = this.stateManager.globalStates.currentPlayer + 1;
         if (newPlayer == this.hexGroupDiceMap.numPlayers) newPlayer = 0;
         while (this.hexGroupDiceMap.getPlayerGroups(newPlayer).length == 0) {
            newPlayer++;
            if (newPlayer == this.hexGroupDiceMap.numPlayers) newPlayer = 0;
         }

         this.stateManager.setPlayerTurn(newPlayer)
      }

      let playerGroups = this.hexGroupDiceMap.getPlayerGroups(this.stateManager.globalStates.currentPlayer);
      let selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

      if (playerGroups.filter(group => group[1].dice < 8).length == 0) {
         endTurn();
         return;
      }


      while (selectedGroup[1].dice >= 8) selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

      selectedGroup[1].dice++;
      this.hexGroupDiceMap.setGroup(selectedGroup[0], selectedGroup[1]);


      if (this.stateManager.gameStates.current.endTurnTransitionTimer >= this.stateManager.gameStates.current.endTurnTransitionTime) {
         endTurn();
         return;
      }

      this.stateManager.setGameState('endTurnTransitionTimer', this.stateManager.gameStates.current.endTurnTransitionTimer + 1);
   }

   endBattleInterval = () => {

      //attacker roll total
      let attackerRollTotal = this.stateManager.gameStates.current.attackerRolls.reduce((a, b) => a + b, 0);

      //defender roll total
      let defenderRollTotal = this.stateManager.gameStates.current.defenderRolls.reduce((a, b) => a + b, 0);

      //result
      if (attackerRollTotal > defenderRollTotal) {
         this.hexGroupDiceMap.getGroup(this.stateManager.gameStates.current.defender).playerNumber = this.hexGroupDiceMap.getGroup(this.stateManager.gameStates.current.attacker).playerNumber;
         this.hexGroupDiceMap.getGroup(this.stateManager.gameStates.current.defender).dice = this.hexGroupDiceMap.getGroup(this.stateManager.gameStates.current.attacker).dice - 1;
         this.hexGroupDiceMap.getGroup(this.stateManager.gameStates.current.attacker).dice = 1;
      } else {
         this.hexGroupDiceMap.getGroup(this.stateManager.gameStates.current.attacker).dice = 1;
      }

      let playersStanding = [];

      for (let i = 0; i < this.numPlayers; i++) {
         if (this.hexGroupDiceMap.getPlayerGroups(i).length > 0) {
            playersStanding.push(i);
         }
      }
      console.log(playersStanding)
      if (playersStanding.length == 1) {
         this.setWinCondition(playersStanding[0]);
      }

      this.hexGroupDiceMap.setTiles('default', this.stateManager.gameStates.current.attacker);
      this.hexGroupDiceMap.setTiles('default', this.stateManager.gameStates.current.defender);
      this.stateManager.setPlayerTurn(this.stateManager.globalStates.currentPlayer);
      return;
   }

   battleInterval = () => {

      //check if battle is done
      let battleDone = true;
      for (let i = 0; i < this.stateManager.gameStates.current.attackerRolls.length; i++) {
         if (this.stateManager.gameStates.current.attackerStoppedRolls[i] == false) {
            battleDone = false;
            break;
         }
      }
      for (let i = 0; i < this.stateManager.gameStates.current.defenderRolls.length; i++) {
         if (this.stateManager.gameStates.current.defenderStoppedRolls[i] == false) {
            battleDone = false;
            break;
         }
      }

      if (battleDone) {

         this.stateManager.setEndBattle(this.stateManager.gameStates.current.attacker, this.stateManager.gameStates.current.defender, this.stateManager.gameStates.current.attackerRolls, this.stateManager.gameStates.current.defenderRolls);
         return;
      }

      //Move to something like DiceMap.rollDice() instead

      //roll attacker dice
      let attackerRolls = this.stateManager.gameStates.current.attackerRolls;

      for (let i = 0; i < 4; i++) {

         if (this.stateManager.gameStates.current.attackerRolls.length <= i) break;

         if (this.stateManager.gameStates.current.attackerStoppedRolls[i] == false) {
            let newRoll = Math.floor(Math.random() * 6)
            while (newRoll == this.stateManager.gameStates.current.attackerRolls[i]) {
               newRoll = Math.floor(Math.random() * 6)
            }

            attackerRolls[i] = newRoll;
         }
      }
      for (let i = 4; i < 8; i++) {

         if (this.stateManager.gameStates.current.attackerRolls.length <= i) break;

         if (this.stateManager.gameStates.current.attackerStoppedRolls[i] == false) {
            let newRoll = Math.floor(Math.random() * 6)

            while (newRoll == this.stateManager.gameStates.current.attackerRolls[i]) {
               newRoll = Math.floor(Math.random() * 6)
            }

            attackerRolls[i] = newRoll;
         }
      }

      //roll defender dice
      let defenderRolls = this.stateManager.gameStates.current.defenderRolls;

      for (let i = 0; i < 4; i++) {
         if (this.stateManager.gameStates.current.defenderRolls.length <= i) break;

         if (this.stateManager.gameStates.current.defenderStoppedRolls[i] == false) {
            let newRoll = Math.floor(Math.random() * 6)

            while (newRoll == this.stateManager.gameStates.current.defenderRolls[i]) {
               newRoll = Math.floor(Math.random() * 6)
            }

            defenderRolls[i] = newRoll;
         }
      }
      for (let i = 4; i < 8; i++) {

         if (this.stateManager.gameStates.current.defenderRolls.length <= i) break;

         if (this.stateManager.gameStates.current.defenderStoppedRolls[i] == false) {
            let newRoll = Math.floor(Math.random() * 6)

            while (newRoll == this.stateManager.gameStates.current.defenderRolls[i]) {
               newRoll = Math.floor(Math.random() * 6)
            }

            defenderRolls[i] = newRoll;
         }
      }


      this.stateManager.setGameStates([['attackerRolls', attackerRolls], ['defenderRolls', defenderRolls]]);

   }
   //END INTERVAL FUNCTIONS

}