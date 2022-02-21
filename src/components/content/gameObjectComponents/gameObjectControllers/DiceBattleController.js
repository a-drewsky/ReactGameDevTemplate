import CollisionClass from "../../utilities/collision";

export default class DiceBattleControllerClass {

   constructor(ctx, canvas, stateManager){

      this.battleDiceSize = canvas.width / 100 * 3.75;
      this.rollBuffer = this.battleDiceSize / 2;
      this.stateManager = stateManager;
      this.canvas = canvas;

      this.collision = new CollisionClass();
   }

   //why do we use battleDiceSize * 2
   click = (x, y) => {

      //check attacker dice
      for (let i = 0; i < 4; i++) {

         if (this.stateManager.gameState.attackerRolls.length <= i) break;
         if (this.stateManager.gameState.attackerStoppedRolls[i] == true) continue;

         if(this.collision.pointRect(x, y, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i, this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)){
            return {
               owner: 'attacker',
               index: i
            }
         }
      }
      for (let i = 4; i < 8; i++) {
         if (this.stateManager.gameState.attackerRolls.length <= i) break;
         if (this.stateManager.gameState.attackerStoppedRolls[i] == true) continue;

         if(this.collision.pointRect(x, y, this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4), this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)){
            return {
               owner: 'attacker',
               index: i
            }
         }
      }

      //check defender dice
      for (let i = 0; i < 4; i++) {

         if(this.stateManager.gameState.defenderRolls.length <= i) break;
         if (this.stateManager.gameState.defenderStoppedRolls[i] == true) continue;

         if(this.collision.pointRect(x, y, this.canvas.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * i + this.battleDiceSize * 2), this.rollBuffer, this.battleDiceSize * 2, this.battleDiceSize * 2)){
            return {
               owner: 'defender',
               index: i
            }
         }
      }
      for (let i = 4; i < 8; i++) {

         if(this.stateManager.gameState.defenderRolls.length <= i) break;
         if (this.stateManager.gameState.defenderStoppedRolls[i] == true) continue;

         if(this.collision.pointRect(x, y, this.canvas.width - (this.rollBuffer + (this.battleDiceSize * 2 + this.rollBuffer) * (i - 4) + this.battleDiceSize * 2), this.rollBuffer * 2 + this.battleDiceSize * 2, this.battleDiceSize * 2, this.battleDiceSize * 2)){
            return {
               owner: 'defender',
               index: i
            }
         }
      }
      return null;
   }

}