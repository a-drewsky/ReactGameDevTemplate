import HexagonClass from './Hexagon.js'
import HexmapClass from './Hexmap.js';
import HexgridBuilderClass from './HexmapBuilder.js';
import HexGroup from './HexGroup.js';

export default class hexGridClass {

   constructor(ctx, size, canvasW, canvasH, numGroups, numPlayers) {

      this.ctx = ctx
      this.size = size;
      this.numGroups = numGroups;
      this.numPlayers = numPlayers
      this.Q = Math.floor((canvasW / 2 / (Math.sqrt(3) * size)) - 1);
      this.R = Math.floor((canvasH / 2 / (3 / 2 * size)) - 1);
      this.X = (canvasW / 2 - (this.Q * Math.sqrt(3) * size) - Math.sqrt(3) * size / 4);
      this.Y = (canvasH / 2 - (this.R * (3 / 2) * size) - size / 4);
      this.VecQ = { x: Math.sqrt(3) * size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * size, y: 3 / 2 * size }

      this.hexMap = new HexmapClass();
      this.HexagonClass = new HexagonClass(ctx, size);
      this.hexMapBuilder = new HexgridBuilderClass(this.hexMap);
      this.groupMap = [];

      this.colorMap = ['Coral', 'BlueViolet', 'DarkSeaGreen', 'FireBrick', 'IndianRed', 'LightPink', 'LightGreen', 'MediumPurple', 'Orchid', 'PaleGreen']

   }

   closestTile = (pos, posList) => {
      let distances = [];
      for(let i=0; i<posList.length; i++){
         distances[i] = Math.sqrt(Math.pow(pos.X - posList[i].X, 2) + Math.pow(pos.Y - posList[i].Y, 2));
      }

      let shortest = Math.min(...distances); 

      let index = distances.indexOf(shortest);


      return posList[index];

   }

   assignGroups = () => {
      for(let i=0; i<this.numGroups; i++){

         let tiles = this.hexMap.getGroupTiles(i);
         let tilePositions = [];
         let averagePos = {
            X: 0,
            Y: 0
         }

         for(let i=0; i<tiles.length; i++){
            let tilePos = {
               X: this.VecQ.x * tiles[i].Q + this.VecR.x * tiles[i].R,
               Y: this.VecQ.y * tiles[i].Q + this.VecR.y * tiles[i].R
            }
            tilePositions[i] = tilePos;
            averagePos.X += tilePos.X;
            averagePos.Y += tilePos.Y;
         }

         averagePos.X /= tilePositions.length;
         averagePos.Y /= tilePositions.length;

         let groupDrawPos = this.closestTile(averagePos, tilePositions);
         this.groupMap[i] = new HexGroup(i % this.numPlayers, groupDrawPos);
      }
   }

   createHexMap = () => {

      this.hexMapBuilder.generateMap(this.Q, this.R);

      this.hexMapBuilder.removeOuterTiles();
      this.hexMapBuilder.removeInnerTiles();
      this.hexMapBuilder.deleteIslands();

      this.hexMapBuilder.createGroups(this.numGroups);
      
      this.assignGroups();

   }

   drawHexGrid = () => {

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q + this.VecR.y * keyObj.R;

         this.HexagonClass.drawHexagon(this.X + xOffset, this.Y + yOffset, this.colorMap[this.groupMap[value.group].player]);
      }

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q + this.VecR.y * keyObj.R;

         let edges = [];
         if(value.group != null) edges = this.hexMap.getGroupEdges(keyObj.Q, keyObj.R);

         this.HexagonClass.drawEdges(this.X + xOffset, this.Y + yOffset, edges)
      }

      for(let i=0; i<this.groupMap.length; i++){
         this.ctx.fillStyle = 'black'
         this.ctx.fillText('0', this.X + this.groupMap[i].drawPos.X, this.Y + this.groupMap[i].drawPos.Y)
      }
   }

}