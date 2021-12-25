import HexmapClass from './Hexmap.js';
import HexmapBuilderClass from './HexmapBuilder.js';
import HexGroupMapClass from './HexGroupMap.js';
import diceSheet from './diceSheet.png'
import UIManagerClass from './UIManager.js';
import HexGroupMapBuilderClass from './HexGroupMapBuilder.js';
import DiceManagerClass from './DiceManager.js';
import GameStateClass from './GameState.js';
import GlobalStateClass from './GlobalState.js';
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
      this.RollBuffer = this.diceSize / 2;

      //state variables



      // this.playerTurn = Math.floor(Math.random() * this.numPlayers);

      // this.battleTransitionTime = 0.5;
      // this.battleTransitionTimer = null;
      // this.battleTransition = false;

      // this.endTurnTransitionTime = null;
      // this.endTurnTransitionTimer = null;
      // this.endTurnInterval = null;


      // this.currentBattle = {
      //    attacker: null,
      //    defender: null,
      //    attackerRolls: [],
      //    defenderRolls: [],
      //    attackerStoppedRolls: [],
      //    defenderStoppedRolls: [],
      //    interval: null
      // }
      //....................................

      this.Q = Math.floor((this.canvas.width / (Math.sqrt(3) * this.size)) - 1);
      this.R = Math.floor((this.canvas.height / (2.7 / 2 * this.size)) - 1);

      this.numGroups = (mapSize == "small" ? 10 : mapSize == "medium" ? 20 : 30);
      this.numPlayers = numPlayers;
      this.colorMap = ['#dc143c', '#6495ed', '#90ee90', '#9370db', '#ff7f50', '#da70d6', '#40e0d0', '#fff44f', '#228b22', '#2A52BE']

      this.VecQ = { x: Math.sqrt(3) * this.size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * this.size, y: 3 / 2 * this.size }

      this.hexMap = new HexmapClass(
         this.ctx,
         canvas.width - (this.Q * Math.sqrt(3) * this.size) - Math.sqrt(3) * this.size / (mapSize == "small" ? 1.5 : mapSize == "medium" ? 2 : 4),
         canvas.height - (this.R * (3 / 2.2) * this.size * this.squish / this.mapYPos),
         this.size,
         this.squish
      );
      this.hexMapBuilder = new HexmapBuilderClass(this.hexMap, mapSize);
      this.hexGroupMap = new HexGroupMapClass(this.ctx, this.hexMap, this.numGroups, this.numPlayers, this.colorMap);
      this.hexGroupMapBuilder = new HexGroupMapBuilderClass(this.hexMap, this.hexGroupMap);
      this.diceSheet = new Image();
      this.uiManager = new UIManagerClass(this.ctx, this.canvas, this.buttonWidth);
      this.diceManager = new DiceManagerClass(this.ctx, this.canvas, this.hexMap, this.hexGroupMap, this.uiManager, this.colorMap, this.diceSize, this.numPlayers);
      this.buttonManager = new ButtonManagerClass(this.uiManager, this.drawGameObjects);

      
      this.state = new GlobalStateClass(this.hexMap, this.hexGroupMap, this.drawGameObjects);
      this.playerController = new PlayerControllerClass(this.hexMap, this.hexGroupMap, this.buttonManager, this.state);


   }

   clear = () => {
      clearInterval(this.currentBattle.interval);
      clearInterval(this.endTurnInterval);
   }



   createGame = () => {

      this.buttonManager.addButton("endTurnButton", this.canvas.width / 5.625 * 0.0625, 60, this.canvas.width / 5.625, this.canvas.width / 5.625 / 3, 'End Turn')
      this.buttonManager.setActive("endTurnButton");

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
         this.state.setPlayerTurn(Math.floor(Math.random() * this.numPlayers));
      }
      this.diceSheet.src = diceSheet;

   }

   drawGameObjects = () => {
      this.uiManager.clearCanvas();
      this.hexMap.drawHexMap();
      this.hexGroupMap.drawGroupEdges();
      this.diceManager.drawDice();

      this.diceManager.drawScoreboard(this.state.gameState.player);

      this.buttonManager.drawButtons();
   }


   endBattle = () => {
      clearInterval(this.hexGrid.currentBattle.interval)

      this.hexGrid.battleTransitionTimer = null;
      this.hexGrid.battleTransition = false;

      let attackerRollTotal = this.hexGrid.currentBattle.attackerRolls.reduce((a, b) => a + b, 0);

      //defender roll total
      let defenderRollTotal = this.hexGrid.currentBattle.defenderRolls.reduce((a, b) => a + b, 0);

      //result
      if (attackerRollTotal > defenderRollTotal) {
         this.hexGroupMap.get(this.hexGrid.currentBattle.defender).playerNumber = this.hexGroupMap.get(this.hexGrid.currentBattle.attacker).playerNumber;
         this.hexGroupMap.get(this.hexGrid.currentBattle.defender).dice = this.hexGroupMap.get(this.hexGrid.currentBattle.attacker).dice - 1;
         this.hexGroupMap.get(this.hexGrid.currentBattle.attacker).dice = 1;
      } else {
         this.hexGroupMap.get(this.hexGrid.currentBattle.attacker).dice = 1;
      }

      this.hexGrid.currentBattle = {
         attacker: null,
         defender: null,
         attackerRolls: [],
         defenderRolls: [],
         attackerStoppedRolls: [],
         defenderStoppedRolls: [],
         interval: null
      }

      this.hexGrid.drawHexGrid();
   }

   battleInterval = () => {

      this.hexGrid.ctx2.clearRect(0, 0, this.hexGrid.canvas2Dims.width, this.hexGrid.canvas2Dims.height);

      //check if battle is done
      let battleDone = true;
      for (let i = 0; i < this.hexGrid.currentBattle.attackerRolls.length; i++) {
         if (this.hexGrid.currentBattle.attackerStoppedRolls[i] == false) {
            battleDone = false;
            break;
         }
      }
      for (let i = 0; i < this.hexGrid.currentBattle.defenderRolls.length; i++) {
         if (this.hexGrid.currentBattle.defenderStoppedRolls[i] == false) {
            battleDone = false;
            break;
         }
      }

      if (battleDone && this.hexGrid.battleTransition == false) {
         this.hexGrid.battleTransition = true;
         this.hexGrid.battleTransitionTimer = 0;
         this.hexGrid.drawHexagons();
         this.hexGrid.drawGroupEdges();
         this.hexGrid.drawDice();
      }

      if (this.hexGrid.battleTransition) {
         if (this.hexGrid.battleTransitionTimer >= this.hexGrid.battleTransitionTime) {
            this.endBattle();
            return;
         }
         this.hexGrid.battleTransitionTimer += 0.1;
      }

      //attacker roll total
      let attackerRollTotal = 0;
      for (let i = 0; i < this.hexGrid.currentBattle.attackerRolls.length; i++) {
         if (this.hexGrid.currentBattle.attackerStoppedRolls[i] == false) continue;
         attackerRollTotal += this.hexGrid.currentBattle.attackerRolls[i] + 1;
      }
      this.hexGrid.ctx2.fillStyle = 'black'
      if (this.hexGrid.battleTransition && this.hexGrid.currentBattle.attackerRolls.reduce((a, b) => a + b, 0) <= this.hexGrid.currentBattle.defenderRolls.reduce((a, b) => a + b, 0)) this.hexGrid.ctx2.fillStyle = 'red'
      this.hexGrid.ctx2.font = `${this.hexGrid.canvas2Dims.width * 0.05}px Arial`;
      this.hexGrid.ctx2.fillText(attackerRollTotal, this.hexGrid.canvas2Dims.width / 2 - this.hexGrid.canvas2Dims.width / 20, this.hexGrid.canvas2Dims.height / 2)

      //defender roll total
      let defenderRollTotal = 0;
      for (let i = 0; i < this.hexGrid.currentBattle.defenderRolls.length; i++) {
         if (this.hexGrid.currentBattle.defenderStoppedRolls[i] == false) continue;
         defenderRollTotal += this.hexGrid.currentBattle.defenderRolls[i] + 1;
      }
      this.hexGrid.ctx2.fillStyle = 'black'
      if (this.hexGrid.battleTransition && this.hexGrid.currentBattle.attackerRolls.reduce((a, b) => a + b, 0) > this.hexGrid.currentBattle.defenderRolls.reduce((a, b) => a + b, 0)) this.hexGrid.ctx2.fillStyle = 'red'
      this.hexGrid.ctx2.font = `${this.hexGrid.canvas2Dims.width * 0.05}px Arial`;
      this.hexGrid.ctx2.fillText(defenderRollTotal, this.hexGrid.canvas2Dims.width / 2 + this.hexGrid.canvas2Dims.width / 20, this.hexGrid.canvas2Dims.height / 2)

      //roll attacker dice
      for (let i = 0; i < 4; i++) {

         if (this.hexGrid.currentBattle.attackerRolls.length <= i) break;

         if (this.hexGrid.currentBattle.attackerStoppedRolls[i] == false) {
            let newRoll = Math.floor(Math.random() * 6)

            while (newRoll == this.hexGrid.currentBattle.attackerRolls[i]) {
               newRoll = Math.floor(Math.random() * 6)
            }

            this.hexGrid.currentBattle.attackerRolls[i] = newRoll;
         }
         if (this.hexGrid.battleTransition && this.hexGrid.currentBattle.attackerRolls.reduce((a, b) => a + b, 0) <= this.hexGrid.currentBattle.defenderRolls.reduce((a, b) => a + b, 0)) {
            this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.attackerRolls[i] * this.hexGrid.imageSize, 0, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i, this.hexGrid.RollBuffer, this.hexGrid.diceSize * 2, this.hexGrid.diceSize * 2)
         } else this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.attackerRolls[i] * this.hexGrid.imageSize, (this.hexGroupMap.get(this.hexGrid.currentBattle.attacker).playerNumber + 1) * this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i, this.hexGrid.RollBuffer, this.hexGrid.diceSize * 2, this.hexGrid.diceSize * 2)
      }
      for (let i = 4; i < 8; i++) {

         if (this.hexGrid.currentBattle.attackerRolls.length <= i) break;

         if (this.hexGrid.currentBattle.attackerStoppedRolls[i] == false) {
            let newRoll = Math.floor(Math.random() * 6)

            while (newRoll == this.hexGrid.currentBattle.attackerRolls[i]) {
               newRoll = Math.floor(Math.random() * 6)
            }

            this.hexGrid.currentBattle.attackerRolls[i] = newRoll;
         }
         if (this.hexGrid.battleTransition && this.hexGrid.currentBattle.attackerRolls.reduce((a, b) => a + b, 0) <= this.hexGrid.currentBattle.defenderRolls.reduce((a, b) => a + b, 0)) {
            this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.attackerRolls[i] * this.hexGrid.imageSize, 0, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4), this.hexGrid.RollBuffer * 2 + this.hexGrid.diceSize * 2, this.hexGrid.diceSize * 2, this.hexGrid.diceSize * 2)
         } else this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.attackerRolls[i] * this.hexGrid.imageSize, (this.hexGroupMap.get(this.hexGrid.currentBattle.attacker).playerNumber + 1) * this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4), this.hexGrid.RollBuffer * 2 + this.hexGrid.diceSize * 2, this.hexGrid.diceSize * 2, this.hexGrid.diceSize * 2)
      }


      //roll defender dice
      for (let i = 0; i < 4; i++) {

         if (this.hexGrid.currentBattle.defenderRolls.length <= i) break;

         if (this.hexGrid.currentBattle.defenderStoppedRolls[i] == false) {
            let newRoll = Math.floor(Math.random() * 6)

            while (newRoll == this.hexGrid.currentBattle.defenderRolls[i]) {
               newRoll = Math.floor(Math.random() * 6)
            }

            this.hexGrid.currentBattle.defenderRolls[i] = newRoll;
         }
         if (this.hexGrid.battleTransition && this.hexGrid.currentBattle.attackerRolls.reduce((a, b) => a + b, 0) > this.hexGrid.currentBattle.defenderRolls.reduce((a, b) => a + b, 0)) {
            this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.defenderRolls[i] * this.hexGrid.imageSize, 0, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i) - this.hexGrid.diceSize * 2, this.hexGrid.RollBuffer, this.hexGrid.diceSize * 2, this.hexGrid.diceSize * 2)
         } else this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.defenderRolls[i] * this.hexGrid.imageSize, (this.hexGroupMap.get(this.hexGrid.currentBattle.defender).playerNumber + 1) * this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i) - this.hexGrid.diceSize * 2, this.hexGrid.RollBuffer, this.hexGrid.diceSize * 2, this.hexGrid.diceSize * 2)
      }
      for (let i = 4; i < 8; i++) {

         if (this.hexGrid.currentBattle.defenderRolls.length <= i) break;

         if (this.hexGrid.currentBattle.defenderStoppedRolls[i] == false) {
            let newRoll = Math.floor(Math.random() * 6)

            while (newRoll == this.hexGrid.currentBattle.defenderRolls[i]) {
               newRoll = Math.floor(Math.random() * 6)
            }

            this.hexGrid.currentBattle.defenderRolls[i] = newRoll;
         }
         if (this.hexGrid.battleTransition && this.hexGrid.currentBattle.attackerRolls.reduce((a, b) => a + b, 0) > this.hexGrid.currentBattle.defenderRolls.reduce((a, b) => a + b, 0)) {
            this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.defenderRolls[i] * this.hexGrid.imageSize, 0, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4)) - this.hexGrid.diceSize * 2, this.hexGrid.RollBuffer * 2 + this.hexGrid.diceSize * 2, this.hexGrid.diceSize * 2, this.hexGrid.diceSize * 2)
         } else this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.defenderRolls[i] * this.hexGrid.imageSize, (this.hexGroupMap.get(this.hexGrid.currentBattle.defender).playerNumber + 1) * this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4)) - this.hexGrid.diceSize * 2, this.hexGrid.RollBuffer * 2 + this.hexGrid.diceSize * 2, this.hexGrid.diceSize * 2, this.hexGrid.diceSize * 2)
      }

      //draw stop all buttons
      this.hexGrid.ctx2.font = `${this.hexGrid.canvas2Dims.width * 0.03}px Arial`;
      this.hexGrid.drawButton(this.hexGrid.ctx2, 'Stop All', 'lightGrey', this.hexGrid.RollBuffer, this.hexGrid.RollBuffer * 3 + this.hexGrid.diceSize * 4, this.hexGrid.buttonWidth, this.hexGrid.buttonWidth / 3)
      this.hexGrid.drawButton(this.hexGrid.ctx2, 'Stop All', 'lightGrey', this.hexGrid.canvas2Dims.width - this.hexGrid.RollBuffer - this.hexGrid.buttonWidth, this.hexGrid.RollBuffer * 3 + this.hexGrid.diceSize * 4, this.hexGrid.buttonWidth, this.hexGrid.buttonWidth / 3)

   }

   startBattle = () => {

      clearInterval(this.hexGrid.currentBattle.interval)
      this.hexGrid.currentBattle.attackerRolls = [];
      this.hexGrid.currentBattle.defenderRolls = [];
      this.hexGrid.currentBattle.attackerStoppedRolls = [];
      this.hexGrid.currentBattle.defenderStoppedRolls = [];

      let attackerGroup = this.hexGroupMap.get(this.hexGrid.currentBattle.attacker);
      let defenderGroup = this.hexGroupMap.get(this.hexGrid.currentBattle.defender);

      for (let i = 0; i < attackerGroup.dice; i++) {
         this.hexGrid.currentBattle.attackerRolls[i] = Math.floor(Math.random() * 6);
         this.hexGrid.currentBattle.attackerStoppedRolls[i] = false;
      }
      for (let i = 0; i < defenderGroup.dice; i++) {
         this.hexGrid.currentBattle.defenderRolls[i] = Math.floor(Math.random() * 6);
         this.hexGrid.currentBattle.defenderStoppedRolls[i] = false;
      }

      this.hexGrid.drawFightBox();

      this.hexGrid.currentBattle.interval = setInterval(this.battleInterval, 1000 / 10)

   }

   click2 = (x, y) => {

      //check attacker stop all button
      if (x > this.hexGrid.RollBuffer && y > this.hexGrid.RollBuffer * 3 + this.hexGrid.diceSize * 4 && x < this.hexGrid.RollBuffer + this.hexGrid.buttonWidth && y < this.hexGrid.RollBuffer * 3 + this.hexGrid.diceSize * 4 + this.hexGrid.buttonWidth / 3) {
         for (let i = 0; i < this.hexGrid.currentBattle.attackerStoppedRolls.length; i++) this.hexGrid.currentBattle.attackerStoppedRolls[i] = true;
      }

      //check defender stop all button
      if (x > this.hexGrid.canvas2Dims.width - this.hexGrid.RollBuffer - this.hexGrid.buttonWidth && y > this.hexGrid.RollBuffer * 3 + this.hexGrid.diceSize * 4 && x < this.hexGrid.canvas2Dims.width - this.hexGrid.RollBuffer - this.hexGrid.buttonWidth + this.hexGrid.buttonWidth && y < this.hexGrid.RollBuffer * 3 + this.hexGrid.diceSize * 4 + this.hexGrid.buttonWidth / 3) {
         for (let i = 0; i < this.hexGrid.currentBattle.defenderStoppedRolls.length; i++) this.hexGrid.currentBattle.defenderStoppedRolls[i] = true;
      }

      //check attacker dice
      for (let i = 0; i < 4; i++) {

         if (y < this.hexGrid.RollBuffer || y > this.hexGrid.RollBuffer + this.hexGrid.diceSize * 2 || this.hexGrid.currentBattle.attackerRolls.length <= i) break;
         if (this.hexGrid.currentBattle.attackerStoppedRolls[i] == true) continue;
         if (x > this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i && x < this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i + this.hexGrid.diceSize * 2) {
            this.hexGrid.currentBattle.attackerStoppedRolls[i] = true;
            return;
         }

      }
      for (let i = 4; i < 8; i++) {
         if (y < this.hexGrid.RollBuffer * 2 + this.hexGrid.diceSize * 2 || y > this.hexGrid.RollBuffer * 2 + this.hexGrid.diceSize * 2 + this.hexGrid.diceSize * 2 || this.hexGrid.currentBattle.attackerRolls.length <= i) break;
         if (this.hexGrid.currentBattle.attackerStoppedRolls[i] == true) continue;
         if (x > this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4) && x < this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4) + this.hexGrid.diceSize * 2) {
            this.hexGrid.currentBattle.attackerStoppedRolls[i] = true;
            return;
         }

      }

      //check defender dice
      for (let i = 0; i < 4; i++) {

         if (y < this.hexGrid.RollBuffer || y > this.hexGrid.RollBuffer + this.hexGrid.diceSize * 2 || this.hexGrid.currentBattle.defenderRolls.length <= i) break;
         if (this.hexGrid.currentBattle.defenderStoppedRolls[i] == true) continue;
         if (x < this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i) && x > this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i + this.hexGrid.diceSize * 2)) {
            this.hexGrid.currentBattle.defenderStoppedRolls[i] = true;
            return;
         }

      }
      for (let i = 4; i < 8; i++) {

         if (y < this.hexGrid.RollBuffer * 2 + this.hexGrid.diceSize * 2 || y > this.hexGrid.RollBuffer * 2 + this.hexGrid.diceSize * 2 + this.hexGrid.diceSize * 2 || this.hexGrid.currentBattle.defenderRolls.length <= i) break;
         if (this.hexGrid.currentBattle.defenderStoppedRolls[i] == true) continue;
         if (x < this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4)) && x > this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4) + this.hexGrid.diceSize * 2)) {
            this.hexGrid.currentBattle.defenderStoppedRolls[i] = true;
            return;
         }

      }
   }

   click = (x, y) => {
      this.playerController.click(x, y);
   }

   // click = (x, y) => {

   //    let roundToNearestHex = (hex) => {
   //       let fracQ = hex.Q;
   //       let fracR = hex.R;
   //       let fracS = -1 * hex.Q - hex.R

   //       let Q = Math.round(fracQ);
   //       let R = Math.round(fracR);
   //       let S = Math.round(fracS);

   //       let diffQ = Math.abs(Q - fracQ);
   //       let diffR = Math.abs(R - fracR);
   //       let diffS = Math.abs(S - fracS);

   //       if (diffQ > diffR && diffQ > diffS) {
   //          Q = -1 * R - S
   //       } else if (diffR > diffS) {
   //          R = -1 * Q - S
   //       } else {
   //          S = -1 * Q - R
   //       }

   //       return {
   //          Q: Q,
   //          R: R
   //       }

   //    }

   //    let adjacentGroups = (group1, group2) => {
   //       let group1Tiles = this.hexGroupMap.getGroupTiles(group1);
   //       let group2Tiles = this.hexGroupMap.getGroupTiles(group2);

   //       for (let i = 0; i < group1Tiles.length; i++) {
   //          let neighbors = this.hexGrid.hexMap.neighborKeys(group1Tiles[i].Q, group1Tiles[i].R);

   //          for (let j = 0; j < neighbors.length; j++) {
   //             let neighbor = neighbors[j];

   //             for (let k = 0; k < group2Tiles.length; k++) {
   //                if (neighbor.Q == group2Tiles[k].Q && neighbor.R == group2Tiles[k].R) return true;
   //             }
   //          }
   //       }
   //       return false;
   //    }

   //    let hexClicked = {
   //       Q: (Math.sqrt(3) / 3 * (x - this.hexGrid.X) - 1 / 3 * ((y - this.hexGrid.Y) * (1 / this.hexGrid.squish))) / this.hexGrid.size,
   //       R: (y - this.hexGrid.Y) * (1 / this.hexGrid.squish) * (2 / 3) / this.hexGrid.size
   //    }
   //    hexClicked = roundToNearestHex(hexClicked);

   //    if (this.hexGrid.endTurnTransitionTimer != null) return;

   //    //test end turn button clicked
   //    let buttonX = this.hexGrid.buttonWidth * 0.0625
   //    let buttonY = 60
   //    let buttonWidth = this.hexGrid.buttonWidth;
   //    let buttonHeight = this.hexGrid.buttonWidth / 3;
   //    if (x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight) {
   //       this.endTurn();
   //       return;
   //    }

   //    //test grid clicked
   //    if (this.hexGrid.currentBattle.attacker == null) {

   //       //test dice clicked
   //       for (let [key, value] of this.hexGroupMap.getMap()) {

   //          for (let j = 4; j < 8; j++) {
   //             if (value.dice > j) {
   //                if (x > this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 1.35
   //                   && y > this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (1 + (j - 4) * 0.55)
   //                   && x < this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 1.35 + this.hexGrid.diceSize
   //                   && y < this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (1 + (j - 4) * 0.55) + this.hexGrid.diceSize) {
   //                   if (this.hexGroupMap.get(key).dice < 2 || this.hexGroupMap.get(key).playerNumber != this.hexGrid.playerTurn) return;
   //                   this.hexGrid.currentBattle.attacker = key;
   //                   this.hexGrid.drawHexGrid();
   //                   return;
   //                }
   //             }
   //             else break;
   //          }
   //          for (let j = 0; j < 4; j++) {
   //             if (value.dice > j) {
   //                if (x > this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 0.6
   //                   && y > this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (0.75 + j * 0.55)
   //                   && x < this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 0.6 + this.hexGrid.diceSize
   //                   && y < this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (0.75 + j * 0.55) + this.hexGrid.diceSize) {
   //                   if (this.hexGroupMap.get(key).dice < 2 || this.hexGroupMap.get(key).playerNumber != this.hexGrid.playerTurn) return;
   //                   this.hexGrid.currentBattle.attacker = key;
   //                   this.hexGrid.drawHexGrid();
   //                   return;
   //                }
   //             }
   //          }
   //       }

   //       //test hex clicked
   //       if (!this.hexGrid.hexMap.has(hexClicked.Q, hexClicked.R) || this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).dice < 2 || this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber != this.hexGrid.playerTurn) return;

   //       this.hexGrid.currentBattle.attacker = this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group;

   //       this.hexGrid.drawHexGrid();
   //       return;
   //    }

   //    if (this.hexGrid.currentBattle.defender == null) {

   //       //test dice clicked
   //       for (let [key, value] of this.hexGroupMap.getMap()) {

   //          for (let j = 4; j < 8; j++) {
   //             if (value.dice > j) {
   //                if (x > this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 1.35
   //                   && y > this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (1 + (j - 4) * 0.55)
   //                   && x < this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 1.35 + this.hexGrid.diceSize
   //                   && y < this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (1 + (j - 4) * 0.55) + this.hexGrid.diceSize) {

   //                   if (this.hexGrid.currentBattle.attacker == key) {
   //                      this.hexGrid.currentBattle.attacker = null;
   //                      this.hexGrid.drawHexGrid();
   //                      return;
   //                   }

   //                   if (adjacentGroups(this.hexGrid.currentBattle.attacker, key) && this.hexGroupMap.get(key).playerNumber != this.hexGrid.playerTurn) {
   //                      this.hexGrid.currentBattle.defender = key;
   //                      this.hexGrid.drawHexGrid();
   //                      this.startBattle();
   //                      return;
   //                   } else if (this.hexGroupMap.get(key).dice >= 2 && this.hexGroupMap.get(key).playerNumber == this.hexGrid.playerTurn) {
   //                      this.hexGrid.currentBattle.attacker = key;
   //                   }

   //                   this.hexGrid.drawHexGrid();
   //                   return;
   //                }
   //             }
   //             else break;
   //          }
   //          for (let j = 0; j < 4; j++) {
   //             if (value.dice > j) {
   //                if (x > this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 0.6
   //                   && y > this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (0.75 + j * 0.55)
   //                   && x < this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 0.6 + this.hexGrid.diceSize
   //                   && y < this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (0.75 + j * 0.55) + this.hexGrid.diceSize) {

   //                   if (this.hexGrid.currentBattle.attacker == key) {
   //                      this.hexGrid.currentBattle.attacker = null;
   //                      this.hexGrid.drawHexGrid();
   //                      return;
   //                   }

   //                   if (adjacentGroups(this.hexGrid.currentBattle.attacker, key) && this.hexGroupMap.get(key).playerNumber != this.hexGrid.playerTurn) {
   //                      this.hexGrid.currentBattle.defender = key;
   //                      this.hexGrid.drawHexGrid();
   //                      this.startBattle();
   //                      return;
   //                   } else if (this.hexGroupMap.get(key).dice >= 2 && this.hexGroupMap.get(key).playerNumber == this.hexGrid.playerTurn) {
   //                      this.hexGrid.currentBattle.attacker = key;
   //                   }

   //                   this.hexGrid.drawHexGrid();
   //                   return;
   //                }
   //             }
   //          }
   //       }

   //       //test hex clicked
   //       if (!this.hexGrid.hexMap.has(hexClicked.Q, hexClicked.R)) return;

   //       if (this.hexGrid.currentBattle.attacker == this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group) {
   //          this.hexGrid.currentBattle.attacker = null;
   //          this.hexGrid.drawHexGrid();
   //          return;
   //       }

   //       if (adjacentGroups(this.hexGrid.currentBattle.attacker, this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group) && this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber != this.hexGrid.playerTurn) {
   //          this.hexGrid.currentBattle.defender = this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group;
   //          this.hexGrid.drawHexGrid();
   //          this.startBattle();
   //          return;
   //       } else if (this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).dice >= 2 && this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber == this.hexGrid.playerTurn) {
   //          this.hexGrid.currentBattle.attacker = this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group;
   //       }


   //       this.hexGrid.drawHexGrid();
   //       return;
   //    }

   // }

}