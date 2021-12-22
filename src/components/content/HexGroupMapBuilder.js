import HexGroupClass from './HexGroup.js';

export default class HexGroupMapBuilderClass {

   constructor(hexMap, groupMap, VecQ, VecR) {
      this.VecQ = VecQ;
      this.VecR = VecR;

      this.hexMap = hexMap;
      this.groupMap = groupMap;
   }

   getTakenGroupPositions = () => {

      let positions = [];

      for (let [key, value] of this.groupMap.map()) {
         let groupHexPos = value.drawHexPos;

         positions.push(this.hexMap.join(groupHexPos.Q, groupHexPos.R));

         positions.push(this.hexMap.join(groupHexPos.Q, groupHexPos.R - 1));
         positions.push(this.hexMap.join(groupHexPos.Q + 1, groupHexPos.R - 1));
         positions.push(this.hexMap.join(groupHexPos.Q + 1, groupHexPos.R));
         positions.push(this.hexMap.join(groupHexPos.Q, groupHexPos.R + 1));
         positions.push(this.hexMap.join(groupHexPos.Q - 1, groupHexPos.R + 1));
         positions.push(this.hexMap.join(groupHexPos.Q - 1, groupHexPos.R));

         positions.push(this.hexMap.join(groupHexPos.Q + 1, groupHexPos.R - 2));
         positions.push(this.hexMap.join(groupHexPos.Q - 1, groupHexPos.R + 2));

      }

      return positions;
   }

   randomGroupNeighbor = (group) => {
      //get all tiles in group
      let groupTiles = this.groupMap.getGroupTiles(group);

      //get all null neighbors of tiles
      let groupNeighbors = new Set();

      for(let i=0; i<groupTiles.length; i++){
         let neighbors = this.hexMap.neighborKeysNull(groupTiles[i].Q, groupTiles[i].R);


         for(let j=0; j<neighbors.length; j++){
            groupNeighbors.add(this.hexMap.join(neighbors[j].Q, neighbors[j].R));
         }
      }


      let arr = Array.from(groupNeighbors).map(key => this.hexMap.split(key));


      //return random null neighbor
      return arr[Math.floor(Math.random() * arr.length)];
   }

   createGroups = (numGroups) => {

      let closestPosition = (pos, posList) => {
         let distances = [];
         for (let i = 0; i < posList.length; i++) {
            distances[i] = Math.sqrt(Math.pow(pos.X - posList[i].X, 2) + Math.pow(pos.Y - posList[i].Y, 2));
         }
   
         let shortest = Math.min(...distances);
   
         let index = distances.indexOf(shortest);
   
   
         return posList[index];
   
      }

      let keyStrings = this.hexMap.keyStrings();

      if (keyStrings.length < numGroups) return -1;
      if(this.hexMap.size() < this.maxTilesRemoved) return -1;

      for (let i = 0; i < numGroups; i++) {
         let selected = this.hexMap.randomNullNeighborsNull();
         
         if (selected == null) return -1;

         keyStrings.splice(keyStrings.indexOf(this.hexMap.join(selected.Q, selected.R)), 1);

         this.hexMap.set(selected.Q, selected.R, {
            group: i
         })
      }

      while (keyStrings.length > 0) {
         for (let i = 0; i < numGroups; i++) {
            let selected = this.randomGroupNeighbor(i);

            if (selected == null) continue;

            keyStrings.splice(keyStrings.indexOf(this.hexMap.join(selected.Q, selected.R)), 1);

            this.hexMap.set(selected.Q, selected.R, {
               group: i
            })
         }
      }

      for (let i = 0; i < this.groupMap.numGroups; i++) {

         let takenPositions = this.getTakenGroupPositions();

         let tiles = this.groupMap.getGroupCenterTiles(i, takenPositions);

         let tilePositions = [];
         let tileHexPositions = [];
         let averagePos = {
            X: 0,
            Y: 0
         }

         //calculate group draw position
         for (let j = 0; j < tiles.length; j++) {
            let tilePos = {
               X: this.VecQ.x * tiles[j].Q + this.VecR.x * tiles[j].R,
               Y: this.VecQ.y * tiles[j].Q + this.VecR.y * tiles[j].R
            }
            let tileHexPos = {
               Q: tiles[j].Q,
               R: tiles[j].R
            }
            tilePositions[j] = tilePos;
            tileHexPositions[j] = tileHexPos;
            averagePos.X += tilePos.X;
            averagePos.Y += tilePos.Y;
         }

         averagePos.X /= tilePositions.length;
         averagePos.Y /= tilePositions.length;

         let groupDrawPos = closestPosition(averagePos, tilePositions);
         let groupDrawHexPos = tileHexPositions[tilePositions.indexOf(groupDrawPos)];
         this.groupMap.set(i, new HexGroupClass(groupDrawPos, groupDrawHexPos));

      }
      console.log(this.groupMap.map())
      this.groupMap.groupMap = new Map([...this.groupMap.groupMap.entries()].sort((a, b) => a[1].drawPos.Y - b[1].drawPos.Y));

      console.log(this.groupMap.map())
      

      return 1;

   }

   

}