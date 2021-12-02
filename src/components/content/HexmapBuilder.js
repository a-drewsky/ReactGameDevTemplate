export default class HexgridBuilderClass {

   constructor(hexMap){

      this.hexMap = hexMap;

      this.outerMinGen = 8;
      this.outerMaxGen = 12;
      this.outerRecurssionBoundry = 0.95;
      this.outerMinRecurssionRoll = 0.2;
      this.outerRecurssionChance = 0.95;

      this.innerMinGen = 8;
      this.innerMaxGen = 12;
      this.innerRecurssionBoundry = 0.95;
      this.innerMinRecurssionRoll = 0.1;
      this.innerRecurssionChance = 0.9;

      this.outerMaxTilesRemovedPercent = 0.35;
      this.totalMaxTilesRemovedPercent = 0.5;

      this.tileRemoved = 0;
   }

   generateMap = (Qgen, Rgen) => {
      for (let r = 0; r < Rgen; r++) {
         for (let q = -1 * Math.floor(r / 2); q < Qgen - Math.floor(r / 2); q++) {
            this.hexMap.set(q, r, {
               group: null
            })
         }
      }
   }

   createGroups = (numGroups) => {

      let keyStrings = this.hexMap.keyStrings();

      for(let i=0; i<numGroups; i++){
         let selected = this.hexMap.randomNullNeighborsNull();

         keyStrings.splice(keyStrings.indexOf(this.hexMap.join(selected.Q, selected.R)), 1);

         this.hexMap.set(selected.Q, selected.R, {
            group: i
         })
      }

      while(keyStrings.length > 0){
         for(let i=0; i<numGroups; i++){
            let selected = this.hexMap.randomGroupNeighbor(i);

            if(selected==null) continue;
   
            keyStrings.splice(keyStrings.indexOf(this.hexMap.join(selected.Q, selected.R)), 1);
   
            this.hexMap.set(selected.Q, selected.R, {
               group: i
            })
         }
      }


   }

   removeOuterTiles = () => {
      let numOuterTileGroups = this.outerMinGen + Math.floor(Math.random() * (this.outerMaxGen - this.outerMinGen));
      let outerMaxTilesRemoved = Math.floor(this.hexMap.size() * this.outerMaxTilesRemovedPercent);
      for (let i = 0; i < numOuterTileGroups; i++) {
         let selected = this.hexMap.randomOuterTile();

         this.hexMap.delete(selected.Q, selected.R);
         this.tileRemoved++;

         let neighbors = this.hexMap.neighborKeysOuter(selected.Q, selected.R);

         let recurssionBoundry = this.outerRecurssionBoundry;
         let recurssionRoll = Math.max(Math.random(), this.outerMinRecurssionRoll);

         while (recurssionBoundry > recurssionRoll && this.tileRemoved < outerMaxTilesRemoved) {

            if (neighbors.length == 0) break;

            selected = neighbors[Math.floor(Math.random() * neighbors.length)];

            this.hexMap.delete(selected.Q, selected.R);
            this.tileRemoved++;

            neighbors = this.hexMap.neighborKeysOuter(selected.Q, selected.R);

            recurssionBoundry *= this.outerRecurssionChance;
         }

      }
   }

   removeInnerTiles = () => {
      let numInnerTileGroups = this.innerMinGen + Math.floor(Math.random() * (this.innerMaxGen - this.innerMinGen));
      let totalMaxTilesRemoved = Math.floor(this.hexMap.size() * this.totalMaxTilesRemovedPercent);
      for (let i = 0; i < numInnerTileGroups; i++) {

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

            if(this.tileRemoved > totalMaxTilesRemoved) break;

            this.hexMap.delete(toRemove[i].Q, toRemove[i].R);
            this.tileRemoved++;
         }
      }
   }

   deleteIslands = () => {

      let keyStrings = this.hexMap.keyStrings();
      let tileGroups = [];

      let neighborKeysInList = (q, r) => {
         let neighbors = this.hexMap.neighborKeys(q, r);
         let filteredNeighbors = [];

         for (let i = 0; i < neighbors.length; i++) {
            if (!keyStrings.includes(this.hexMap.join(neighbors[i].Q, neighbors[i].R))) continue;
            filteredNeighbors.push(neighbors[i]);
         }

         return filteredNeighbors;
      }

      let addNeighbors = (keyString, tileGroup) => {

         tileGroup.add(keyString);

         let keyIndex = keyStrings.indexOf(keyString);
         if (keyIndex != -1) keyStrings.splice(keyIndex, 1);

         let key = this.hexMap.split(keyString);
         let neighbors = neighborKeysInList(key.Q, key.R);

         for (let i = 0; i < neighbors.length; i++) {
            addNeighbors(this.hexMap.join(neighbors[i].Q, neighbors[i].R), tileGroup);
         }
      }

      while (keyStrings.length > 0) {

         let tileGroup = new Set();
         addNeighbors(keyStrings[0], tileGroup);
         tileGroups.push(Array.from(tileGroup));

      }

      let tileGroupLengths = tileGroups.map(tileGroup => tileGroup.length);
      let longestTileGroupIndex = tileGroupLengths.indexOf(Math.max(...tileGroupLengths));
      tileGroups.splice(longestTileGroupIndex, 1);

      let tilesToRemove = [].concat(...tileGroups);

      for (let i = 0; i < tilesToRemove.length; i++) {
         let key = this.hexMap.split(tilesToRemove[i])
         this.hexMap.delete(key.Q, key.R);
      }

   }

}