import noise from "../../utilities/perlin";

export default class ExampleGameObjectBuilderClass {

   constructor(exampleGameObject, size) {

      this.map = map;

      this.outerMinGen = (mapSize == "small" ? 2 : mapSize == "medium" ? 4 : 8)
      this.outerMaxGen = (mapSize == "small" ? 4 : mapSize == "medium" ? 8 : 12)
      this.outerRecurssionBoundry = (mapSize == "small" ? 0.85 : mapSize == "medium" ? 0.9 : 0.95)
      this.outerMinRecurssionRoll = (mapSize == "small" ? 0.4 : mapSize == "medium" ? 0.3 : 0.2)
      this.outerRecurssionChance = (mapSize == "small" ? 0.85 : mapSize == "medium" ? 0.9 : 0.95)

      this.innerMinGen = (mapSize == "small" ? 4 : mapSize == "medium" ? 6 : 8)
      this.innerMaxGen = (mapSize == "small" ? 5 : mapSize == "medium" ? 8 : 12)
      this.innerRecurssionBoundry = (mapSize == "small" ? 0.85 : mapSize == "medium" ? 0.9 : 0.95)
      this.innerMinRecurssionRoll = (mapSize == "small" ? 0.15 : mapSize == "medium" ? 0.125 : 0.1);
      this.innerRecurssionChance = (mapSize == "small" ? 0.8 : mapSize == "medium" ? 0.95 : 0.9)

      this.outerMaxTilesRemovedPercent = (mapSize == "small" ? 0.25 : mapSize == "medium" ? 0.3 : 0.35)
      this.totalMaxTilesRemovedPercent = (mapSize == "small" ? 0.4 : mapSize == "medium" ? 0.45 : 0.5)

      this.noiseSeedMultiplier = 10
      this.noiseFluctuation = (mapSize == "small" ? 3 : mapSize == "medium" ? 4 : 5)
      this.noiseThreshold = 0.4
      
      this.maxTilesRemoved = null;
      this.tileRemoved = 0;
   }

   generateMap = (Qgen, Rgen) => {

      this.maxTilesRemoved = Qgen * Rgen * this.totalMaxTilesRemovedPercent;

      for (let r = 0; r < Rgen; r++) {
         for (let q = -1 * Math.floor(r / 2); q < Qgen - Math.floor(r / 2); q++) {
            this.map.set(q, r, {
               group: null
            })
         }
      }
   }

   removeNoiseTiles = () => {

      let seed = Math.random() * this.noiseSeedMultiplier;

      for (let [key, value] of this.map.map()) {

         let keyObj = this.map.split(key);

         let tileNoise = noise(seed+keyObj.Q/this.noiseFluctuation, seed+keyObj.R/this.noiseFluctuation);

         if(tileNoise < this.noiseThreshold) this.map.delete(keyObj.Q, keyObj.R);

      }
      

   }

   removeOuterTiles = () => {
      let numOuterTileGroups = this.outerMinGen + Math.floor(Math.random() * (this.outerMaxGen - this.outerMinGen));
      let outerMaxTilesRemoved = Math.floor(this.map.mapSize() * this.outerMaxTilesRemovedPercent);
      for (let i = 0; i < numOuterTileGroups; i++) {
         let selected = this.map.randomOuterTile();

         this.map.delete(selected.Q, selected.R);
         this.tileRemoved++;

         let neighbors = this.map.neighborKeysOuter(selected.Q, selected.R);

         let recurssionBoundry = this.outerRecurssionBoundry;
         let recurssionRoll = Math.max(Math.random(), this.outerMinRecurssionRoll);

         while (recurssionBoundry > recurssionRoll && this.tileRemoved < outerMaxTilesRemoved) {

            if (neighbors.length == 0) break;

            selected = neighbors[Math.floor(Math.random() * neighbors.length)];

            this.map.delete(selected.Q, selected.R);
            this.tileRemoved++;

            neighbors = this.map.neighborKeysOuter(selected.Q, selected.R);

            recurssionBoundry *= this.outerRecurssionChance;
         }

      }
   }

   removeInnerTiles = () => {
      let numInnerTileGroups = this.innerMinGen + Math.floor(Math.random() * (this.innerMaxGen - this.innerMinGen));
      let totalMaxTilesRemoved = Math.floor(this.map.mapSize() * this.totalMaxTilesRemovedPercent);
      for (let i = 0; i < numInnerTileGroups; i++) {

         //Select a random inner tile
         let selected = this.map.randomInnerTile();

         let toRemove = [selected];

         let neighbors = this.map.neighborKeysInner(selected.Q, selected.R);

         let recurssionBoundry = this.innerRecurssionBoundry;
         let recurssionRoll = Math.max(Math.random(), this.innerMinRecurssionRoll);

         while (recurssionBoundry > recurssionRoll) {

            if (neighbors.length == 0) break;

            selected = neighbors[Math.floor(Math.random() * neighbors.length)];

            toRemove.push(selected);

            neighbors = this.map.neighborKeysInner(selected.Q, selected.R);

            recurssionBoundry *= this.innerRecurssionChance;
         }

         for (let i = 0; i < toRemove.length; i++) {

            if (this.tileRemoved > totalMaxTilesRemoved) break;

            this.map.delete(toRemove[i].Q, toRemove[i].R);
            this.tileRemoved++;
         }
      }
   }

   deleteIslands = () => {

      let keyStrings = this.map.keyStrings();
      let tileGroups = [];

      let neighborKeysInList = (q, r) => {
         let neighbors = this.map.neighborKeys(q, r);
         let filteredNeighbors = [];

         for (let i = 0; i < neighbors.length; i++) {
            if (!keyStrings.includes(this.map.join(neighbors[i].Q, neighbors[i].R))) continue;
            filteredNeighbors.push(neighbors[i]);
         }

         return filteredNeighbors;
      }

      let addNeighbors = (keyString, tileGroup) => {

         tileGroup.add(keyString);

         let keyIndex = keyStrings.indexOf(keyString);
         if (keyIndex != -1) keyStrings.splice(keyIndex, 1);

         let key = this.map.split(keyString);
         let neighbors = neighborKeysInList(key.Q, key.R);

         for (let i = 0; i < neighbors.length; i++) {
            addNeighbors(this.map.join(neighbors[i].Q, neighbors[i].R), tileGroup);
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
         let key = this.map.split(tilesToRemove[i])
         this.map.delete(key.Q, key.R);
      }

   }

   
   build = (mapGeneration, Q, R) => {

      if (mapGeneration == "noise") {
            this.generateMap(Q, R);
            this.removeNoiseTiles();
            this.deleteIslands();
      } else if (mapGeneration == "algorithmic") {
            this.generateMap(Q, R);
            this.removeOuterTiles();
            this.removeInnerTiles();
            this.deleteIslands();
      } else {
            this.generateMap(Q, R);
      }
   }

}