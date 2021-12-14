export default class HexGroup {

   constructor(player, drawPos, drawHexPos){

      this.player = player;
      this.drawPos = drawPos
      this.drawHexPos = drawHexPos
      this.dice = 1;
      this.maxDice = 8;
      this.selected = false;

   }

}