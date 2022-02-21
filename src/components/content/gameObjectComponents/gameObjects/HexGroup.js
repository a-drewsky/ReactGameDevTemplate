export default class HexGroupClass {

   constructor(drawPos, drawHexPos){

      this.playerNumber = null;
      this.drawPos = drawPos
      this.drawHexPos = drawHexPos;
      this.dice = 1;
      this.maxDice = 8;
      this.diceOrientations = [
         Math.floor(Math.random() * 6), 
         Math.floor(Math.random() * 6), 
         Math.floor(Math.random() * 6), 
         Math.floor(Math.random() * 6), 
         Math.floor(Math.random() * 6), 
         Math.floor(Math.random() * 6),
         Math.floor(Math.random() * 6),
         Math.floor(Math.random() * 6)
      ]

   }

   setPlayerNumber = (playerNumber) => {
      this.playerNumber = playerNumber;
   }

}