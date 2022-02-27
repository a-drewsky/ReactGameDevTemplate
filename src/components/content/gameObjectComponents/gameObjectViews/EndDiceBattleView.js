export default class EndDiceBattleViewClass {

   constructor(ctx, imageMap, hexGroupDiceMap, stateManager, font, battleDiceSize, width, height){
      this.ctx = ctx;
      this.imageMap = imageMap;
      this.hexGroupDiceMap = hexGroupDiceMap;
      this.stateManager = stateManager;

      this.font = font;
      this.battleDiceSize = battleDiceSize;
      this.rollBuffer = this.battleDiceSize / 2;
      this.width = width;
      this.height = height;
   }

   draw(){
      //calculate roll totals
      let attackerRollTotal = this.stateManager.gameStates.current.attackerRolls.reduce((a, b) => a + b + 1, 0);
      let defenderRollTotal = this.stateManager.gameStates.current.defenderRolls.reduce((a, b) => a + b + 1, 0);

      //draw attacker roll total
      this.ctx.fillStyle = 'black'
      if (attackerRollTotal <= defenderRollTotal) this.ctx.fillStyle = 'red'
      this.ctx.font = this.font;
      this.ctx.fillText(attackerRollTotal, this.width / 2 - this.width / 20, this.height / 2)

      //draw defender roll total
      this.ctx.fillStyle = 'black'
      if (attackerRollTotal > defenderRollTotal) this.ctx.fillStyle = 'red'
      this.ctx.font = `${this.width * 0.05}px Arial`;
      this.ctx.fillText(defenderRollTotal, this.width / 2 + this.width / 20, this.height / 2)

      //draw attacker dice
      for (let i = 0; i < 4; i++) {

         if (this.stateManager.gameStates.current.attackerRolls.length <= i) break;

         if (attackerRollTotal <= defenderRollTotal) {
            this.ctx.drawImage(this.imageMap.get('diceSheet'), this.stateManager.gameStates.current.attackerRolls[i] * this.imageMap.get('diceSheet').width/6, 0, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)
         } else {
            this.ctx.drawImage(this.imageMap.get('diceSheet'), this.stateManager.gameStates.current.attackerRolls[i] * this.imageMap.get('diceSheet').width/6, (this.hexGroupDiceMap.getGroup(this.stateManager.gameStates.current.attacker).playerNumber + 1) * this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)
         }
      }
      for (let i = 4; i < 8; i++) {

         if (this.stateManager.gameStates.current.attackerRolls.length <= i) break;

         if (attackerRollTotal <= defenderRollTotal) {
            this.ctx.drawImage(this.imageMap.get('diceSheet'), this.stateManager.gameStates.current.attackerRolls[i] * this.imageMap.get('diceSheet').width/6, 0, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4), this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)
         } else this.ctx.drawImage(this.imageMap.get('diceSheet'), this.stateManager.gameStates.current.attackerRolls[i] * this.imageMap.get('diceSheet').width/6, (this.hexGroupDiceMap.getGroup(this.stateManager.gameStates.current.attacker).playerNumber + 1) * this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4), this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)
      }


      //draw defender dice
      for (let i = 0; i < 4; i++) {
         if (this.stateManager.gameStates.current.defenderRolls.length <= i) break;

         if (attackerRollTotal > defenderRollTotal) {
            this.ctx.drawImage(this.imageMap.get('diceSheet'), this.stateManager.gameStates.current.defenderRolls[i] * this.imageMap.get('diceSheet').width/6, 0, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i) - this.battleDiceSize * 2, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)
         } else this.ctx.drawImage(this.imageMap.get('diceSheet'), this.stateManager.gameStates.current.defenderRolls[i] * this.imageMap.get('diceSheet').width/6, (this.hexGroupDiceMap.getGroup(this.stateManager.gameStates.current.defender).playerNumber + 1) * this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i) - this.battleDiceSize * 2, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)
      }
      for (let i = 4; i < 8; i++) {

         if (this.stateManager.gameStates.current.defenderRolls.length <= i) break;

         if (attackerRollTotal > defenderRollTotal) {
            this.ctx.drawImage(this.imageMap.get('diceSheet'), this.stateManager.gameStates.current.defenderRolls[i] * this.imageMap.get('diceSheet').width/6, 0, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4)) - this.battleDiceSize * 2, this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)
         } else this.ctx.drawImage(this.imageMap.get('diceSheet'), this.stateManager.gameStates.current.defenderRolls[i] * this.imageMap.get('diceSheet').width/6, (this.hexGroupDiceMap.getGroup(this.stateManager.gameStates.current.defender).playerNumber + 1) * this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4)) - this.battleDiceSize * 2, this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)
      }
   }

}