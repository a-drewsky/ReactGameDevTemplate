export default class DiceBattleViewClass {

   constructor(ctx, imageMap, hexGroupDiceMap, stateManager, font, diceBattle, width, height) {
      this.ctx = ctx;
      this.imageMap = imageMap;
      this.hexGroupDiceMap = hexGroupDiceMap;
      this.stateManager = stateManager;

      this.font = font;
      
      //pass dice battle instead of using variables here
      this.battleDiceSize = diceBattle.battleDiceSize;
      this.rollBuffer = this.battleDiceSize / 2;
      this.width = width;
      this.height = height;
   }

   draw() {
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
      this.ctx.fillStyle = 'black'
      this.ctx.font = this.font;
      this.ctx.fillText(attackerRollTotal, this.width / 2 - this.width / 20, this.height / 2)

      //draw defender roll total
      this.ctx.fillStyle = 'black'
      this.ctx.font = this.font;
      this.ctx.fillText(defenderRollTotal, this.width / 2 + this.width / 20, this.height / 2)

      //draw attacker dice
      for (let i = 0; i < 4; i++) {
         if (this.stateManager.gameState.attackerRolls.length <= i) break;
         this.ctx.drawImage(this.imageMap.get('diceSheet'), this.stateManager.gameState.attackerRolls[i] * this.imageMap.get('diceSheet').width / 6, (this.hexGroupDiceMap.getGroup(this.stateManager.gameState.attacker).playerNumber + 1) * this.imageMap.get('diceSheet').width / 6, this.imageMap.get('diceSheet').width / 6, this.imageMap.get('diceSheet').width / 6, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)

      }
      for (let i = 4; i < 8; i++) {
         if (this.stateManager.gameState.attackerRolls.length <= i) break;
         this.ctx.drawImage(this.imageMap.get('diceSheet'), this.stateManager.gameState.attackerRolls[i] * this.imageMap.get('diceSheet').width / 6, (this.hexGroupDiceMap.getGroup(this.stateManager.gameState.attacker).playerNumber + 1) * this.imageMap.get('diceSheet').width / 6, this.imageMap.get('diceSheet').width / 6, this.imageMap.get('diceSheet').width / 6, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4), this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)
      }


      //draw defender dice
      for (let i = 0; i < 4; i++) {
         if (this.stateManager.gameState.defenderRolls.length <= i) break;
         this.ctx.drawImage(this.imageMap.get('diceSheet'), this.stateManager.gameState.defenderRolls[i] * this.imageMap.get('diceSheet').width / 6, (this.hexGroupDiceMap.getGroup(this.stateManager.gameState.defender).playerNumber + 1) * this.imageMap.get('diceSheet').width / 6, this.imageMap.get('diceSheet').width / 6, this.imageMap.get('diceSheet').width / 6, this.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i) - this.battleDiceSize * 2, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)
      }
      for (let i = 4; i < 8; i++) {
         if (this.stateManager.gameState.defenderRolls.length <= i) break;
         this.ctx.drawImage(this.imageMap.get('diceSheet'), this.stateManager.gameState.defenderRolls[i] * this.imageMap.get('diceSheet').width / 6, (this.hexGroupDiceMap.getGroup(this.stateManager.gameState.defender).playerNumber + 1) * this.imageMap.get('diceSheet').width / 6, this.imageMap.get('diceSheet').width / 6, this.imageMap.get('diceSheet').width / 6, this.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4)) - this.battleDiceSize * 2, this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)
      }
   }

}