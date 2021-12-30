export default class DiceMapClass {

   constructor(ctx, ctx2, canvas, canvas2, hexMap, hexGroupMap, uiManager, stateManager, colorMap, diceSize, numPlayers) {
      this.ctx = ctx;
      this.ctx2 = ctx2;
      this.canvas = canvas;
      this.canvas2 = canvas2;
      this.hexMap = hexMap;
      this.hexGroupMap = hexGroupMap;
      this.uiManager = uiManager;
      this.stateManager = stateManager;
      this.colorMap = colorMap;
      this.diceSize = diceSize;
      this.battleDiceSize = canvas.width / 200 * 5 * 1.5;
      this.numPlayers = numPlayers;
      this.rollBuffer = this.battleDiceSize / 2;

      this.diceSheet = null;
      this.imageSize = null;
   }

   click = (x, y) => {
      for (let [key, value] of this.hexGroupMap.getMap()) {

         for (let j = 4; j < 8; j++) {
            if (value.dice > j) {
               if (x > this.hexMap.X + value.drawPos.X - this.diceSize * 1.35
                  && y > this.hexMap.Y + value.drawPos.Y * this.hexMap.squish - this.diceSize * (1 + (j - 4) * 0.55)
                  && x < this.hexMap.X + value.drawPos.X - this.diceSize * 1.35 + this.diceSize
                  && y < this.hexMap.Y + value.drawPos.Y * this.hexMap.squish - this.diceSize * (1 + (j - 4) * 0.55) + this.diceSize) {
                  return key;
               }
            }
            else break;
         }
         for (let j = 0; j < 4; j++) {
            if (value.dice > j) {
               if (x > this.hexMap.X + value.drawPos.X - this.diceSize * 0.6
                  && y > this.hexMap.Y + value.drawPos.Y * this.hexMap.squish - this.diceSize * (0.75 + j * 0.55)
                  && x < this.hexMap.X + value.drawPos.X - this.diceSize * 0.6 + this.diceSize
                  && y < this.hexMap.Y + value.drawPos.Y * this.hexMap.squish - this.diceSize * (0.75 + j * 0.55) + this.diceSize) {
                  return key;
               }
            }
         }
      }
      return null;
   }

   click2 = (x, y) => {

      //check attacker dice
      for (let i = 0; i < 4; i++) {

         if (y < this.rollBuffer || y > this.rollBuffer + this.battleDiceSize * 2 || this.stateManager.gameState.attackerRolls.length <= i) break;
         if (this.stateManager.gameState.attackerStoppedRolls[i] == true) continue;
         if (x > this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i && x < this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i + this.battleDiceSize * 2) {
            return {
               owner: 'attacker',
               index: i
            }
         }

      }
      for (let i = 4; i < 8; i++) {
         if (y < this.rollBuffer * 2 + this.battleDiceSize * 2 || y > this.rollBuffer * 2 + this.battleDiceSize * 2 + this.battleDiceSize * 2 || this.stateManager.gameState.attackerRolls.length <= i) break;
         if (this.stateManager.gameState.attackerStoppedRolls[i] == true) continue;
         if (x > this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4) && x < this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4) + this.battleDiceSize * 2) {
            return {
               owner: 'attacker',
               index: i
            }
         }

      }

      //check defender dice
      for (let i = 0; i < 4; i++) {

         if (y < this.rollBuffer || y > this.rollBuffer + this.battleDiceSize * 2 || this.stateManager.gameState.defenderRolls.length <= i) break;
         if (this.stateManager.gameState.defenderStoppedRolls[i] == true) continue;
         if (x < this.canvas2.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i) && x > this.canvas2.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i + this.battleDiceSize * 2)) {
            return {
               owner: 'defender',
               index: i
            }
         }

      }
      for (let i = 4; i < 8; i++) {

         if (y < this.rollBuffer * 2 + this.battleDiceSize * 2 || y > this.rollBuffer * 2 + this.battleDiceSize * 2 + this.battleDiceSize * 2 || this.stateManager.gameState.defenderRolls.length <= i) break;
         if (this.stateManager.gameState.defenderStoppedRolls[i] == true) continue;
         if (x < this.canvas2.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4)) && x > this.canvas2.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4) + this.battleDiceSize * 2)) {
            return {
               owner: 'defender',
               index: i
            }
         }

      }
      return null;
   }

   setDiceSheet = (diceSheet, imageSize) => {
      this.diceSheet = diceSheet;
      this.imageSize = imageSize;
   }

   drawFightBox = () => {

      let x = this.canvas.width / 2 - this.fightBoxSize / 2;
      let y = this.canvas.height / 2 - this.fightBoxSize / 4;
      let width = this.fightBoxSize;
      let height = this.fightBoxSize / 3;
      let radius = 20;

      this.uiManager.drawBox(x, y, width, height, radius, "lightGrey");

      this.ctx.drawImage(this.diceSheet, this.imageSize * 5, this.imageSize * (this.hexGroupMap.get(this.stateManager.gameState.attacker).playerNumber + 1), this.imageSize, this.imageSize, x + width / 6 - this.diceSize, y + height / 2 - this.diceSize, this.diceSize * 2, this.diceSize * 2);
      this.ctx.drawImage(this.diceSheet, this.imageSize * 5, this.imageSize * (this.hexGroupMap.get(this.stateManager.gameState.defender).playerNumber + 1), this.imageSize, this.imageSize, x + width - width / 6 - this.diceSize, y + height / 2 - this.diceSize, this.diceSize * 2, this.diceSize * 2);

      this.ctx.fillStyle = 'black'
      this.ctx.font = `bold ${this.canvas2.width * 0.05}px Arial`;
      this.ctx.fillText("Fight", x + width / 2, y + height / 2)
   }

   drawEndBattle = () => {

      //calculate roll totals
      let attackerRollTotal = this.stateManager.gameState.attackerRolls.reduce((a, b) => a + b + 1, 0);
      let defenderRollTotal = this.stateManager.gameState.defenderRolls.reduce((a, b) => a + b + 1, 0);

      //draw attacker roll total
      this.ctx2.fillStyle = 'black'
      if (attackerRollTotal <= defenderRollTotal) this.ctx2.fillStyle = 'red'
      this.ctx2.font = `${this.canvas2.width * 0.05}px Arial`;
      this.ctx2.fillText(attackerRollTotal, this.canvas2.width / 2 - this.canvas2.width / 20, this.canvas2.height / 2)

      //draw defender roll total
      this.ctx2.fillStyle = 'black'
      if (attackerRollTotal > defenderRollTotal) this.ctx2.fillStyle = 'red'
      this.ctx2.font = `${this.canvas2.width * 0.05}px Arial`;
      this.ctx2.fillText(defenderRollTotal, this.canvas2.width / 2 + this.canvas2.width / 20, this.canvas2.height / 2)

      //draw attacker dice
      for (let i = 0; i < 4; i++) {

         if (this.stateManager.gameState.attackerRolls.length <= i) break;

         if (attackerRollTotal <= defenderRollTotal) {
            this.ctx2.drawImage(this.diceSheet, this.stateManager.gameState.attackerRolls[i] * this.imageSize, 0, this.imageSize, this.imageSize, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)
         } else {
            this.ctx2.drawImage(this.diceSheet, this.stateManager.gameState.attackerRolls[i] * this.imageSize, (this.hexGroupMap.get(this.stateManager.gameState.attacker).playerNumber + 1) * this.imageSize, this.imageSize, this.imageSize, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)
         }
      }
      for (let i = 4; i < 8; i++) {

         if (this.stateManager.gameState.attackerRolls.length <= i) break;

         if (attackerRollTotal <= defenderRollTotal) {
            this.ctx2.drawImage(this.diceSheet, this.stateManager.gameState.attackerRolls[i] * this.imageSize, 0, this.imageSize, this.imageSize, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4), this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)
         } else this.ctx2.drawImage(this.diceSheet, this.stateManager.gameState.attackerRolls[i] * this.imageSize, (this.hexGroupMap.get(this.stateManager.gameState.attacker).playerNumber + 1) * this.imageSize, this.imageSize, this.imageSize, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4), this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)
      }


      //draw defender dice
      for (let i = 0; i < 4; i++) {
         if (this.stateManager.gameState.defenderRolls.length <= i) break;

         if (attackerRollTotal > defenderRollTotal) {
            this.ctx2.drawImage(this.diceSheet, this.stateManager.gameState.defenderRolls[i] * this.imageSize, 0, this.imageSize, this.imageSize, this.canvas2.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i) - this.battleDiceSize * 2, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)
         } else this.ctx2.drawImage(this.diceSheet, this.stateManager.gameState.defenderRolls[i] * this.imageSize, (this.hexGroupMap.get(this.stateManager.gameState.defender).playerNumber + 1) * this.imageSize, this.imageSize, this.imageSize, this.canvas2.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i) - this.battleDiceSize * 2, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)
      }
      for (let i = 4; i < 8; i++) {

         if (this.stateManager.gameState.defenderRolls.length <= i) break;

         if (attackerRollTotal > defenderRollTotal) {
            this.ctx2.drawImage(this.diceSheet, this.stateManager.gameState.defenderRolls[i] * this.imageSize, 0, this.imageSize, this.imageSize, this.canvas2.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4)) - this.battleDiceSize * 2, this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)
         } else this.ctx2.drawImage(this.diceSheet, this.stateManager.gameState.defenderRolls[i] * this.imageSize, (this.hexGroupMap.get(this.stateManager.gameState.defender).playerNumber + 1) * this.imageSize, this.imageSize, this.imageSize, this.canvas2.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4)) - this.battleDiceSize * 2, this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)
      }
   }

   drawBattle = () => {

      this.drawFightBox();

      //calculate roll totals
      let attackerRollTotal = 0;
      for (let i = 0; i < this.stateManager.gameState.attackerRolls.length; i++) {
         if (this.stateManager.gameState.attackerStoppedRolls[i] == false) continue;
         attackerRollTotal += this.stateManager.gameState.attackerRolls[i] + 1;
      }
      let defenderRollTotal = 0;
      for (let i = 0; i < this.stateManager.gameState.defenderRolls.length; i++) {
         if (this.stateManager.gameState.defenderStoppedRolls[i] == false) continue;
         defenderRollTotal += this.stateManager.gameState.defenderRolls[i] + 1;
      }

      //draw attacker roll total
      this.ctx2.fillStyle = 'black'
      this.ctx2.font = `${this.canvas2.width * 0.05}px Arial`;
      this.ctx2.fillText(attackerRollTotal, this.canvas2.width / 2 - this.canvas2.width / 20, this.canvas2.height / 2)

      //draw defender roll total
      this.ctx2.fillStyle = 'black'
      this.ctx2.font = `${this.canvas2.width * 0.05}px Arial`;
      this.ctx2.fillText(defenderRollTotal, this.canvas2.width / 2 + this.canvas2.width / 20, this.canvas2.height / 2)

      //draw attacker dice
      for (let i = 0; i < 4; i++) {
         if (this.stateManager.gameState.attackerRolls.length <= i) break;
         this.ctx2.drawImage(this.diceSheet, this.stateManager.gameState.attackerRolls[i] * this.imageSize, (this.hexGroupMap.get(this.stateManager.gameState.attacker).playerNumber + 1) * this.imageSize, this.imageSize, this.imageSize, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)

      }
      for (let i = 4; i < 8; i++) {
         if (this.stateManager.gameState.attackerRolls.length <= i) break;
         this.ctx2.drawImage(this.diceSheet, this.stateManager.gameState.attackerRolls[i] * this.imageSize, (this.hexGroupMap.get(this.stateManager.gameState.attacker).playerNumber + 1) * this.imageSize, this.imageSize, this.imageSize, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4), this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)
      }


      //draw defender dice
      for (let i = 0; i < 4; i++) {
         if (this.stateManager.gameState.defenderRolls.length <= i) break;
         this.ctx2.drawImage(this.diceSheet, this.stateManager.gameState.defenderRolls[i] * this.imageSize, (this.hexGroupMap.get(this.stateManager.gameState.defender).playerNumber + 1) * this.imageSize, this.imageSize, this.imageSize, this.canvas2.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i) - this.battleDiceSize * 2, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)
      }
      for (let i = 4; i < 8; i++) {
         if (this.stateManager.gameState.defenderRolls.length <= i) break;
         this.ctx2.drawImage(this.diceSheet, this.stateManager.gameState.defenderRolls[i] * this.imageSize, (this.hexGroupMap.get(this.stateManager.gameState.defender).playerNumber + 1) * this.imageSize, this.imageSize, this.imageSize, this.canvas2.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4)) - this.battleDiceSize * 2, this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)
      }
   }

   drawScoreboard = () => {

      let drawScore = (x, y, width, height, radius, colorIndex, score, playerTurn) => {

         let color = this.colorMap[colorIndex];
         if (playerTurn) color = 'snow';

         this.uiManager.drawBox(x, y, width, height, radius, Math.floor(this.canvas.width / 250), color, playerTurn && '#ffd703')

         let sheetHasImage = (this.imageSize * (colorIndex + 1) < this.diceSheet.height)
         this.ctx.drawImage(this.diceSheet, this.imageSize * (6 - 1), sheetHasImage ? this.imageSize * (colorIndex + 1) : 0, this.imageSize, this.imageSize, x + (width / 4) * 1.15 - this.battleDiceSize * 0.5, y + height / 2 - this.battleDiceSize * 0.5, this.battleDiceSize, this.battleDiceSize);
         
         this.ctx.font = `${this.canvas.width * 0.03}px Arial`;
         this.ctx.textAlign = 'center';
         this.ctx.textBaseline = 'middle'
         this.ctx.fillStyle = 'black'
         if (score) this.ctx.fillText(score, x + (width / 4) * 2.85, y + height / 2)

      }

      let scoreWidth = this.canvas.width / 11.25;

      for (let i = 0; i < this.numPlayers; i++) {
         drawScore(scoreWidth * 0.0625 + scoreWidth * i * 1.125, 10, scoreWidth, scoreWidth / 2, 4, i, this.hexGroupMap.getPlayerGroups(i).length, this.stateManager.globalStates.currentPlayer == i)
      }

   }

   drawDice = () => {
      for (let [key, value] of this.hexGroupMap.getMap()) {

         let sheetHasImage = (this.imageSize * (value.playerNumber + 1) < this.diceSheet.height)

         this.ctx.fillStyle = 'rgba(25,25,25,0.8)';
         this.ctx.beginPath();
         this.ctx.ellipse(this.hexMap.X + value.drawPos.X + this.diceSize * 0.25, this.hexMap.Y + value.drawPos.Y * this.hexMap.squish + this.diceSize / 8, this.diceSize / 2, this.diceSize / 4, Math.PI, Math.PI / 2, Math.PI * 2);
         this.ctx.fill();
         for (let j = 4; j < 8; j++) {
            if (value.dice > j) {
               if (this.stateManager.gameState.stateName == 'endBattle') {

                  //attacker roll total
                  let attackerRollTotal = this.stateManager.gameState.attackerRolls.reduce((a, b) => a + b, 0);

                  //defender roll total
                  let defenderRollTotal = this.stateManager.gameState.defenderRolls.reduce((a, b) => a + b, 0);

                  if ((attackerRollTotal > defenderRollTotal && key == this.stateManager.gameState.defender) || (attackerRollTotal <= defenderRollTotal && key == this.stateManager.gameState.attacker)) {
                     this.ctx.drawImage(this.diceSheet, this.imageSize * value.diceOrientations[j], 0, this.imageSize, this.imageSize, this.hexMap.X + value.drawPos.X - this.diceSize * 1.35, this.hexMap.Y + value.drawPos.Y * this.hexMap.squish - this.diceSize * (1 + (j - 4) * 0.55), this.diceSize, this.diceSize);
                     continue;
                  }
               }
               this.ctx.drawImage(this.diceSheet, this.imageSize * value.diceOrientations[j], sheetHasImage ? this.imageSize * (value.playerNumber + 1) : 0, this.imageSize, this.imageSize, this.hexMap.X + value.drawPos.X - this.diceSize * 1.35, this.hexMap.Y + value.drawPos.Y * this.hexMap.squish - this.diceSize * (1 + (j - 4) * 0.55), this.diceSize, this.diceSize);
            } else break;
         }

         for (let j = 0; j < 4; j++) {
            if (value.dice > j) {
               if (this.stateManager.gameState.stateName == 'endBattle') {

                  //attacker roll total
                  let attackerRollTotal = this.stateManager.gameState.attackerRolls.reduce((a, b) => a + b, 0);

                  //defender roll total
                  let defenderRollTotal = this.stateManager.gameState.defenderRolls.reduce((a, b) => a + b, 0);

                  if ((attackerRollTotal > defenderRollTotal && key == this.stateManager.gameState.defender) || (attackerRollTotal <= defenderRollTotal && key == this.stateManager.gameState.attacker)) {
                     this.ctx.drawImage(this.diceSheet, this.imageSize * value.diceOrientations[j], 0, this.imageSize, this.imageSize, this.hexMap.X + value.drawPos.X - this.diceSize * 0.6, this.hexMap.Y + value.drawPos.Y * this.hexMap.squish - this.diceSize * (0.75 + j * 0.55), this.diceSize, this.diceSize);
                     continue;
                  }
               }
               this.ctx.drawImage(this.diceSheet, this.imageSize * value.diceOrientations[j], sheetHasImage ? this.imageSize * (value.playerNumber + 1) : 0, this.imageSize, this.imageSize, this.hexMap.X + value.drawPos.X - this.diceSize * 0.6, this.hexMap.Y + value.drawPos.Y * this.hexMap.squish - this.diceSize * (0.75 + j * 0.55), this.diceSize, this.diceSize);
            }
         }
      }
   }

   assignDice = () => {
      for (let i = 0; i < this.hexGroupMap.numPlayers; i++) {
         let numDice = this.hexGroupMap.numGroups / this.hexGroupMap.numPlayers * 3;
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

}