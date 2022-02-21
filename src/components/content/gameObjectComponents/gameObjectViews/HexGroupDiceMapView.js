import HexGroupMapViewClass from "./HexGroupMapView";

export default class HexGroupDiceMapViewClass {

   constructor(ctx, hexGroupDiceMap, diceSize, imageMap){
      this.ctx = ctx;
      this.hexGroupDiceMap = hexGroupDiceMap;

      this.diceSize = diceSize;

      this.imageMap = imageMap;

      this.hexGroupMapView = new HexGroupMapViewClass(ctx, hexGroupDiceMap)

   }

   draw = () => {

      this.hexGroupMapView.draw();

      for (let [key, value] of this.hexGroupDiceMap.getGroupMap()) {

         let sheetHasImage = (this.imageMap.get('diceSheet').width/6 * (value.playerNumber + 1) < this.imageMap.get('diceSheet').height)

         this.ctx.fillStyle = 'rgba(25,25,25,0.8)';
         this.ctx.beginPath();
         this.ctx.ellipse(this.hexGroupDiceMap.X + value.drawPos.X + this.diceSize * 0.25, this.hexGroupDiceMap.Y + value.drawPos.Y * this.hexGroupDiceMap.squish + this.diceSize / 8, this.diceSize / 2, this.diceSize / 4, Math.PI, Math.PI / 2, Math.PI * 2);
         this.ctx.fill();
         for (let j = 4; j < 8; j++) {
            if (value.dice > j) {
               if (this.hexGroupDiceMap.stateManager.gameState.stateName == 'endBattle') {

                  //attacker roll total
                  let attackerRollTotal = this.hexGroupDiceMap.stateManager.gameState.attackerRolls.reduce((a, b) => a + b, 0);

                  //defender roll total
                  let defenderRollTotal = this.hexGroupDiceMap.stateManager.gameState.defenderRolls.reduce((a, b) => a + b, 0);

                  if ((attackerRollTotal > defenderRollTotal && key == this.hexGroupDiceMap.stateManager.gameState.defender) || (attackerRollTotal <= defenderRollTotal && key == this.hexGroupDiceMap.stateManager.gameState.attacker)) {
                     this.ctx.drawImage(this.imageMap.get('diceSheet'), this.imageMap.get('diceSheet').width/6 * value.diceOrientations[j], 0, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.hexGroupDiceMap.X + value.drawPos.X - this.diceSize * 1.35, this.hexGroupDiceMap.Y + value.drawPos.Y * this.hexGroupDiceMap.squish - this.diceSize * (1 + (j - 4) * 0.55), this.diceSize, this.diceSize);
                     continue;
                  }
               }
               this.ctx.drawImage(this.imageMap.get('diceSheet'), this.imageMap.get('diceSheet').width/6 * value.diceOrientations[j], sheetHasImage ? this.imageMap.get('diceSheet').width/6 * (value.playerNumber + 1) : 0, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.hexGroupDiceMap.X + value.drawPos.X - this.diceSize * 1.35, this.hexGroupDiceMap.Y + value.drawPos.Y * this.hexGroupDiceMap.squish - this.diceSize * (1 + (j - 4) * 0.55), this.diceSize, this.diceSize);
            } else break;
         }

         for (let j = 0; j < 4; j++) {
            if (value.dice > j) {
               if (this.hexGroupDiceMap.stateManager.gameState.stateName == 'endBattle') {

                  //attacker roll total
                  let attackerRollTotal = this.hexGroupDiceMap.stateManager.gameState.attackerRolls.reduce((a, b) => a + b, 0);

                  //defender roll total
                  let defenderRollTotal = this.hexGroupDiceMap.stateManager.gameState.defenderRolls.reduce((a, b) => a + b, 0);

                  if ((attackerRollTotal > defenderRollTotal && key == this.hexGroupDiceMap.stateManager.gameState.defender) || (attackerRollTotal <= defenderRollTotal && key == this.hexGroupDiceMap.stateManager.gameState.attacker)) {
                     this.ctx.drawImage(this.imageMap.get('diceSheet'), this.imageMap.get('diceSheet').width/6 * value.diceOrientations[j], 0, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.hexGroupDiceMap.X + value.drawPos.X - this.diceSize * 0.6, this.hexGroupDiceMap.Y + value.drawPos.Y * this.hexGroupDiceMap.squish - this.diceSize * (0.75 + j * 0.55), this.diceSize, this.diceSize);
                     continue;
                  }
               }
               this.ctx.drawImage(this.imageMap.get('diceSheet'), this.imageMap.get('diceSheet').width/6 * value.diceOrientations[j], sheetHasImage ? this.imageMap.get('diceSheet').width/6 * (value.playerNumber + 1) : 0, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.hexGroupDiceMap.X + value.drawPos.X - this.diceSize * 0.6, this.hexGroupDiceMap.Y + value.drawPos.Y * this.hexGroupDiceMap.squish - this.diceSize * (0.75 + j * 0.55), this.diceSize, this.diceSize);
            }
         }
      }
   }

}