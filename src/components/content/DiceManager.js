export default class DiceManagerClass {

   constructor(ctx, canvas, hexMap, hexGroupMap, uiManager, colorMap, diceSize, numPlayers){
      this.ctx = ctx;
      this.canvas = canvas;
      this.hexMap = hexMap;
      this.hexGroupMap = hexGroupMap;
      this.uiManager = uiManager;
      this.colorMap = colorMap;
      this.diceSize = diceSize;
      this.numPlayers = numPlayers

      this.diceSheet = null;
      this.imageSize = null;
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

      this.ctx.drawImage(this.diceSheet, this.imageSize * 5, this.imageSize * (this.groupMap.get(this.currentBattle.attacker).playerNumber+1), this.imageSize, this.imageSize, x + width/6 - this.diceSize, y + height/2 - this.diceSize, this.diceSize * 2, this.diceSize * 2);
      this.ctx.drawImage(this.diceSheet, this.imageSize * 5, this.imageSize * (this.groupMap.get(this.currentBattle.defender).playerNumber+1), this.imageSize, this.imageSize, x + width - width/6 - this.diceSize, y + height/2 - this.diceSize, this.diceSize * 2, this.diceSize * 2);

      this.ctx.fillStyle = 'black'
      this.ctx.font = `bold ${this.canvas2Dims.width * 0.05}px Arial`;
      this.ctx.fillText("Fight", x + width / 2, y + height / 2)
   }

   drawDie = (x, y, number, colorIndex) => {
      let sheetHasImage = (this.imageSize * (colorIndex + 1) < this.diceSheet.height)
      this.ctx.drawImage(this.diceSheet, this.imageSize * (number - 1), sheetHasImage ? this.imageSize * (colorIndex + 1) : 0, this.imageSize, this.imageSize, x - this.diceSize * 0.5, y - this.diceSize * 0.5, this.diceSize, this.diceSize);
   }

   drawScoreboard = (playerTurn) => {

      let drawScore = (x, y, width, height, radius, colorIndex, score, playerTurn) => {

         let color = this.colorMap[colorIndex];
         if (playerTurn) color = 'snow';

         this.uiManager.drawBox(x, y, width, height, radius, Math.floor(this.canvas.width / 250), color, playerTurn && '#ffd703')

         this.drawDie(x + (width / 4) * 1.15, y + height / 2, 6, colorIndex)
         this.ctx.font = `${this.canvas.width * 0.03}px Arial`;
         this.ctx.textAlign = 'center';
         this.ctx.textBaseline = 'middle'
         this.ctx.fillStyle = 'black'
         if (score) this.ctx.fillText(score, x + (width / 4) * 2.85, y + height / 2)

      }

      let scoreWidth = this.canvas.width / 11.25;

      for (let i = 0; i < this.numPlayers; i++) {
         drawScore(scoreWidth * 0.0625 + scoreWidth * i * 1.125, 10, scoreWidth, scoreWidth / 2, 4, i, this.hexGroupMap.getNumPlayerGroups(i), playerTurn == i)
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
               if (this.battleTransition) {
                  if (
                     (key == this.currentBattle.defender && this.currentBattle.attackerRolls.reduce((a, b) => a + b, 0) > this.currentBattle.defenderRolls.reduce((a, b) => a + b, 0))
                     ||
                     (key == this.currentBattle.attacker && this.currentBattle.attackerRolls.reduce((a, b) => a + b, 0) <= this.currentBattle.defenderRolls.reduce((a, b) => a + b, 0))
                  ) {
                     this.ctx.drawImage(this.diceSheet, this.imageSize * value.diceOrientations[j], 0, this.imageSize, this.imageSize, this.hexMap.X + value.drawPos.X - this.diceSize * 1.35, this.hexMap.Y + value.drawPos.Y * this.hexMap.squish - this.diceSize * (1 + (j - 4) * 0.55), this.diceSize, this.diceSize);
                     continue;
                  }
               }
               this.ctx.drawImage(this.diceSheet, this.imageSize * value.diceOrientations[j], sheetHasImage ? this.imageSize * (value.playerNumber + 1) : 0, this.imageSize, this.imageSize, this.hexMap.X + value.drawPos.X - this.diceSize * 1.35, this.hexMap.Y + value.drawPos.Y * this.hexMap.squish - this.diceSize * (1 + (j - 4) * 0.55), this.diceSize, this.diceSize);
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