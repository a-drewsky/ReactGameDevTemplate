import PixelUIClass from "../../utilities/pixelUI";

export default class ScoreboardViewClass {

   constructor(ctx, imageMap, hexGroupDiceMap, stateManager, scoreWidth, diceSize, pixelSize, font){
      this.pixelUI = new PixelUIClass();

      this.ctx = ctx;
      this.imageMap = imageMap;
      this.scoreWidth = scoreWidth;
      this.diceSize = diceSize;
      this.pixelSize = pixelSize;
      this.font = font;

      this.hexGroupDiceMap = hexGroupDiceMap;
      this.stateManager = stateManager;
   }

   draw = () => {
      let drawScore = (x, y, width, height, radius, colorIndex, score, playerTurn) => {

         let color = this.hexGroupDiceMap.colorMap[colorIndex];
         if (playerTurn) color = 'snow';

         this.pixelUI.drawBox(this.ctx, x, y, width, height, radius, this.pixelSize, color, playerTurn && '#ffd703')

         let sheetHasImage = (this.imageMap.get('diceSheet').width/6 * (colorIndex + 1) < this.imageMap.get('diceSheet').height)
         this.ctx.drawImage(this.imageMap.get('diceSheet'), this.imageMap.get('diceSheet').width/6 * (6 - 1), sheetHasImage ? this.imageMap.get('diceSheet').width/6 * (colorIndex + 1) : 0, this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, x + (width / 4) * 1.15 - this.diceSize * 0.5, y + height / 2 - this.diceSize * 0.5, this.diceSize, this.diceSize);

         this.ctx.font = this.font;
         this.ctx.textAlign = 'center';
         this.ctx.textBaseline = 'middle'
         this.ctx.fillStyle = 'black'
         if (score) this.ctx.fillText(score, x + (width / 4) * 2.85, y + height / 2)

      }

      for (let i = 0; i < this.hexGroupDiceMap.numPlayers; i++) {
         drawScore(this.scoreWidth * 0.0625 + this.scoreWidth * i * 1.125, 10, this.scoreWidth, this.scoreWidth / 2, 4, i, this.hexGroupDiceMap.getPlayerGroups(i).length, this.stateManager.globalStates.currentPlayer == i)
      }

   }

}