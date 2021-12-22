import HexagonClass from './Hexagon.js'


export default class hexGridClass {

   constructor(ctx, ctx2, hexMap, canvas, canvas2, mapSize, size, Q, R, VecQ, VecR) {

      this.VecQ = VecQ;
      this.VecR = VecR;
      this.Q = Q;
      this.R = R;
      this.size = size;

      this.ctx = ctx
      this.ctx2 = ctx2
      this.hexMap = hexMap
      this.canvasDims = {
         width: canvas.width,
         height: canvas.height
      }
      this.canvas2Dims = {
         width: canvas2.width,
         height: canvas2.height
      }
      this.dieSize = this.canvasDims.width / 30;
      this.squish = 0.75;
      this.mapPos = 0.9;
      this.X = (canvas.width - (this.Q * Math.sqrt(3) * this.size) - Math.sqrt(3) * this.size / (mapSize == "small" ? 1.5 : mapSize == "medium" ? 2 : 4));
      this.Y = (canvas.height - (this.R * (3 / 2.2) * this.size * this.squish / this.mapPos));

      this.diceSize = this.size * 1.5
      this.imageSize = 0;

      this.HexagonClass = new HexagonClass(ctx, this.size, this.squish);


      this.currentBattle = {
         attacker: null,
         defender: null,
         attackerRolls: [],
         defenderRolls: [],
         attackerStoppedRolls: [],
         defenderStoppedRolls: [],
         interval: null
      }
      this.RollBuffer = this.diceSize / 2;

      this.buttonWidth = this.canvasDims.width / 5.625;

      this.battleTransitionTime = 0.5;
      this.battleTransitionTimer = null;
      this.battleTransition = false;

      this.endTurnTransitionTime = null;
      this.endTurnTransitionTimer = null;
      this.endTurnInterval = null;

      this.fightBoxSize = this.canvasDims.width / 2.5;

   }

   

   

   drawHexGrid = () => {


      // this.ctx.clearRect(0, 0, this.canvasDims.width, this.canvasDims.height);
      // this.ctx2.clearRect(0, 0, this.canvas2Dims.width, this.canvas2Dims.height);
      // clearInterval(this.currentBattle.interval)

      console.log(this.hexMap.map())
      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q * this.squish + this.VecR.y * keyObj.R * this.squish;
         
         // let group = this.groupMap.get(value.group);

         // let color = this.colorMap[group.playerNumber]

         // if (value.group == this.currentBattle.attacker) color = 'snow'
         // if (value.group == this.currentBattle.defender) color = 'slateGrey'
         
         this.HexagonClass.drawHexagon(this.X + xOffset, this.Y + yOffset, value.color);
      }

      // this.drawGroupEdges();

      // this.drawDice();

      // let players = [];
      // for(let i=0; i<this.numPlayers; i++){
      //    players.push(this.groupMap.getNumPlayerGroups(i))
      // }

      // this.uiManager.drawScoreboard(players, this.playerTurn);

      // this.uiManager.drawEndTurnButton(this.currentBattle.defender != null);

   }

}