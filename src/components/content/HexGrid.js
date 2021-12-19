import HexagonClass from './Hexagon.js'
import HexmapClass from './Hexmap.js';
import HexgridBuilderClass from './HexmapBuilder.js';
import HexGroup from './HexGroup.js';

import diceSheet from './diceSheet.png';

export default class hexGridClass {

   constructor(ctx, ctx2, canvasScalarSize, canvasW, canvasH, canvas2W, canvas2H, mapSize, numPlayers, mapGeneration) {

      this.ctx = ctx
      this.ctx2 = ctx2
      this.canvasDims = {
         width: canvasW,
         height: canvasH
      }
      this.canvas2Dims = {
         width: canvas2W,
         height: canvas2H
      }
      this.size = (mapSize == "small" ? canvasScalarSize * 9 : mapSize == "medium" ? canvasScalarSize * 7 : canvasScalarSize * 5)
      this.dieSize = this.canvasDims.width / 30;
      this.squish = 0.75;
      this.numGroups = (mapSize == "small" ? 10 : mapSize == "medium" ? 20 : 30)
      this.numPlayers = numPlayers
      this.mapGeneration = mapGeneration
      this.mapPos = 0.9;
      this.Q = Math.floor((canvasW / (Math.sqrt(3) * this.size)) - 1);
      this.R = Math.floor((canvasH / (2.7 / 2 * this.size)) - 1);
      this.X = (canvasW - (this.Q * Math.sqrt(3) * this.size) - Math.sqrt(3) * this.size / (mapSize == "small" ? 1.5 : mapSize == "medium" ? 2 : 4));
      this.Y = (canvasH - (this.R * (3 / 2.2) * this.size * this.squish / this.mapPos));
      this.VecQ = { x: Math.sqrt(3) * this.size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * this.size, y: 3 / 2 * this.size }

      this.diceSize = this.size * 1.5
      this.imageSize = 0;

      this.hexMap = new HexmapClass();
      this.HexagonClass = new HexagonClass(ctx, this.size, this.squish);
      this.hexMapBuilder = new HexgridBuilderClass(this.hexMap, mapSize);
      this.groupMap = new Map();

      this.colorMap = ['#dc143c', '#6495ed', '#90ee90', '#9370db', '#ff7f50', '#da70d6', '#40e0d0', '#fff44f', '#228b22', '#2A52BE']

      this.loaded = false;
      this.diceSheet = new Image();
      this.testImage = new Image();

      this.playerTurn = Math.floor(Math.random() * this.numPlayers);
      this.currentBattle = {
         attacker: null,
         defender: null,
         attackerRolls: [],
         defenderRolls: [],
         attackerStoppedRolls: [],
         defenderStoppedRolls: [],
         interval: null
      }
      this.RollBuffer = this.diceSize / 2;

      this.buttonWidth = this.canvasDims.width / 5.625;

      this.battleTransitionTime = 2;
      this.battleTransitionTimer = null;
      this.battleTransition = false;
   }

   endBattle = () => {

      clearInterval(this.currentBattle.interval)

      let attackerRollTotal = 0;
      for (let i = 0; i < this.currentBattle.attackerRolls.length; i++) {
         if (this.currentBattle.attackerStoppedRolls[i] == false) continue;
         attackerRollTotal += this.currentBattle.attackerRolls[i] + 1;
      }

      //defender roll total
      let defenderRollTotal = 0;
      for (let i = 0; i < this.currentBattle.defenderRolls.length; i++) {
         if (this.currentBattle.defenderStoppedRolls[i] == false) continue;
         defenderRollTotal += this.currentBattle.defenderRolls[i] + 1;
      }

      //result
      if (attackerRollTotal > defenderRollTotal) {
         this.groupMap.get(this.currentBattle.defender).playerNumber = this.groupMap.get(this.currentBattle.attacker).playerNumber;
         this.groupMap.get(this.currentBattle.defender).dice = this.groupMap.get(this.currentBattle.attacker).dice - 1;
         this.groupMap.get(this.currentBattle.attacker).dice = 1;
      } else {
         this.groupMap.get(this.currentBattle.attacker).dice = 1;
      }

      this.currentBattle = {
         attacker: null,
         defender: null,
         attackerRolls: [],
         defenderRolls: [],
         attackerStoppedRolls: [],
         defenderStoppedRolls: [],
         interval: null
      }

      this.drawHexGrid();
   }

   startBattle = () => {

      clearInterval(this.currentBattle.interval)
      this.currentBattle.attackerRolls = [];
      this.currentBattle.defenderRolls = [];
      this.currentBattle.attackerStoppedRolls = [];
      this.currentBattle.defenderStoppedRolls = [];

      let attackerGroup = this.groupMap.get(this.currentBattle.attacker);
      let defenderGroup = this.groupMap.get(this.currentBattle.defender);

      for (let i = 0; i < attackerGroup.dice; i++) {
         this.currentBattle.attackerRolls[i] = Math.floor(Math.random() * 6);
         this.currentBattle.attackerStoppedRolls[i] = false;
      }
      for (let i = 0; i < defenderGroup.dice; i++) {
         this.currentBattle.defenderRolls[i] = Math.floor(Math.random() * 6);
         this.currentBattle.defenderStoppedRolls[i] = false;
      }

      this.currentBattle.interval = setInterval(() => {

         this.ctx2.clearRect(0, 0, this.canvas2Dims.width, this.canvas2Dims.height);

         //check if battle is done
         let battleDone = true;
         for (let i = 0; i < this.currentBattle.attackerRolls.length; i++) {
            if (this.currentBattle.attackerStoppedRolls[i] == false) {
               battleDone = false;
               break;
            }
         }
         for (let i = 0; i < this.currentBattle.defenderRolls.length; i++) {
            if (this.currentBattle.defenderStoppedRolls[i] == false) {
               battleDone = false;
               break;
            }
         }

         if (battleDone) {
            this.endBattle();
            return;
         }

         //attacker roll total
         let attackerRollTotal = 0;
         for (let i = 0; i < this.currentBattle.attackerRolls.length; i++) {
            if (this.currentBattle.attackerStoppedRolls[i] == false) continue;
            attackerRollTotal += this.currentBattle.attackerRolls[i] + 1;
         }
         this.ctx2.fillText(attackerRollTotal, this.canvas2Dims.width / 2 - 50, this.canvas2Dims.height / 2)

         //defender roll total
         let defenderRollTotal = 0;
         for (let i = 0; i < this.currentBattle.defenderRolls.length; i++) {
            if (this.currentBattle.defenderStoppedRolls[i] == false) continue;
            defenderRollTotal += this.currentBattle.defenderRolls[i] + 1;
         }
         this.ctx2.fillText(defenderRollTotal, this.canvas2Dims.width / 2 + 50, this.canvas2Dims.height / 2)

         //roll attacker dice
         for (let i = 0; i < 4; i++) {

            if (this.currentBattle.attackerRolls.length <= i) break;

            if (this.currentBattle.attackerStoppedRolls[i] == false) {
               let newRoll = Math.floor(Math.random() * 6)

               while (newRoll == this.currentBattle.attackerRolls[i]) {
                  newRoll = Math.floor(Math.random() * 6)
               }

               this.currentBattle.attackerRolls[i] = newRoll;
            }

            this.ctx2.drawImage(this.diceSheet, this.currentBattle.attackerRolls[i] * this.imageSize, (this.groupMap.get(this.currentBattle.attacker).playerNumber+1) * this.imageSize, this.imageSize, this.imageSize, this.RollBuffer + (this.diceSize * 2 + this.RollBuffer) * i, this.RollBuffer, this.dieSize * 2, this.dieSize * 2)
         }
         for (let i = 4; i < 8; i++) {

            if (this.currentBattle.attackerRolls.length <= i) break;

            if (this.currentBattle.attackerStoppedRolls[i] == false) {
               let newRoll = Math.floor(Math.random() * 6)

               while (newRoll == this.currentBattle.attackerRolls[i]) {
                  newRoll = Math.floor(Math.random() * 6)
               }

               this.currentBattle.attackerRolls[i] = newRoll;
            }

            this.ctx2.drawImage(this.diceSheet, this.currentBattle.attackerRolls[i] * this.imageSize, (this.groupMap.get(this.currentBattle.attacker).playerNumber+1) * this.imageSize, this.imageSize, this.imageSize, this.RollBuffer + (this.diceSize * 2 + this.RollBuffer) * (i - 4), this.RollBuffer * 2 + this.dieSize * 2, this.dieSize * 2, this.dieSize * 2)
         }


         //roll defender dice
         for (let i = 0; i < 4; i++) {

            if (this.currentBattle.defenderRolls.length <= i) break;

            if (this.currentBattle.defenderStoppedRolls[i] == false) {
               let newRoll = Math.floor(Math.random() * 6)

               while (newRoll == this.currentBattle.defenderRolls[i]) {
                  newRoll = Math.floor(Math.random() * 6)
               }

               this.currentBattle.defenderRolls[i] = newRoll;
            }

            this.ctx2.drawImage(this.diceSheet, this.currentBattle.defenderRolls[i] * this.imageSize, (this.groupMap.get(this.currentBattle.defender).playerNumber+1) * this.imageSize, this.imageSize, this.imageSize, this.canvas2Dims.width - (this.RollBuffer + (this.diceSize * 2 + this.RollBuffer) * i) - this.dieSize * 2, this.RollBuffer, this.dieSize * 2, this.dieSize * 2)
         }
         for (let i = 4; i < 8; i++) {

            if (this.currentBattle.defenderRolls.length <= i) break;

            if (this.currentBattle.defenderStoppedRolls[i] == false) {
               let newRoll = Math.floor(Math.random() * 6)

               while (newRoll == this.currentBattle.defenderRolls[i]) {
                  newRoll = Math.floor(Math.random() * 6)
               }

               this.currentBattle.defenderRolls[i] = newRoll;
            }

            this.ctx2.drawImage(this.diceSheet, this.currentBattle.defenderRolls[i] * this.imageSize, (this.groupMap.get(this.currentBattle.defender).playerNumber+1) * this.imageSize, this.imageSize, this.imageSize, this.canvas2Dims.width - (this.RollBuffer + (this.diceSize * 2 + this.RollBuffer) * (i - 4)) - this.dieSize * 2, this.RollBuffer * 2 + this.dieSize * 2, this.dieSize * 2, this.dieSize * 2)
         }

         //draw stop all buttons
         this.drawButton(this.ctx2, 'Stop All', 'lightGrey', this.RollBuffer, this.RollBuffer * 3 + this.dieSize * 4, this.buttonWidth, this.buttonWidth/3)
         this.drawButton(this.ctx2, 'Stop All', 'lightGrey', this.canvas2Dims.width - this.RollBuffer - this.buttonWidth, this.RollBuffer * 3 + this.dieSize * 4, this.buttonWidth, this.buttonWidth/3)

      }, 1000 / 10)

   }

   click2 = (x, y) => {

      //check attacker stop all button
      if(x > this.RollBuffer && y > this.RollBuffer * 3 + this.dieSize * 4 && x < this.RollBuffer + this.buttonWidth && y < this.RollBuffer * 3 + this.dieSize * 4 + this.buttonWidth/3){
         for(let i=0; i<this.currentBattle.attackerStoppedRolls.length; i++) this.currentBattle.attackerStoppedRolls[i] = true;
      }

      //check defender stop all button
      if(x > this.canvas2Dims.width - this.RollBuffer - this.buttonWidth && y > this.RollBuffer * 3 + this.dieSize * 4 && x < this.canvas2Dims.width - this.RollBuffer - this.buttonWidth + this.buttonWidth && y < this.RollBuffer * 3 + this.dieSize * 4 + this.buttonWidth/3){
         for(let i=0; i<this.currentBattle.defenderStoppedRolls.length; i++) this.currentBattle.defenderStoppedRolls[i] = true;
      }

      //check attacker dice
      for (let i = 0; i < 4; i++) {

         if (y < this.RollBuffer || y > this.RollBuffer + this.dieSize * 2 || this.currentBattle.attackerRolls.length <= i) break;
         if (this.currentBattle.attackerStoppedRolls[i] == true) continue;
         if (x > this.RollBuffer + (this.diceSize * 2 + this.RollBuffer) * i && x < this.RollBuffer + (this.diceSize * 2 + this.RollBuffer) * i + this.dieSize * 2) {
            this.currentBattle.attackerStoppedRolls[i] = true;
            return;
         }

      }
      for (let i = 4; i < 8; i++) {
         if (y < this.RollBuffer * 2 + this.dieSize * 2 || y > this.RollBuffer * 2 + this.dieSize * 2 + this.dieSize * 2 || this.currentBattle.attackerRolls.length <= i) break;
         if (this.currentBattle.attackerStoppedRolls[i] == true) continue;
         if (x > this.RollBuffer + (this.diceSize * 2 + this.RollBuffer) * (i - 4) && x < this.RollBuffer + (this.diceSize * 2 + this.RollBuffer) * (i - 4) + this.dieSize * 2) {
            this.currentBattle.attackerStoppedRolls[i] = true;
            return;
         }

      }

      //check defender dice
      for (let i = 0; i < 4; i++) {

         if (y < this.RollBuffer || y > this.RollBuffer + this.dieSize * 2 || this.currentBattle.defenderRolls.length <= i) break;
         if (this.currentBattle.defenderStoppedRolls[i] == true) continue;
         if (x < this.canvas2Dims.width - (this.RollBuffer + (this.diceSize * 2 + this.RollBuffer) * i) && x > this.canvas2Dims.width - (this.RollBuffer + (this.diceSize * 2 + this.RollBuffer) * i + this.dieSize * 2)) {
            this.currentBattle.defenderStoppedRolls[i] = true;
            return;
         }

      }
      for (let i = 4; i < 8; i++) {

         if (y < this.RollBuffer * 2 + this.dieSize * 2 || y > this.RollBuffer * 2 + this.dieSize * 2 + this.dieSize * 2 || this.currentBattle.defenderRolls.length <= i) break;
         if (this.currentBattle.defenderStoppedRolls[i] == true) continue;
         if (x < this.canvas2Dims.width - (this.RollBuffer + (this.diceSize * 2 + this.RollBuffer) * (i - 4)) && x > this.canvas2Dims.width - (this.RollBuffer + (this.diceSize * 2 + this.RollBuffer) * (i - 4) + this.dieSize * 2)) {
            this.currentBattle.defenderStoppedRolls[i] = true;
            return;
         }

      }
   }

   endTurn = () => {

      if(this.currentBattle.defender != null) return;
      if(this.currentBattle.attacker != null) this.currentBattle.attacker = null;

      let playerGroups = [...this.groupMap.entries()].filter(group => group[1].playerNumber == this.playerTurn);

      let numDice = playerGroups.length;

      for (let j = 0; j < numDice; j++) {
         let selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

         if (playerGroups.filter(group => group[1].dice < 8).length == 0) break;
         while (selectedGroup[1].dice >= 8) selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

         selectedGroup[1].dice++;
         this.groupMap.set(selectedGroup[0], selectedGroup[1]);
      }

      this.playerTurn++;
      if (this.playerTurn == this.numPlayers) this.playerTurn = 0;
      
      this.drawHexGrid();
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
         let group1Tiles = this.hexMap.getGroupTiles(group1);
         let group2Tiles = this.hexMap.getGroupTiles(group2);

         for (let i = 0; i < group1Tiles.length; i++) {
            let neighbors = this.hexMap.neighborKeys(group1Tiles[i].Q, group1Tiles[i].R);

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
         Q: (Math.sqrt(3) / 3 * (x - this.X) - 1 / 3 * ((y - this.Y) * (1 / this.squish))) / this.size,
         R: (y - this.Y) * (1 / this.squish) * (2 / 3) / this.size
      }
      hexClicked = roundToNearestHex(hexClicked);


      //test end turn button clicked
      let buttonX = this.buttonWidth * 0.0625
      let buttonY = 60
      let buttonWidth = this.buttonWidth;
      let buttonHeight = this.buttonWidth / 3;
      if (x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight) {
         this.endTurn();
         return;
      }

      //test grid clicked
      if (this.currentBattle.attacker == null) {

         //test dice clicked
         for (let [key, value] of this.groupMap) {

            for (let j = 4; j < 8; j++) {
               if (value.dice > j) {
                  if (x > this.X + value.drawPos.X - this.diceSize * 1.35
                     && y > this.Y + value.drawPos.Y * this.squish - this.diceSize * (1 + (j - 4) * 0.55)
                     && x < this.X + value.drawPos.X - this.diceSize * 1.35 + this.diceSize
                     && y < this.Y + value.drawPos.Y * this.squish - this.diceSize * (1 + (j - 4) * 0.55) + this.diceSize) {
                     if (this.groupMap.get(key).dice < 2 || this.groupMap.get(key).playerNumber != this.playerTurn) return;
                     this.currentBattle.attacker = key;
                     this.drawHexGrid();
                     return;
                  }
               }
               else break;
            }
            for (let j = 0; j < 4; j++) {
               if (value.dice > j) {
                  if (x > this.X + value.drawPos.X - this.diceSize * 0.6
                     && y > this.Y + value.drawPos.Y * this.squish - this.diceSize * (0.75 + j * 0.55)
                     && x < this.X + value.drawPos.X - this.diceSize * 0.6 + this.diceSize
                     && y < this.Y + value.drawPos.Y * this.squish - this.diceSize * (0.75 + j * 0.55) + this.diceSize) {
                     if (this.groupMap.get(key).dice < 2 || this.groupMap.get(key).playerNumber != this.playerTurn) return;
                     this.currentBattle.attacker = key;
                     this.drawHexGrid();
                     return;
                  }
               }
            }
         }

         //test hex clicked
         if (!this.hexMap.has(hexClicked.Q, hexClicked.R) || this.groupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).dice < 2 || this.groupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber != this.playerTurn) return;

         this.currentBattle.attacker = this.hexMap.get(hexClicked.Q, hexClicked.R).group;

         this.drawHexGrid();
         return;
      }

      if (this.currentBattle.defender == null) {

         //test dice clicked
         for (let [key, value] of this.groupMap) {

            for (let j = 4; j < 8; j++) {
               if (value.dice > j) {
                  if (x > this.X + value.drawPos.X - this.diceSize * 1.35
                     && y > this.Y + value.drawPos.Y * this.squish - this.diceSize * (1 + (j - 4) * 0.55)
                     && x < this.X + value.drawPos.X - this.diceSize * 1.35 + this.diceSize
                     && y < this.Y + value.drawPos.Y * this.squish - this.diceSize * (1 + (j - 4) * 0.55) + this.diceSize) {

                     if (this.currentBattle.attacker == key) {
                        this.currentBattle.attacker = null;
                        this.drawHexGrid();
                        return;
                     }

                     if (adjacentGroups(this.currentBattle.attacker, key) && this.groupMap.get(key).playerNumber != this.playerTurn) {
                        this.currentBattle.defender = key;
                        this.drawHexGrid();
                        this.startBattle();
                        return;
                     } else if (this.groupMap.get(key).dice >= 2 && this.groupMap.get(key).playerNumber == this.playerTurn) {
                        this.currentBattle.attacker = key;
                     }

                     this.drawHexGrid();
                     return;
                  }
               }
               else break;
            }
            for (let j = 0; j < 4; j++) {
               if (value.dice > j) {
                  if (x > this.X + value.drawPos.X - this.diceSize * 0.6
                     && y > this.Y + value.drawPos.Y * this.squish - this.diceSize * (0.75 + j * 0.55)
                     && x < this.X + value.drawPos.X - this.diceSize * 0.6 + this.diceSize
                     && y < this.Y + value.drawPos.Y * this.squish - this.diceSize * (0.75 + j * 0.55) + this.diceSize) {

                     if (this.currentBattle.attacker == key) {
                        this.currentBattle.attacker = null;
                        this.drawHexGrid();
                        return;
                     }

                     if (adjacentGroups(this.currentBattle.attacker, key) && this.groupMap.get(key).playerNumber != this.playerTurn) {
                        this.currentBattle.defender = key;
                        this.drawHexGrid();
                        this.startBattle();
                        return;
                     } else if (this.groupMap.get(key).dice >= 2 && this.groupMap.get(key).playerNumber == this.playerTurn) {
                        this.currentBattle.attacker = key;
                     }

                     this.drawHexGrid();
                     return;
                  }
               }
            }
         }

         //test hex clicked
         if (!this.hexMap.has(hexClicked.Q, hexClicked.R)) return;

         if (this.currentBattle.attacker == this.hexMap.get(hexClicked.Q, hexClicked.R).group) {
            this.currentBattle.attacker = null;
            this.drawHexGrid();
            return;
         }

         if (adjacentGroups(this.currentBattle.attacker, this.hexMap.get(hexClicked.Q, hexClicked.R).group) && this.groupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber != this.playerTurn) {
            this.currentBattle.defender = this.hexMap.get(hexClicked.Q, hexClicked.R).group;
            this.drawHexGrid();
            this.startBattle();
            return;
         } else if (this.groupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).dice >= 2 && this.groupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber == this.playerTurn) {
            this.currentBattle.attacker = this.hexMap.get(hexClicked.Q, hexClicked.R).group;
         }


         this.drawHexGrid();
         return;
      }

   }

   closestTile = (pos, posList) => {
      let distances = [];
      for (let i = 0; i < posList.length; i++) {
         distances[i] = Math.sqrt(Math.pow(pos.X - posList[i].X, 2) + Math.pow(pos.Y - posList[i].Y, 2));
      }

      let shortest = Math.min(...distances);

      let index = distances.indexOf(shortest);


      return posList[index];

   }

   assignDice = () => {
      for (let i = 0; i < this.numPlayers; i++) {
         let numDice = this.numGroups / this.numPlayers * 3;
         //let playerGroups = this.groupMap.filter(group => group.playerNumber == i);
         let playerGroups = [...this.groupMap.entries()].filter(group => group[1].playerNumber == i);

         numDice -= playerGroups.length;

         for (let j = 0; j < numDice; j++) {
            let selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

            if (playerGroups.filter(group => group[1].dice < 8).length == 0) break;
            while (selectedGroup[1].dice >= 8) selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

            selectedGroup[1].dice++;
            this.groupMap.set(selectedGroup[0], selectedGroup[1]);
         }

      }
   }

   getTakenGroupPositions = () => {

      let positions = [];

      for (let [key, value] of this.groupMap) {
         let groupHexPos = value.drawHexPos;

         positions.push(this.hexMap.join(groupHexPos.Q, groupHexPos.R));

         positions.push(this.hexMap.join(groupHexPos.Q, groupHexPos.R - 1));
         positions.push(this.hexMap.join(groupHexPos.Q + 1, groupHexPos.R - 1));
         positions.push(this.hexMap.join(groupHexPos.Q + 1, groupHexPos.R));
         positions.push(this.hexMap.join(groupHexPos.Q, groupHexPos.R + 1));
         positions.push(this.hexMap.join(groupHexPos.Q - 1, groupHexPos.R + 1));
         positions.push(this.hexMap.join(groupHexPos.Q - 1, groupHexPos.R));

         positions.push(this.hexMap.join(groupHexPos.Q + 1, groupHexPos.R - 2));
         positions.push(this.hexMap.join(groupHexPos.Q - 1, groupHexPos.R + 2));

      }

      return positions;
   }

   assignGroups = () => {
      for (let i = 0; i < this.numGroups; i++) {

         let takenPositions = this.getTakenGroupPositions();

         let tiles = this.hexMap.getGroupCenterTiles(i, takenPositions);

         let tilePositions = [];
         let tileHexPositions = [];
         let averagePos = {
            X: 0,
            Y: 0
         }

         for (let j = 0; j < tiles.length; j++) {
            let tilePos = {
               X: this.VecQ.x * tiles[j].Q + this.VecR.x * tiles[j].R,
               Y: this.VecQ.y * tiles[j].Q + this.VecR.y * tiles[j].R
            }
            let tileHexPos = {
               Q: tiles[j].Q,
               R: tiles[j].R
            }
            tilePositions[j] = tilePos;
            tileHexPositions[j] = tileHexPos;
            averagePos.X += tilePos.X;
            averagePos.Y += tilePos.Y;
         }

         averagePos.X /= tilePositions.length;
         averagePos.Y /= tilePositions.length;

         let groupDrawPos = this.closestTile(averagePos, tilePositions);
         let groupDrawHexPos = tileHexPositions[tilePositions.indexOf(groupDrawPos)];
         this.groupMap.set(i, new HexGroup(i % this.numPlayers, groupDrawPos, groupDrawHexPos));

      }
      //this.groupMap.sort((a, b) => a.drawPos.Y - b.drawPos.Y);
      this.groupMap = new Map([...this.groupMap.entries()].sort((a, b) => a[1].drawPos.Y - b[1].drawPos.Y));
      console.log(this.groupMap)

   }

   createHexMap = () => {

      let groupsCreated = -1;

      if (this.mapGeneration == "noise") {
         while (groupsCreated == -1) {
            this.hexMapBuilder.generateMap(this.Q, this.R);
            this.hexMapBuilder.removeNoiseTiles();
            this.hexMapBuilder.deleteIslands();
            groupsCreated = this.hexMapBuilder.createGroups(this.numGroups);
         }
      } else if (this.mapGeneration == "algorithmic") {
         while (groupsCreated == -1) {
            this.hexMapBuilder.generateMap(this.Q, this.R);
            this.hexMapBuilder.removeOuterTiles();
            this.hexMapBuilder.removeInnerTiles();
            this.hexMapBuilder.deleteIslands();
            groupsCreated = this.hexMapBuilder.createGroups(this.numGroups);
         }
      } else {
         while (groupsCreated == -1) {
            this.hexMapBuilder.generateMap(this.Q, this.R);
            groupsCreated = this.hexMapBuilder.createGroups(this.numGroups);
         }
      }

      this.assignGroups();
      this.assignDice();

      this.drawLoading();

      // this.testImage.onload = () => {
      //    this.loaded = true;
      //    this.drawHexGrid();
      // }

      // this.testImage.src = testImage;

      this.diceSheet.onload = () => {
         this.loaded = true;
         this.imageSize = this.diceSheet.width / 6;
         this.drawHexGrid();
      }

      this.diceSheet.src = diceSheet;

   }

   drawLoading = () => {
      this.ctx.clearRect(0, 0, this.canvasDims.width, this.canvasDims.height);
      this.ctx.font = "30px Arial";
      this.ctx.fillText("Loading...", 10, 50);
   }

   drawHexagons = () => {
      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q * this.squish + this.VecR.y * keyObj.R * this.squish;

         //Use hash map instead of array to avoid this problem
         //let group = this.groupMap.find(group => group.index==value.group)
         let group = this.groupMap.get(value.group);

         let selection = null;
         if (value.group == this.currentBattle.attacker) selection = 'attacker'
         if (value.group == this.currentBattle.defender) selection = 'defender'

         this.HexagonClass.drawHexagon(this.X + xOffset, this.Y + yOffset, this.colorMap[group.playerNumber], selection);
      }
   }

   drawGroupEdges = () => {
      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q * this.squish + this.VecR.y * keyObj.R * this.squish;

         let edges = [];
         if (value.group != null) edges = this.hexMap.getGroupEdges(keyObj.Q, keyObj.R);



         this.HexagonClass.drawEdges(this.X + xOffset, this.Y + yOffset, edges, Math.floor(this.size / 5.5), "pixel")
      }

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q * this.squish + this.VecR.y * keyObj.R * this.squish;

         let edges = [];
         if (value.group != null) edges = this.hexMap.getGroupEdges(keyObj.Q, keyObj.R);

         if (value.group == this.currentBattle.defender) this.HexagonClass.drawEdges(this.X + xOffset, this.Y + yOffset, edges, Math.floor(this.size / 5.5), "pixel", "defender")

      }

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q * this.squish + this.VecR.y * keyObj.R * this.squish;

         let edges = [];
         if (value.group != null) edges = this.hexMap.getGroupEdges(keyObj.Q, keyObj.R);

         if (value.group == this.currentBattle.attacker) this.HexagonClass.drawEdges(this.X + xOffset, this.Y + yOffset, edges, Math.floor(this.size / 5.5), "pixel", "attacker")

      }

   }

   drawDie = (x, y, number, colorIndex) => {
      let sheetHasImage = (this.imageSize * (colorIndex + 1) < this.diceSheet.height)
      this.ctx.drawImage(this.diceSheet, this.imageSize * (number - 1), sheetHasImage ? this.imageSize * (colorIndex + 1) : 0, this.imageSize, this.imageSize, x - this.dieSize * 0.5, y - this.dieSize * 0.5, this.dieSize, this.dieSize);
   }

   drawDice = () => {
      for (let [key, value] of this.groupMap) {

         let sheetHasImage = (this.imageSize * (value.playerNumber + 1) < this.diceSheet.height)

         this.ctx.fillStyle = 'rgba(25,25,25,0.8)';
         this.ctx.beginPath();
         this.ctx.ellipse(this.X + value.drawPos.X + this.diceSize * 0.25, this.Y + value.drawPos.Y * this.squish + this.diceSize / 8, this.diceSize / 2, this.diceSize / 4, Math.PI, Math.PI / 2, Math.PI * 2);
         this.ctx.fill();

         for (let j = 4; j < 8; j++) {
            if (value.dice > j) this.ctx.drawImage(this.diceSheet, this.imageSize * value.diceOrientations[j], sheetHasImage ? this.imageSize * (value.playerNumber + 1) : 0, this.imageSize, this.imageSize, this.X + value.drawPos.X - this.diceSize * 1.35, this.Y + value.drawPos.Y * this.squish - this.diceSize * (1 + (j - 4) * 0.55), this.diceSize, this.diceSize);
            //if(value.dice > j) this.ctx.drawImage(this.testImage, this.X + value.drawPos.X - this.diceSize * 1.35, this.Y + value.drawPos.Y * this.squish - this.diceSize * (1 + (j-4)*0.55), this.diceSize, this.diceSize);
            else break;
         }

         for (let j = 0; j < 4; j++) {
            if (value.dice > j) this.ctx.drawImage(this.diceSheet, this.imageSize * value.diceOrientations[j], sheetHasImage ? this.imageSize * (value.playerNumber + 1) : 0, this.imageSize, this.imageSize, this.X + value.drawPos.X - this.diceSize * 0.6, this.Y + value.drawPos.Y * this.squish - this.diceSize * (0.75 + j * 0.55), this.diceSize, this.diceSize);
            //if(value.dice > j) this.ctx.drawImage(this.testImage, this.X + value.drawPos.X - this.diceSize * 0.6, this.Y + value.drawPos.Y * this.squish - this.diceSize * (0.75 + j*0.55), this.diceSize, this.diceSize);
         }
      }
   }

   drawPixelEdge = (ctx, x1, y1, x2, y2, playerTurn) => {

      let testPixelSize = Math.floor(this.canvasDims.width / 250);

      let testVec = {
         x: (x2) - (x1),
         y: (y2) - (y1)
      }
      let testLen = Math.sqrt(testVec.x * testVec.x + testVec.y * testVec.y);

      for (let i = 0; i < testLen; i += testPixelSize) {
         ctx.fillStyle = 'rgba(25,25,25,1.0)';
         if (playerTurn) ctx.fillStyle = 'rgb(255, 215, 0, 1.0)';
         ctx.fillRect(x1 + testVec.x * (i / testLen) - testPixelSize / 2, y1 + testVec.y * (i / testLen) - testPixelSize / 2, testPixelSize, testPixelSize);

         ctx.fillStyle = 'rgba(25,25,25,0.5)';
         if (playerTurn) ctx.fillStyle = 'rgb(255, 215, 0, 0.5)';
         ctx.fillRect(x1 + testVec.x * (i / testLen) - testPixelSize * 1.5 / 2, y1 + testVec.y * (i / testLen) - testPixelSize * 1.5 / 2, testPixelSize * 1.5, testPixelSize * 1.5);
      }
   }

   drawButton = (ctx, text, color, x, y, width, height) => {
      ctx.fillStyle = color
      let radius = 4;

      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();


      this.drawPixelEdge(ctx, x, y + radius, x, y + height - radius)
      this.drawPixelEdge(ctx, x, y + height - radius, x + radius, y + height)
      this.drawPixelEdge(ctx, x + radius, y + height, x + width - radius, y + height)
      this.drawPixelEdge(ctx, x + width - radius, y + height, x + width, y + height - radius)
      this.drawPixelEdge(ctx, x + width, y + height - radius, x + width, y + radius)
      this.drawPixelEdge(ctx, x + width, y + radius, x + width - radius, y)
      this.drawPixelEdge(ctx, x + width - radius, y, x + radius, y)
      this.drawPixelEdge(ctx, x + radius, y, x, y + radius)

      ctx.fillStyle = 'black'
      ctx.fillText(text, x + width / 2, y + height / 2)
   }

   drawEndTurnButton = () => {

      let x = this.buttonWidth * 0.0625
      let y = 60
      let width = this.buttonWidth;
      let height = this.buttonWidth / 3;
      let color = 'lightGrey'
      if(this.currentBattle.defender != null) color = 'grey'

      this.drawButton(this.ctx, "End Turn", color, x, y, width, height);
   }

   drawScoreboard = () => {

      let getPlayerScore = (playerNumber) => {
         return [...this.groupMap.entries()].filter(group => group[1].playerNumber == playerNumber).length;
      }

      let drawScore = (x, y, width, height, radius, colorIndex, score, playerTurn) => {



         this.ctx.fillStyle = this.colorMap[colorIndex];
         if (playerTurn) this.ctx.fillStyle = 'snow';

         this.ctx.beginPath();
         this.ctx.moveTo(x + radius, y);
         this.ctx.lineTo(x + width - radius, y);
         this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
         this.ctx.lineTo(x + width, y + height - radius);
         this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
         this.ctx.lineTo(x + radius, y + height);
         this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
         this.ctx.lineTo(x, y + radius);
         this.ctx.quadraticCurveTo(x, y, x + radius, y);
         this.ctx.closePath();
         this.ctx.fill();


         this.drawPixelEdge(this.ctx, x, y + radius, x, y + height - radius, playerTurn)
         this.drawPixelEdge(this.ctx, x, y + height - radius, x + radius, y + height, playerTurn)
         this.drawPixelEdge(this.ctx, x + radius, y + height, x + width - radius, y + height, playerTurn)
         this.drawPixelEdge(this.ctx, x + width - radius, y + height, x + width, y + height - radius, playerTurn)
         this.drawPixelEdge(this.ctx, x + width, y + height - radius, x + width, y + radius, playerTurn)
         this.drawPixelEdge(this.ctx, x + width, y + radius, x + width - radius, y, playerTurn)
         this.drawPixelEdge(this.ctx, x + width - radius, y, x + radius, y, playerTurn)
         this.drawPixelEdge(this.ctx, x + radius, y, x, y + radius, playerTurn)

         this.drawDie(x + (width / 4) * 1.15, y + height / 2, 6, colorIndex)
         this.ctx.font = `${this.canvasDims.width * 0.03}px Arial`;
         this.ctx.textAlign = 'center';
         this.ctx.textBaseline = 'middle'
         this.ctx.fillStyle = 'black'
         if (score) this.ctx.fillText(score, x + (width / 4) * 2.85, y + height / 2)

      }

      let scoreWidth = this.canvasDims.width / 11.25;

      for (let i = 0; i < this.numPlayers; i++) {
         drawScore(scoreWidth * 0.0625 + scoreWidth * i * 1.125, 10, scoreWidth, scoreWidth / 2, 4, i, getPlayerScore(i), this.playerTurn == i)
      }

   }

   drawHexGrid = () => {


      this.ctx.clearRect(0, 0, this.canvasDims.width, this.canvasDims.height);
      this.ctx2.clearRect(0, 0, this.canvas2Dims.width, this.canvas2Dims.height);
      clearInterval(this.currentBattle.interval)

      this.drawHexagons();

      this.drawGroupEdges();

      this.drawDice();

      this.drawScoreboard();

      this.drawEndTurnButton();

   }

}