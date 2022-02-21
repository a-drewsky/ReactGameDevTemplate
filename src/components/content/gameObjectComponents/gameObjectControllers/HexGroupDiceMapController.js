import CollisionClass from "../../utilities/collision";

export default class HexGroupDiceMapClass {

   constructor(hexGroupDiceMap) {

      //super(x, y, size, squish, stateManager, numGroups, numPlayers, colorMap)

      this.hexGroupDiceMap = hexGroupDiceMap;
      //this.diceSize = diceSize; add to hexGroupMap via hexGroupDiceMapBuilder
      
      this.collision = new CollisionClass();
   }

   click = (x, y) => {

      for (let [key, value] of this.hexGroupDiceMap.getGroupMap()) {

         for (let j = 4; j < 8; j++) {
            if (value.dice > j) {
               if(this.collision.pointRect(x, y, this.hexGroupDiceMap.X + value.drawPos.X - this.hexGroupDiceMap.diceSize * 1.35, this.hexGroupDiceMap.Y + value.drawPos.Y * this.hexGroupDiceMap.squish - this.hexGroupDiceMap.diceSize * (1 + (j - 4) * 0.55), this.hexGroupDiceMap.diceSize, this.hexGroupDiceMap.diceSize)){
                  return key;
               }
            }
            else break;
         }
         for (let j = 0; j < 4; j++) {
            if (value.dice > j) {
               if(this.collision.pointRect(x, y, this.hexGroupDiceMap.X + value.drawPos.X - this.hexGroupDiceMap.diceSize * 0.6, this.hexGroupDiceMap.Y + value.drawPos.Y * this.hexGroupDiceMap.squish - this.hexGroupDiceMap.diceSize * (0.75 + j * 0.55), this.hexGroupDiceMap.diceSize, this.hexGroupDiceMap.diceSize)){
                  return key;
               }
            }
         }
      }
      return null;
   }

}