import HexGroupClass from './HexGroup.js';

export default class HexGroupMapBuilderClass {

   constructor(hexMap, hexGroupMap) {
      this.hexMap = hexMap;
      this.hexGroupMap = hexGroupMap;
   }

   getTakenGroupPositions = () => {

      let positions = [];

      for (let [key, value] of this.hexGroupMap.getMap()) {
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
      let groupTiles = this.hexGroupMap.getGroupTiles(group);

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

   assignGroups = () => {

      let playerNumber = 0;


      for (let [key, value] of this.hexGroupMap.getMap()) {

         value.setPlayerNumber(playerNumber);

         let groupTiles = this.hexGroupMap.getGroupTiles(key);

         for(let i=0; i<groupTiles.length; i++){
            this.hexMap.set(groupTiles[i].Q, groupTiles[i].R, {
               group: key,
               color: this.hexGroupMap.colorMap[playerNumber]
            })
         }

         playerNumber++;
         if(playerNumber == this.hexGroupMap.numPlayers) playerNumber = 0;

      }

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
      if(this.hexMap.mapSize() < this.maxTilesRemoved) return -1;

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

      for (let i = 0; i < this.hexGroupMap.numGroups; i++) {

         let takenPositions = this.getTakenGroupPositions();

         let tiles = this.hexGroupMap.getGroupCenterTiles(i, takenPositions);

         let tilePositions = [];
         let tileHexPositions = [];
         let averagePos = {
            X: 0,
            Y: 0
         }

         //calculate group draw position
         for (let j = 0; j < tiles.length; j++) {
            let tilePos = {
               X: this.hexMap.VecQ.x * tiles[j].Q + this.hexMap.VecR.x * tiles[j].R,
               Y: this.hexMap.VecQ.y * tiles[j].Q + this.hexMap.VecR.y * tiles[j].R
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
         this.hexGroupMap.set(i, new HexGroupClass(groupDrawPos, groupDrawHexPos));

      }
      this.hexGroupMap.setMap(new Map([...this.hexGroupMap.entries()].sort((a, b) => a[1].drawPos.Y - b[1].drawPos.Y)));

      

      return 1;

   }

   

}