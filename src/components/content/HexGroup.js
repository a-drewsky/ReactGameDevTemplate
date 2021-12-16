export default class HexGroup {

   constructor(playerNumber, drawPos, drawHexPos){

      this.playerNumber = playerNumber;
      this.drawPos = drawPos
      this.drawHexPos = drawHexPos;
      this.dice = 1;
      this.maxDice = 8;
      this.selected = false;

   }

}