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

      //Procedural generation variables
      this.outerMinGen = 2;
      this.outerMaxGen = 6;
      this.outerRecurssionBoundry = 0.9;
      this.outerMinRecurssionRoll = 0.1;
      this.outerRecurssionChance = 0.925;

      this.innerMinGen = 1;
      this.innerMaxGen = 4;
      this.innerRecurssionBoundry = 0.9;
      this.innerMinRecurssionRoll = 0.01;
      this.innerRecurssionChance = 0.65;

   }

   populateHexMap = () => {

      let removeOuterTiles = () => {
         let numOuterTiles = this.outerMinGen + Math.floor(Math.random() * (this.outerMaxGen - this.outerMinGen));
         for (let i = 0; i < numOuterTiles; i++) {
            let selected = this.hexMap.randomOuterTile();

            this.hexMap.delete(selected.Q, selected.R);

            let neighbors = this.hexMap.neighborKeysOuter(selected.Q, selected.R);

            let recurssionBoundry = this.outerRecurssionBoundry;
            let recurssionRoll = Math.max(Math.random(), this.outerMinRecurssionRoll);

            while (recurssionBoundry > recurssionRoll) {

               if (neighbors.length == 0) break;

               selected = neighbors[Math.floor(Math.random() * neighbors.length)];

               this.hexMap.delete(selected.Q, selected.R);

               neighbors = this.hexMap.neighborKeysOuter(selected.Q, selected.R);

               recurssionBoundry *= this.outerRecurssionChance;
            }

         }
      }

      let removeInnerTiles = () => {
         let numInnerTiles = this.innerMinGen + Math.floor(Math.random() * (this.innerMaxGen - this.innerMinGen));
         for (let i = 0; i < numInnerTiles; i++) {

            //Select a random inner tile
            let selected = this.hexMap.randomInnerTile();

            let toRemove = [selected];

            let neighbors = this.hexMap.neighborKeysInner(selected.Q, selected.R);

            let recurssionBoundry = this.innerRecurssionBoundry;
            let recurssionRoll = Math.max(Math.random(), this.innerMinRecurssionRoll);

            while (recurssionBoundry > recurssionRoll) {

               if (neighbors.length == 0) break;

               selected = neighbors[Math.floor(Math.random() * neighbors.length)];

               toRemove.push(selected);

               neighbors = this.hexMap.neighborKeysInner(selected.Q, selected.R);

               recurssionBoundry *= this.innerRecurssionChance;
            }

            for (let i = 0; i < toRemove.length; i++) {
               this.hexMap.delete(toRemove[i].Q, toRemove[i].R);
            }
         }
      }

      //map generation
      for (let r = 0; r < this.R; r++) {
         for (let q = -1 * Math.floor(r / 2); q < this.Q - Math.floor(r / 2); q++) {
            this.hexMap.set(q, r, {
               group: 'gray'
            })
         }
      }

      removeOuterTiles();
      removeInnerTiles();

      this.hexMap.deleteIslands();

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