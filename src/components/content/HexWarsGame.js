import HexGridClass from './HexGrid.js'
import HexmapClass from './Hexmap.js';
import HexmapBuilderClass from './HexmapBuilder.js';
import HexGroupMapClass from './HexGroupMap.js';
import diceSheet from './diceSheet.png'
import UIManagerClass from './UIManager.js';
import HexGroupMapBuilderClass from './HexGroupMapBuilder.js';

export default class hexWarsGameClass {

   constructor(ctx, ctx2, canvas, canvas2, mapSize, numPlayers, mapGeneration) {

      this.ctx = ctx;
      this.ctx2 = ctx2;
      this.canvas = canvas;
      this.canvas2 = canvas2;
      this.canvasScalarSize = canvas.width / 200;
      this.size = (mapSize == "small" ? this.canvasScalarSize * 9 : mapSize == "medium" ? this.canvasScalarSize * 7 : this.canvasScalarSize * 5)

      this.Q = Math.floor((this.canvas.width / (Math.sqrt(3) * this.size)) - 1);
      this.R = Math.floor((this.canvas.height / (2.7 / 2 * this.size)) - 1);

      this.numGroups = (mapSize == "small" ? 10 : mapSize == "medium" ? 20 : 30);
      this.numPlayers = numPlayers;
      this.colorMap = ['#dc143c', '#6495ed', '#90ee90', '#9370db', '#ff7f50', '#da70d6', '#40e0d0', '#fff44f', '#228b22', '#2A52BE']
      
      this.VecQ = { x: Math.sqrt(3) * this.size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * this.size, y: 3 / 2 * this.size }

      this.loaded = false;
      this.hexMap = new HexmapClass();
      this.hexMapBuilder = new HexmapBuilderClass(this.hexMap, mapSize);
      this.hexGrid = new HexGridClass(ctx, ctx2, this.hexMap, canvas, canvas2, mapSize, this.size, this.Q, this.R, this.VecQ, this.VecR)
      this.hexGroupMap = new HexGroupMapClass(this.hexMap, this.numGroups, this.numPlayers, this.VecQ, this.VecR);
      this.hexGroupMapBuilder = new HexGroupMapBuilderClass(this.hexMap, this.hexGroupMap, this.VecQ, this.VecR);
      this.diceSheet = new Image();
      this.uiManager = new UIManagerClass(this.ctx, this.canvas, this.colorMap, this.diceSize);

      

      this.mapGeneration = mapGeneration

      this.numPlayers = numPlayers
      this.playerTurn = Math.floor(Math.random() * this.numPlayers);

      
   }

   clear = () => {
      clearInterval(this.currentBattle.interval);
      clearInterval(this.endTurnInterval);
   }

   assignGroups = () => {

      let playerNumber = 0;

      console.log(this.hexGroupMap.map())

      for (let [key, value] of this.hexGroupMap.map()) {

         value.setPlayerNumber = playerNumber;

         let groupTiles = this.hexGroupMap.getGroupTiles(key);

         for(let i=0; i<groupTiles.length; i++){
            this.hexMap.set(groupTiles[i].Q, groupTiles[i].R, {
               group: key,
               color: this.colorMap[playerNumber]
            })
         }

         playerNumber++;
         if(playerNumber == this.numPlayers) playerNumber = 0;

      }

   }

   createGame = () => {

      
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
            console.log(this.hexGroupMap.map())
         }
      }

      this.assignGroups();
      this.assignDice();

      this.uiManager.drawLoading();

      this.diceSheet.onload = () => {
         this.loaded = true;
         this.imageSize = this.diceSheet.width / 6;
         this.uiManager.setDiceSheet(this.diceSheet, this.imageSize);
         this.hexGrid.drawHexGrid();
      }
      this.diceSheet.src = diceSheet;

   }

   drawGroupEdges = () => {
      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q * this.squish + this.VecR.y * keyObj.R * this.squish;

         let edges = [];
         if (value.group != null) edges = this.hexGroupMap.getGroupEdges(keyObj.Q, keyObj.R);



         this.HexagonClass.drawEdges(this.X + xOffset, this.Y + yOffset, edges, Math.floor(this.size / 5.5), "pixel")
      }

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q * this.squish + this.VecR.y * keyObj.R * this.squish;

         let edges = [];
         if (value.group != null) edges = this.hexGroupMap.getGroupEdges(keyObj.Q, keyObj.R);

         if (value.group == this.currentBattle.defender) this.HexagonClass.drawEdges(this.X + xOffset, this.Y + yOffset, edges, Math.floor(this.size / 5.5), "pixel", "defender")

      }

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q * this.squish + this.VecR.y * keyObj.R * this.squish;

         let edges = [];
         if (value.group != null) edges = this.hexGroupMap.getGroupEdges(keyObj.Q, keyObj.R);

         if (value.group == this.currentBattle.attacker) this.HexagonClass.drawEdges(this.X + xOffset, this.Y + yOffset, edges, Math.floor(this.size / 5.5), "pixel", "attacker")

      }

   }

   drawDice = () => {
      for (let [key, value] of this.hexGroupMap.map()) {

         let sheetHasImage = (this.imageSize * (value.playerNumber + 1) < this.diceSheet.height)

         this.ctx.fillStyle = 'rgba(25,25,25,0.8)';
         this.ctx.beginPath();
         this.ctx.ellipse(this.X + value.drawPos.X + this.diceSize * 0.25, this.Y + value.drawPos.Y * this.squish + this.diceSize / 8, this.diceSize / 2, this.diceSize / 4, Math.PI, Math.PI / 2, Math.PI * 2);
         this.ctx.fill();

         for (let j = 4; j < 8; j++) {
            if (value.dice > j) {
               if (this.battleTransition) {
                  if (
                     (key == this.currentBattle.defender && this.currentBattle.attackerRolls.reduce((a, b) => a + b, 0) > this.currentBattle.defenderRolls.reduce((a, b) => a + b, 0))
                     ||
                     (key == this.currentBattle.attacker && this.currentBattle.attackerRolls.reduce((a, b) => a + b, 0) <= this.currentBattle.defenderRolls.reduce((a, b) => a + b, 0))
                  ) {
                     this.ctx.drawImage(this.diceSheet, this.imageSize * value.diceOrientations[j], 0, this.imageSize, this.imageSize, this.X + value.drawPos.X - this.diceSize * 1.35, this.Y + value.drawPos.Y * this.squish - this.diceSize * (1 + (j - 4) * 0.55), this.diceSize, this.diceSize);
                     continue;
                  }
               }
               this.ctx.drawImage(this.diceSheet, this.imageSize * value.diceOrientations[j], sheetHasImage ? this.imageSize * (value.playerNumber + 1) : 0, this.imageSize, this.imageSize, this.X + value.drawPos.X - this.diceSize * 1.35, this.Y + value.drawPos.Y * this.squish - this.diceSize * (1 + (j - 4) * 0.55), this.diceSize, this.diceSize);
            } else break;
         }

         for (let j = 0; j < 4; j++) {
            if (value.dice > j) {
               if (this.battleTransition) {
                  if (
                     (key == this.currentBattle.defender && this.currentBattle.attackerRolls.reduce((a, b) => a + b, 0) > this.currentBattle.defenderRolls.reduce((a, b) => a + b, 0))
                     ||
                     (key == this.currentBattle.attacker && this.currentBattle.attackerRolls.reduce((a, b) => a + b, 0) <= this.currentBattle.defenderRolls.reduce((a, b) => a + b, 0))
                  ) {
                     this.ctx.drawImage(this.diceSheet, this.imageSize * value.diceOrientations[j], 0, this.imageSize, this.imageSize, this.X + value.drawPos.X - this.diceSize * 0.6, this.Y + value.drawPos.Y * this.squish - this.diceSize * (0.75 + j * 0.55), this.diceSize, this.diceSize);
                     continue;
                  }
               }
               this.ctx.drawImage(this.diceSheet, this.imageSize * value.diceOrientations[j], sheetHasImage ? this.imageSize * (value.playerNumber + 1) : 0, this.imageSize, this.imageSize, this.X + value.drawPos.X - this.diceSize * 0.6, this.Y + value.drawPos.Y * this.squish - this.diceSize * (0.75 + j * 0.55), this.diceSize, this.diceSize);
            }
         }
      }
   }

   assignDice = () => {
      for (let i = 0; i < this.numPlayers; i++) {
         let numDice = this.numGroups / this.numPlayers * 3;
         //let playerGroups = this.hexGroupMap.filter(group => group.playerNumber == i);
         let playerGroups = this.hexGroupMap.getPlayerGroups(i);

         numDice -= playerGroups.length;

         for (let j = 0; j < numDice; j++) {
            let selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

            if (playerGroups.filter(group => group[1].dice < 8).length == 0) break;
            while (selectedGroup[1].dice >= 8) selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

            selectedGroup[1].dice++;
            this.hexGroupMap.set(selectedGroup[0], selectedGroup[1]);
         }

      }
   }

   endBattle = () => {
      console.log("Act")
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

      this.hexGrid.currentBattle.interval = setInterval(() => {

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
               this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.attackerRolls[i] * this.hexGrid.imageSize, 0, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i, this.hexGrid.RollBuffer, this.hexGrid.dieSize * 2, this.hexGrid.dieSize * 2)
            } else this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.attackerRolls[i] * this.hexGrid.imageSize, (this.hexGroupMap.get(this.hexGrid.currentBattle.attacker).playerNumber + 1) * this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i, this.hexGrid.RollBuffer, this.hexGrid.dieSize * 2, this.hexGrid.dieSize * 2)
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
               this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.attackerRolls[i] * this.hexGrid.imageSize, 0, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4), this.hexGrid.RollBuffer * 2 + this.hexGrid.dieSize * 2, this.hexGrid.dieSize * 2, this.hexGrid.dieSize * 2)
            } else this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.attackerRolls[i] * this.hexGrid.imageSize, (this.hexGroupMap.get(this.hexGrid.currentBattle.attacker).playerNumber + 1) * this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4), this.hexGrid.RollBuffer * 2 + this.hexGrid.dieSize * 2, this.hexGrid.dieSize * 2, this.hexGrid.dieSize * 2)
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
               this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.defenderRolls[i] * this.hexGrid.imageSize, 0, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i) - this.hexGrid.dieSize * 2, this.hexGrid.RollBuffer, this.hexGrid.dieSize * 2, this.hexGrid.dieSize * 2)
            } else this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.defenderRolls[i] * this.hexGrid.imageSize, (this.hexGroupMap.get(this.hexGrid.currentBattle.defender).playerNumber + 1) * this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i) - this.hexGrid.dieSize * 2, this.hexGrid.RollBuffer, this.hexGrid.dieSize * 2, this.hexGrid.dieSize * 2)
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
               this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.defenderRolls[i] * this.hexGrid.imageSize, 0, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4)) - this.hexGrid.dieSize * 2, this.hexGrid.RollBuffer * 2 + this.hexGrid.dieSize * 2, this.hexGrid.dieSize * 2, this.hexGrid.dieSize * 2)
            } else this.hexGrid.ctx2.drawImage(this.hexGrid.diceSheet, this.hexGrid.currentBattle.defenderRolls[i] * this.hexGrid.imageSize, (this.hexGroupMap.get(this.hexGrid.currentBattle.defender).playerNumber + 1) * this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.imageSize, this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4)) - this.hexGrid.dieSize * 2, this.hexGrid.RollBuffer * 2 + this.hexGrid.dieSize * 2, this.hexGrid.dieSize * 2, this.hexGrid.dieSize * 2)
         }

         //draw stop all buttons
         this.hexGrid.ctx2.font = `${this.hexGrid.canvas2Dims.width * 0.03}px Arial`;
         this.hexGrid.drawButton(this.hexGrid.ctx2, 'Stop All', 'lightGrey', this.hexGrid.RollBuffer, this.hexGrid.RollBuffer * 3 + this.hexGrid.dieSize * 4, this.hexGrid.buttonWidth, this.hexGrid.buttonWidth / 3)
         this.hexGrid.drawButton(this.hexGrid.ctx2, 'Stop All', 'lightGrey', this.hexGrid.canvas2Dims.width - this.hexGrid.RollBuffer - this.hexGrid.buttonWidth, this.hexGrid.RollBuffer * 3 + this.hexGrid.dieSize * 4, this.hexGrid.buttonWidth, this.hexGrid.buttonWidth / 3)

      }, 1000 / 10)

   }

   click2 = (x, y) => {

      //check attacker stop all button
      if (x > this.hexGrid.RollBuffer && y > this.hexGrid.RollBuffer * 3 + this.hexGrid.dieSize * 4 && x < this.hexGrid.RollBuffer + this.hexGrid.buttonWidth && y < this.hexGrid.RollBuffer * 3 + this.hexGrid.dieSize * 4 + this.hexGrid.buttonWidth / 3) {
         for (let i = 0; i < this.hexGrid.currentBattle.attackerStoppedRolls.length; i++) this.hexGrid.currentBattle.attackerStoppedRolls[i] = true;
      }

      //check defender stop all button
      if (x > this.hexGrid.canvas2Dims.width - this.hexGrid.RollBuffer - this.hexGrid.buttonWidth && y > this.hexGrid.RollBuffer * 3 + this.hexGrid.dieSize * 4 && x < this.hexGrid.canvas2Dims.width - this.hexGrid.RollBuffer - this.hexGrid.buttonWidth + this.hexGrid.buttonWidth && y < this.hexGrid.RollBuffer * 3 + this.hexGrid.dieSize * 4 + this.hexGrid.buttonWidth / 3) {
         for (let i = 0; i < this.hexGrid.currentBattle.defenderStoppedRolls.length; i++) this.hexGrid.currentBattle.defenderStoppedRolls[i] = true;
      }

      //check attacker dice
      for (let i = 0; i < 4; i++) {

         if (y < this.hexGrid.RollBuffer || y > this.hexGrid.RollBuffer + this.hexGrid.dieSize * 2 || this.hexGrid.currentBattle.attackerRolls.length <= i) break;
         if (this.hexGrid.currentBattle.attackerStoppedRolls[i] == true) continue;
         if (x > this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i && x < this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i + this.hexGrid.dieSize * 2) {
            this.hexGrid.currentBattle.attackerStoppedRolls[i] = true;
            return;
         }

      }
      for (let i = 4; i < 8; i++) {
         if (y < this.hexGrid.RollBuffer * 2 + this.hexGrid.dieSize * 2 || y > this.hexGrid.RollBuffer * 2 + this.hexGrid.dieSize * 2 + this.hexGrid.dieSize * 2 || this.hexGrid.currentBattle.attackerRolls.length <= i) break;
         if (this.hexGrid.currentBattle.attackerStoppedRolls[i] == true) continue;
         if (x > this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4) && x < this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4) + this.hexGrid.dieSize * 2) {
            this.hexGrid.currentBattle.attackerStoppedRolls[i] = true;
            return;
         }

      }

      //check defender dice
      for (let i = 0; i < 4; i++) {

         if (y < this.hexGrid.RollBuffer || y > this.hexGrid.RollBuffer + this.hexGrid.dieSize * 2 || this.hexGrid.currentBattle.defenderRolls.length <= i) break;
         if (this.hexGrid.currentBattle.defenderStoppedRolls[i] == true) continue;
         if (x < this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i) && x > this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i + this.hexGrid.dieSize * 2)) {
            this.hexGrid.currentBattle.defenderStoppedRolls[i] = true;
            return;
         }

      }
      for (let i = 4; i < 8; i++) {

         if (y < this.hexGrid.RollBuffer * 2 + this.hexGrid.dieSize * 2 || y > this.hexGrid.RollBuffer * 2 + this.hexGrid.dieSize * 2 + this.hexGrid.dieSize * 2 || this.hexGrid.currentBattle.defenderRolls.length <= i) break;
         if (this.hexGrid.currentBattle.defenderStoppedRolls[i] == true) continue;
         if (x < this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4)) && x > this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4) + this.hexGrid.dieSize * 2)) {
            this.hexGrid.currentBattle.defenderStoppedRolls[i] = true;
            return;
         }

      }
   }

   endTurn = () => {

      if (this.hexGrid.currentBattle.defender != null) return;
      if (this.hexGrid.currentBattle.attacker != null) this.hexGrid.currentBattle.attacker = null;

      let playerGroups = this.hexGroupMap.getPlayerGroups(this.hexGrid.playerTurn);

      this.hexGrid.endTurnTransitionTime = playerGroups.length;
      this.hexGrid.endTurnTransitionTimer = 0;

      this.hexGrid.endTurnInterval = setInterval(() => {
         let playerGroups = this.hexGroupMap.getPlayerGroups(this.hexGrid.playerTurn);
         let selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

         if (playerGroups.filter(group => group[1].dice < 8).length == 0) {
            this.hexGrid.playerTurn++;
            if (this.hexGrid.playerTurn == this.hexGrid.numPlayers) this.hexGrid.playerTurn = 0;

            this.hexGrid.drawHexGrid();

            clearInterval(this.hexGrid.endTurnInterval)
            return;
         }
         while (selectedGroup[1].dice >= 8) selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

         selectedGroup[1].dice++;
         this.hexGroupMap.set(selectedGroup[0], selectedGroup[1]);

         this.hexGrid.endTurnTransitionTimer++;

         this.hexGrid.drawHexGrid();

         if (this.hexGrid.endTurnTransitionTimer >= this.hexGrid.endTurnTransitionTime) {
            this.hexGrid.playerTurn++;
            if (this.hexGrid.playerTurn == this.hexGrid.numPlayers) this.hexGrid.playerTurn = 0;

            this.hexGrid.endTurnTransitionTimer = null;
            this.hexGrid.endTurnTransitionTime = null;

            this.hexGrid.drawHexGrid();

            clearInterval(this.hexGrid.endTurnInterval)
         }

      }, 1000 / 5);


   }

   click = (x, y) => {

      let roundToNearestHex = (hex) => {
         let fracQ = hex.Q;
         let fracR = hex.R;
         let fracS = -1 * hex.Q - hex.R

         let Q = Math.round(fracQ);
         let R = Math.round(fracR);
         let S = Math.round(fracS);

         let diffQ = Math.abs(Q - fracQ);
         let diffR = Math.abs(R - fracR);
         let diffS = Math.abs(S - fracS);

         if (diffQ > diffR && diffQ > diffS) {
            Q = -1 * R - S
         } else if (diffR > diffS) {
            R = -1 * Q - S
         } else {
            S = -1 * Q - R
         }

         return {
            Q: Q,
            R: R
         }

      }

      let adjacentGroups = (group1, group2) => {
         let group1Tiles = this.hexGroupMap.getGroupTiles(group1);
         let group2Tiles = this.hexGroupMap.getGroupTiles(group2);

         for (let i = 0; i < group1Tiles.length; i++) {
            let neighbors = this.hexGrid.hexMap.neighborKeys(group1Tiles[i].Q, group1Tiles[i].R);

            for (let j = 0; j < neighbors.length; j++) {
               let neighbor = neighbors[j];

               for (let k = 0; k < group2Tiles.length; k++) {
                  if (neighbor.Q == group2Tiles[k].Q && neighbor.R == group2Tiles[k].R) return true;
               }
            }
         }
         return false;
      }

      let hexClicked = {
         Q: (Math.sqrt(3) / 3 * (x - this.hexGrid.X) - 1 / 3 * ((y - this.hexGrid.Y) * (1 / this.hexGrid.squish))) / this.hexGrid.size,
         R: (y - this.hexGrid.Y) * (1 / this.hexGrid.squish) * (2 / 3) / this.hexGrid.size
      }
      hexClicked = roundToNearestHex(hexClicked);

      if (this.hexGrid.endTurnTransitionTimer != null) return;

      //test end turn button clicked
      let buttonX = this.hexGrid.buttonWidth * 0.0625
      let buttonY = 60
      let buttonWidth = this.hexGrid.buttonWidth;
      let buttonHeight = this.hexGrid.buttonWidth / 3;
      if (x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight) {
         this.endTurn();
         return;
      }

      //test grid clicked
      if (this.hexGrid.currentBattle.attacker == null) {

         //test dice clicked
         for (let [key, value] of this.hexGroupMap.map()) {

            for (let j = 4; j < 8; j++) {
               if (value.dice > j) {
                  if (x > this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 1.35
                     && y > this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (1 + (j - 4) * 0.55)
                     && x < this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 1.35 + this.hexGrid.diceSize
                     && y < this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (1 + (j - 4) * 0.55) + this.hexGrid.diceSize) {
                     if (this.hexGroupMap.get(key).dice < 2 || this.hexGroupMap.get(key).playerNumber != this.hexGrid.playerTurn) return;
                     this.hexGrid.currentBattle.attacker = key;
                     this.hexGrid.drawHexGrid();
                     return;
                  }
               }
               else break;
            }
            for (let j = 0; j < 4; j++) {
               if (value.dice > j) {
                  if (x > this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 0.6
                     && y > this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (0.75 + j * 0.55)
                     && x < this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 0.6 + this.hexGrid.diceSize
                     && y < this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (0.75 + j * 0.55) + this.hexGrid.diceSize) {
                     if (this.hexGroupMap.get(key).dice < 2 || this.hexGroupMap.get(key).playerNumber != this.hexGrid.playerTurn) return;
                     this.hexGrid.currentBattle.attacker = key;
                     this.hexGrid.drawHexGrid();
                     return;
                  }
               }
            }
         }

         //test hex clicked
         if (!this.hexGrid.hexMap.has(hexClicked.Q, hexClicked.R) || this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).dice < 2 || this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber != this.hexGrid.playerTurn) return;

         this.hexGrid.currentBattle.attacker = this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group;

         this.hexGrid.drawHexGrid();
         return;
      }

      if (this.hexGrid.currentBattle.defender == null) {

         //test dice clicked
         for (let [key, value] of this.hexGroupMap.map()) {

            for (let j = 4; j < 8; j++) {
               if (value.dice > j) {
                  if (x > this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 1.35
                     && y > this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (1 + (j - 4) * 0.55)
                     && x < this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 1.35 + this.hexGrid.diceSize
                     && y < this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (1 + (j - 4) * 0.55) + this.hexGrid.diceSize) {

                     if (this.hexGrid.currentBattle.attacker == key) {
                        this.hexGrid.currentBattle.attacker = null;
                        this.hexGrid.drawHexGrid();
                        return;
                     }

                     if (adjacentGroups(this.hexGrid.currentBattle.attacker, key) && this.hexGroupMap.get(key).playerNumber != this.hexGrid.playerTurn) {
                        this.hexGrid.currentBattle.defender = key;
                        this.hexGrid.drawHexGrid();
                        this.startBattle();
                        return;
                     } else if (this.hexGroupMap.get(key).dice >= 2 && this.hexGroupMap.get(key).playerNumber == this.hexGrid.playerTurn) {
                        this.hexGrid.currentBattle.attacker = key;
                     }

                     this.hexGrid.drawHexGrid();
                     return;
                  }
               }
               else break;
            }
            for (let j = 0; j < 4; j++) {
               if (value.dice > j) {
                  if (x > this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 0.6
                     && y > this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (0.75 + j * 0.55)
                     && x < this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 0.6 + this.hexGrid.diceSize
                     && y < this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (0.75 + j * 0.55) + this.hexGrid.diceSize) {

                     if (this.hexGrid.currentBattle.attacker == key) {
                        this.hexGrid.currentBattle.attacker = null;
                        this.hexGrid.drawHexGrid();
                        return;
                     }

                     if (adjacentGroups(this.hexGrid.currentBattle.attacker, key) && this.hexGroupMap.get(key).playerNumber != this.hexGrid.playerTurn) {
                        this.hexGrid.currentBattle.defender = key;
                        this.hexGrid.drawHexGrid();
                        this.startBattle();
                        return;
                     } else if (this.hexGroupMap.get(key).dice >= 2 && this.hexGroupMap.get(key).playerNumber == this.hexGrid.playerTurn) {
                        this.hexGrid.currentBattle.attacker = key;
                     }

                     this.hexGrid.drawHexGrid();
                     return;
                  }
               }
            }
         }

         //test hex clicked
         if (!this.hexGrid.hexMap.has(hexClicked.Q, hexClicked.R)) return;

         if (this.hexGrid.currentBattle.attacker == this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group) {
            this.hexGrid.currentBattle.attacker = null;
            this.hexGrid.drawHexGrid();
            return;
         }

         if (adjacentGroups(this.hexGrid.currentBattle.attacker, this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group) && this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber != this.hexGrid.playerTurn) {
            this.hexGrid.currentBattle.defender = this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group;
            this.hexGrid.drawHexGrid();
            this.startBattle();
            return;
         } else if (this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).dice >= 2 && this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber == this.hexGrid.playerTurn) {
            this.hexGrid.currentBattle.attacker = this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group;
         }


         this.hexGrid.drawHexGrid();
         return;
      }

   }

}