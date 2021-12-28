import HexmapClass from './Hexmap.js';
import HexmapBuilderClass from './HexmapBuilder.js';
import HexGroupMapClass from './HexGroupMap.js';
import diceSheet from './diceSheet.png'
import UIManagerClass from './UIManager.js';
import HexGroupMapBuilderClass from './HexGroupMapBuilder.js';
import DiceManagerClass from './DiceManager.js';
import StateManagerClass from './StateManager.js';
import PlayerControllerClass from './PlayerController.js';
import ButtonManagerClass from './ButtonManager.js';

export default class hexWarsGameClass {

   constructor(ctx, ctx2, canvas, canvas2, mapSize, numPlayers, mapGeneration) {

      this.ctx = ctx;
      this.ctx2 = ctx2;
      this.canvas = canvas;
      this.canvas2 = canvas2;
      this.canvasScalarSize = canvas.width / 200;
      this.size = (mapSize == "small" ? this.canvasScalarSize * 9 : mapSize == "medium" ? this.canvasScalarSize * 7 : this.canvasScalarSize * 5)
      this.mapGeneration = mapGeneration
      this.numPlayers = numPlayers

      this.squish = 0.75;
      this.diceSize = this.size * 1.5
      this.imageSize = null;
      this.mapYPos = 0.9;
      this.fightBoxSize = canvas.width / 2.5;
      this.rollBuffer = this.diceSize / 2;
      this.diceSheet = new Image();

      this.Q = Math.floor((this.canvas.width / (Math.sqrt(3) * this.size)) - 1);
      this.R = Math.floor((this.canvas.height / (2.7 / 2 * this.size)) - 1);

      this.numGroups = (mapSize == "small" ? 10 : mapSize == "medium" ? 20 : 30);
      this.numPlayers = numPlayers;
      this.colorMap = ['#dc143c', '#6495ed', '#90ee90', '#9370db', '#ff7f50', '#da70d6', '#40e0d0', '#fff44f', '#228b22', '#2A52BE']

      this.VecQ = { x: Math.sqrt(3) * this.size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * this.size, y: 3 / 2 * this.size }


      this.intervals = {
         endTurnInterval: this.endTurnInterval,
         battleInterval: this.battleInterval
      }

      this.stateManager = new StateManagerClass(this.drawGameObjects, this.intervals);


      this.hexMap = new HexmapClass(
         this.ctx,
         canvas.width - (this.Q * Math.sqrt(3) * this.size) - Math.sqrt(3) * this.size / (mapSize == "small" ? 1.5 : mapSize == "medium" ? 2 : 4),
         canvas.height - (this.R * (3 / 2.2) * this.size * this.squish / this.mapYPos),
         this.size,
         this.squish
      );
      this.hexMapBuilder = new HexmapBuilderClass(this.hexMap, mapSize);

      this.hexGroupMap = new HexGroupMapClass(this.ctx, this.hexMap, this.stateManager, this.numGroups, this.numPlayers, this.colorMap);
      this.hexGroupMapBuilder = new HexGroupMapBuilderClass(this.hexMap, this.hexGroupMap);

      this.uiManager = new UIManagerClass(this.ctx, this.canvas);
      this.uiManager2 = new UIManagerClass(this.ctx2, this.canvas2);

      this.diceManager = new DiceManagerClass(this.ctx, this.ctx2, this.canvas, this.canvas2, this.hexMap, this.hexGroupMap, this.uiManager, this.stateManager, this.colorMap, this.diceSize, this.numPlayers, this.rollBuffer);
      this.buttonManager = new ButtonManagerClass(this.uiManager, this.drawGameObjects);
      this.buttonManager2 = new ButtonManagerClass(this.uiManager, this.drawGameObjects);

      this.playerController = new PlayerControllerClass(this.hexMap, this.hexGroupMap, this.buttonManager, this.diceManager, this.stateManager);


   }

   clear = () => {
      clearInterval(this.stateManager.interval);
   }



   createGame = () => {

      this.buttonManager.addButton("endTurnButton", this.canvas.width / 5.625 * 0.0625, 60, this.canvas.width / 5.625, this.canvas.width / 5.625 / 3, 'End Turn')
      this.buttonManager.setActive("endTurnButton");

      this.buttonManager2.addButton("attackerStopAll", this.rollBuffer, this.rollBuffer * 3 + this.diceSize * 4, this.canvas.width / 5.625, this.canvas.width / 5.625 / 3, 'Stop All')
      this.buttonManager2.addButton("defenderStopAll", this.canvas2.width - this.rollBuffer - this.canvas.width / 5.625, this.rollBuffer * 3 + this.diceSize * 4, this.canvas.width / 5.625, this.canvas.width / 5.625 / 3, 'Stop All')

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


      let groupsCreated = -1;

      if (this.mapGeneration == "noise") {
         while (groupsCreated == -1) {
            this.hexMapBuilder.generateMap(this.Q, this.R);
            this.hexMapBuilder.removeNoiseTiles();
            this.hexMapBuilder.deleteIslands();
            groupsCreated = this.hexGroupMapBuilder.createGroups(this.numGroups);
         }
      } else if (this.mapGeneration == "algorithmic") {
         while (groupsCreated == -1) {
            this.hexMapBuilder.generateMap(this.Q, this.R);
            this.hexMapBuilder.removeOuterTiles();
            this.hexMapBuilder.removeInnerTiles();
            this.hexMapBuilder.deleteIslands();
            groupsCreated = this.hexGroupMapBuilder.createGroups(this.numGroups);
         }
      } else {
         while (groupsCreated == -1) {
            console.log(this.Q, this.R)
            this.hexMapBuilder.generateMap(this.Q, this.R);
            groupsCreated = this.hexGroupMapBuilder.createGroups(this.numGroups);
         }
      }

      this.hexGroupMapBuilder.assignGroups();
      this.diceManager.assignDice();

      this.uiManager.drawLoading();

      this.diceSheet.onload = () => {
         this.imageSize = this.diceSheet.width / 6;
         this.diceManager.setDiceSheet(this.diceSheet, this.imageSize);
         this.stateManager.setPlayerTurn(Math.floor(Math.random() * this.numPlayers));
      }
      this.diceSheet.src = diceSheet;

   }

   drawGameObjects = () => {
      this.uiManager.clearCanvas();
      this.uiManager2.clearCanvas();
      this.hexMap.drawHexMap();
      this.hexGroupMap.drawGroupEdges();
      this.diceManager.drawDice();

      this.diceManager.drawScoreboard();
      this.diceManager.drawBattle();

      this.buttonManager.drawButtons();
   }


   endTurnInterval = () => {

      let endTurn = () => {
         let newPlayer = this.stateManager.globalStates.currentPlayer + 1;
         if (newPlayer == this.hexGroupMap.numPlayers) newPlayer = 0;

         this.stateManager.setPlayerTurn(newPlayer)
      }

      let playerGroups = this.hexGroupMap.getPlayerGroups(this.stateManager.globalStates.currentPlayer);
      let selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

      if (playerGroups.filter(group => group[1].dice < 8).length == 0) {
         endTurn();
         return;
      }


      while (selectedGroup[1].dice >= 8) selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

      selectedGroup[1].dice++;
      this.hexGroupMap.set(selectedGroup[0], selectedGroup[1]);


      if (this.stateManager.gameState.endTurnTransitionTimer >= this.stateManager.gameState.endTurnTransitionTime) {
         endTurn();
         return;
      }

      this.stateManager.setGameState('endTurnTransitionTimer', this.stateManager.gameState.endTurnTransitionTimer + 1);
   }

   endBattleInterval = () => {
      if (this.hexGrid.battleTransitionTimer >= this.hexGrid.battleTransitionTime) {
         this.endBattle();
         return;
      }
      this.hexGrid.battleTransitionTimer += 0.1;
   }

   //need to implement
   battleInterval = () => {

      //this.hexGrid.ctx2.clearRect(0, 0, this.hexGrid.canvas2Dims.width, this.hexGrid.canvas2Dims.height);

      //check if battle is done
      let battleDone = true;
      for (let i = 0; i < this.stateManager.gameState.attackerRolls.length; i++) {
         if (this.stateManager.gameState.attackerStoppedRolls[i] == false) {
            battleDone = false;
            break;
         }
      }
      for (let i = 0; i < this.stateManager.gameState.defenderRolls.length; i++) {
         if (this.stateManager.gameState.defenderStoppedRolls[i] == false) {
            battleDone = false;
            break;
         }
      }

      if (battleDone) {
         // this.hexGrid.battleTransition = true;
         // this.hexGrid.battleTransitionTimer = 0;
         // this.hexGrid.drawHexagons();
         // this.hexGrid.drawGroupEdges();
         // this.hexGrid.drawDice();

         this.stateManager.setEndBattle();
      }

      let attackerRolls = this.stateManager.gameState.attackerRolls;

      //roll attacker dice
      for (let i = 0; i < 4; i++) {

         if (this.stateManager.gameState.attackerRolls.length <= i) break;

         if (this.stateManager.gameState.attackerStoppedRolls[i] == false) {
            let newRoll = Math.floor(Math.random() * 6)
            while (newRoll == this.stateManager.gameState.attackerRolls[i]) {
               newRoll = Math.floor(Math.random() * 6)
            }

            attackerRolls[i] = newRoll;
         }
      }
      for (let i = 4; i < 8; i++) {

         if (this.stateManager.gameState.attackerRolls.length <= i) break;

         if (this.stateManager.gameState.attackerStoppedRolls[i] == false) {
            let newRoll = Math.floor(Math.random() * 6)

            while (newRoll == this.stateManager.gameState.attackerRolls[i]) {
               newRoll = Math.floor(Math.random() * 6)
            }

            attackerRolls[i] = newRoll;
         }
      }

      let defenderRolls = this.stateManager.gameState.defenderRolls;

      //roll defender dice
      for (let i = 0; i < 4; i++) {
         if (this.stateManager.gameState.defenderRolls.length <= i) break;

         if (this.stateManager.gameState.defenderStoppedRolls[i] == false) {
            let newRoll = Math.floor(Math.random() * 6)

            while (newRoll == this.stateManager.gameState.defenderRolls[i]) {
               newRoll = Math.floor(Math.random() * 6)
            }

            defenderRolls[i] = newRoll;
         }
      }
      for (let i = 4; i < 8; i++) {

         if (this.stateManager.gameState.defenderRolls.length <= i) break;

         if (this.stateManager.gameState.defenderStoppedRolls[i] == false) {
            let newRoll = Math.floor(Math.random() * 6)

            while (newRoll == this.stateManager.gameState.defenderRolls[i]) {
               newRoll = Math.floor(Math.random() * 6)
            }

            defenderRolls[i] = newRoll;
         }
      }

      
      this.stateManager.setGameStates([['attackerRolls', attackerRolls],['defenderRolls', defenderRolls]]);

   }


   click2 = (x, y) => {
      this.playerController.click2(x, y);
   }

   click = (x, y) => {
      this.playerController.click(x, y);
   }

}