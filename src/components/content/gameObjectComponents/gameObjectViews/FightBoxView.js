import PixelUIClass from "../../utilities/pixelUI";

export default class FightBoxViewClass {

   constructor(ctx, imageMap, hexGroupDiceMap, stateManager, x, y, width, height, radius, diceSize, pixelSize, font){
      this.ctx = ctx;
      this.imageMap = imageMap;

      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.radius = radius;
      this.font = font;
      this.diceSize = diceSize;
      this.pixelSize = pixelSize;

      this.hexGroupDiceMap = hexGroupDiceMap;
      this.stateManager = stateManager;

      this.pixelUI = new PixelUIClass();
   }
 
   draw = () => {

      this.pixelUI.drawBox(this.ctx, this.x, this.y, this.width, this.height, this.radius, this.pixelSize, "lightGrey");

      this.ctx.drawImage(this.imageMap.get('diceSheet'), this.imageMap.get('diceSheet').width/6 * 5, this.imageMap.get('diceSheet').width/6 * (this.hexGroupDiceMap.getGroup(this.stateManager.gameState.attacker).playerNumber + 1), this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.x + this.width / 6 - this.diceSize, this.y + this.height / 2 - this.diceSize, this.diceSize * 2, this.diceSize * 2);
      this.ctx.drawImage(this.imageMap.get('diceSheet'), this.imageMap.get('diceSheet').width/6 * 5, this.imageMap.get('diceSheet').width/6 * (this.hexGroupDiceMap.getGroup(this.stateManager.gameState.defender).playerNumber + 1), this.imageMap.get('diceSheet').width/6, this.imageMap.get('diceSheet').width/6, this.x + this.width - this.width / 6 - this.diceSize, this.y + this.height / 2 - this.diceSize, this.diceSize * 2, this.diceSize * 2);

      this.ctx.fillStyle = 'black'
      this.ctx.font = this.font;
      this.ctx.fillText("Fight", this.x + this.width / 2, this.y + this.height / 2)
   }

}