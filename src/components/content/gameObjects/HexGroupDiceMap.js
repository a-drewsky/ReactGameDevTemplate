import HexGroupMapClass from "./HexGroupMap";

import PixelUIClass from "../utilities/pixelUI";
import CollisionClass from "../utilities/collision";

export default class HexGroupDiceMapClass extends HexGroupMapClass {

   constructor(ctx, x, y, size, squish, numGroups, stateManager, colorMap, diceSize, numPlayers) {

      super(x, y, size, squish, stateManager, numGroups, numPlayers, colorMap)

      this.ctx = ctx;

      this.diceSize = diceSize;
      
      this.pixelUI = new PixelUIClass();
      this.collision = new CollisionClass();
   }

   click = (x, y) => {

      for (let [key, value] of this.getGroupMap()) {

         for (let j = 4; j < 8; j++) {
            if (value.dice > j) {
               if(this.collision.pointRect(x, y, this.X + value.drawPos.X - this.diceSize * 1.35, this.Y + value.drawPos.Y * this.squish - this.diceSize * (1 + (j - 4) * 0.55), this.diceSize, this.diceSize)){
                  return key;
               }
            }
            else break;
         }
         for (let j = 0; j < 4; j++) {
            if (value.dice > j) {
               if(this.collision.pointRect(x, y, this.X + value.drawPos.X - this.diceSize * 0.6, this.Y + value.drawPos.Y * this.squish - this.diceSize * (0.75 + j * 0.55), this.diceSize, this.diceSize)){
                  return key;
               }
            }
         }
      }
      return null;
   }

}