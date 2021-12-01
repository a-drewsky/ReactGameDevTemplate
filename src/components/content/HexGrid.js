import HexagonClass from './Hexagon.js'
import HexmapClass from './Hexmap.js';
import HexgridBuilderClass from './HexmapBuilder.js';

export default class hexGridClass {

   constructor(ctx, size, canvasW, canvasH, groups) {

      this.ctx = ctx
      this.size = size;
      this.groups = groups;
      this.Q = Math.floor((canvasW / 2 / (Math.sqrt(3) * size)) - 1);
      this.R = Math.floor((canvasH / 2 / (3 / 2 * size)) - 1);
      this.X = (canvasW / 2 - (this.Q * Math.sqrt(3) * size) - Math.sqrt(3) * size / 4);
      this.Y = (canvasH / 2 - (this.R * (3 / 2) * size) - size / 4);
      this.VecQ = { x: Math.sqrt(3) * size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * size, y: 3 / 2 * size }

      this.hexMap = new HexmapClass();
      this.HexagonClass = new HexagonClass(ctx, size);
      this.hexMapBuilder = new HexgridBuilderClass(this.hexMap);

      this.colorMap = ['Coral', 'BlueViolet', 'DarkSeaGreen', 'FireBrick', 'IndianRed', 'LightPink', 'LightGreen', 'MediumPurple', 'Orchid', 'PaleGreen', 'Peru', 'PowderBlue', 'Salmon', 'SkyBlue', 'Turquoise']

   }

   createHexMap = () => {

      this.hexMapBuilder.generateMap(this.Q, this.R);

      this.hexMapBuilder.removeOuterTiles();
      this.hexMapBuilder.removeInnerTiles();
      this.hexMapBuilder.deleteIslands();

      this.hexMapBuilder.createGroups(30);

   }

   drawHexGrid = () => {

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q + this.VecR.y * keyObj.R;

         this.HexagonClass.drawHexagon(this.X + xOffset, this.Y + yOffset, value.group==null ? null : this.colorMap[value.group % this.colorMap.length]);
      }

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q + this.VecR.y * keyObj.R;

         let edges = [];
         if(value.group != null) edges = this.hexMap.getGroupEdges(keyObj.Q, keyObj.R);

         this.HexagonClass.drawEdges(this.X + xOffset, this.Y + yOffset, edges)
      }
   }

}