import HexagonClass from './Hexagon.js'
import HexmapClass from './Hexmap.js';

export default class hexGridClass {

   constructor(ctx, size, canvasW, canvasH, groups) {

      this.ctx = ctx
      this.size = size;
      this.groups = groups;
      this.Q = Math.floor((canvasW / 2 / (Math.sqrt(3) * size)) - 1);
      this.R = Math.floor((canvasH / 2 / (3 / 2 * size)) - 1);
      this.X = (canvasW / 2 - (this.Q * Math.sqrt(3) * size) - Math.sqrt(3) * size / 2);
      this.Y = (canvasH / 2 - (this.R * (3 / 2) * size) - size / 4);
      this.VecQ = { x: Math.sqrt(3) * size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * size, y: 3 / 2 * size }

      this.hexMap = new HexmapClass();
      this.HexagonClass = new HexagonClass(ctx, size);
   }

   populateHexMap = () => {
      for (let r = 0; r < this.R; r++) {
         for (let q = -1 * Math.floor(r / 2); q < this.Q - Math.floor(r / 2); q++) {
            this.hexMap.set(q, r, {
               group: 'gray'
            })
         }
      }

      let numInnerTiles = 2;


      //Random map generation
      for (let i = 0; i < numInnerTiles; i++) {

         //Select a random inner tile
         let selected = this.hexMap.randomInnerTile();

         let toRemove = [selected];

         let neighbors = this.hexMap.neighborKeysInner(selected.Q, selected.R);

         let recurssionBoundry = 0.9;
         let recurssionRoll = Math.max(Math.random(), 0.01);

         while (recurssionBoundry > recurssionRoll){
            //select random neighbor

            if(neighbors.length == 0) break;

            selected = neighbors[Math.floor(Math.random() * neighbors.length)];

            toRemove.push(selected);

            neighbors = this.hexMap.neighborKeysInner(selected.Q, selected.R);
            
            recurssionBoundry *= 0.9;
         }

         for(let i=0; i<toRemove.length; i++){
            this.hexMap.delete(toRemove[i].Q, toRemove[i].R);
         }
      }

      this.hexMap.deleteIslands();

      // keys = [...this.hexMap.keys()];
      // selectedList = [];

      // for (let i = 0; i < blueTiles; i++) {
      //    let selected = keys.filter(key => !selectedList.includes(key))[Math.floor(Math.random() * keys.length)].split(',');
      //    this.hexMap.set(selected[0], selected[1], {
      //       group: 'blue'
      //    })
      //    selectedList.push(selected);
      // }

   }

   drawHexGrid = () => {

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q + this.VecR.y * keyObj.R;


         this.HexagonClass.drawHexagon(this.X + xOffset, this.Y + yOffset, value.group);
      }
   }

}