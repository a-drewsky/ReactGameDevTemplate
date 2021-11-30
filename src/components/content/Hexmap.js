export default class HexmapClass {

   constructor() {
      this.hexMap = new Map();
   }

   //Set an entry in the hexmap (void)
   set = (q, r, obj) => {
      this.hexMap.set(q + ',' + r, obj);
   }

   //get an entry in the hexmap (returns a hex tile object)
   get = (q, r) => {
      return this.hexMap.get(q + "," + r);
   }

   //delete an entry in the hexmap (void)
   delete = (q, r) => {
      this.hexMap.delete(q + "," + r);
   }

   //check if hexmap has an entry (returns a boolean)
   has = (q, r) => {
      return this.hexMap.has([q, r].join(','));
   }

   //converts key string to key object (returns a key object)
   split = (key) => {
      let nums = key.split(',').map(Number);
      return {
         Q: nums[0],
         R: nums[1]
      }
   }

   //converts a key object to a key string (returns a key string)
   join = (q, r) => {
      return [q, r].join(',')
   }

   //returns the hexmap
   map = () => {
      return this.hexMap
   }

   //returns the number of entries in the hexmap
   size = () => {
      return this.hexMap.size
   }

   //returns all keys for the hexmap
   keys = () => {
      return [...this.hexMap.keys()].map(key => this.split(key))
   }

   //return all key strings
   keyStrings = () => {
      return [...this.hexMap.keys()]
   }

   //returns keys of all neighbors adjacent to (q, r)
   neighborKeys = (q, r) => {
      let neighbors = [];

      if (this.has(q, r - 1)) neighbors.push(this.join(q, r - 1));
      if (this.has(q + 1, r - 1)) neighbors.push(this.join(q + 1, r - 1));
      if (this.has(q + 1, r)) neighbors.push(this.join(q + 1, r));
      if (this.has(q, r + 1)) neighbors.push(this.join(q, r + 1));
      if (this.has(q - 1, r + 1)) neighbors.push(this.join(q - 1, r + 1));
      if (this.has(q - 1, r)) neighbors.push(this.join(q - 1, r));

      return neighbors.map(key => this.split(key));
   }

   //returns keys of all neighbors adjacent to (q, r) that are not in group {group} or adject to a tile with group {group}
   neighborKeysInner = (q, r) => {

      let neighborKeys = this.neighborKeys(q, r);

      let filteredNeighbors = [];

      for (let i = 0; i < neighborKeys.length; i++) {
         let key = neighborKeys[i];
         if (this.neighborKeys(key.Q, key.R).length != 6) continue;
         filteredNeighbors.push(key);
      }

      return filteredNeighbors;

   }

   //returns keys of all neighbors adjacent to (q, r) that are not in adjacent to a map edge
   neighborKeysFiltered = (q, r, group) => {

      let neighbors = this.neighborKeys(q, r);

      let filteredNeighbors = [];

      for (let i = 0; i < neighbors.length; i++) {
         if (this.get(neighbors[i].Q, neighbors[i].R).group == group) continue;
         filteredNeighbors.push(neighbors[i]);
      }

      return filteredNeighbors;

   }

   //returns a list of groups neighboring (q, r)
   neighborList = (q, r) => {
      let neighbors = new Set();

      if (this.has(q, r - 1)) neighbors.add(this.get(q, r - 1).group);
      if (this.has(q + 1, r - 1)) neighbors.add(this.get(q + 1, r - 1).group);
      if (this.has(q + 1, r)) neighbors.add(this.get(q + 1, r).group);
      if (this.has(q, r + 1)) neighbors.add(this.get(q, r + 1).group);
      if (this.has(q - 1, r + 1)) neighbors.add(this.get(q - 1, r + 1).group);
      if (this.has(q - 1, r)) neighbors.add(this.get(q - 1, r).group);

      return Array.from(neighbors);
   }

   //returns a list of groups neighboring (q, r) except for the group of (exQ, exR)
   neighborListExclude = (q, r, exQ, exR) => {
      let neighbors = new Set();

      if ((q != exQ || r - 1 != exR) && this.has(q, r - 1)) neighbors.add(this.get(q, r - 1).group);
      if ((q + 1 != exQ || r - 1 != exR) && this.has(q + 1, r - 1)) neighbors.add(this.get(q + 1, r - 1).group);
      if ((q + 1 != exQ || r != exR) && this.has(q + 1, r)) neighbors.add(this.get(q + 1, r).group);
      if ((q != exQ || r + 1 != exR) && this.has(q, r + 1)) neighbors.add(this.get(q, r + 1).group);
      if ((q - 1 != exQ || r + 1 != exR) && this.has(q - 1, r + 1)) neighbors.add(this.get(q - 1, r + 1).group);
      if ((q - 1 != exQ || r != exR) && this.has(q - 1, r)) neighbors.add(this.get(q - 1, r).group);

      return Array.from(neighbors);
   }

   //returns a random key, filtering out all tiles with selected group and its neighbors except for the neighbors
   randomFilterOut = (group) => {

      let keys = this.keys();
      let arr = [];

      for (let i = 0; i < keys.length; i++) {
         let key = keys[i];
         if (this.get(key.Q, key.R).group == group) continue;
         if (this.neighborList(key.Q, key.R).includes(group)) continue;
         arr.push(key);
      }

      return arr[Math.floor(Math.random() * arr.length)]

   }

   randomInnerTile = () => {
      let keys = this.keys();
      let arr = [];

      for (let i = 0; i < keys.length; i++) {
         let key = keys[i];
         if (this.neighborKeys(key.Q, key.R).length != 6) continue;
         arr.push(key);
      }

      return arr[Math.floor(Math.random() * arr.length)]

   }

   deleteIslands = () => {

      let keyStrings = this.keyStrings();
      let tileGroups = [];

      let neighborKeysInList = (q, r) => {
         let neighbors = this.neighborKeys(q, r);
         let filteredNeighbors = [];
   
         for (let i = 0; i < neighbors.length; i++) {
            if (!keyStrings.includes(this.join(neighbors[i].Q, neighbors[i].R))) continue;
            filteredNeighbors.push(neighbors[i]);
         }
   
         return filteredNeighbors;
      }

      let addNeighbors = (keyString, tileGroup) => {

         tileGroup.add(keyString);

         let keyIndex = keyStrings.indexOf(keyString);
         if(keyIndex != -1) keyStrings.splice(keyIndex, 1);

         let key = this.split(keyString);
         let neighbors = neighborKeysInList(key.Q, key.R);

         for(let i=0; i<neighbors.length; i++){
            addNeighbors(this.join(neighbors[i].Q, neighbors[i].R), tileGroup);
         }
      }

      while(keyStrings.length > 0){

         let tileGroup = new Set();
         addNeighbors(keyStrings[0], tileGroup);
         tileGroups.push(Array.from(tileGroup));

      }


      let tileGroupLengths = tileGroups.map(tileGroup => tileGroup.length);
      let longestTileGroupIndex = tileGroupLengths.indexOf(Math.max(...tileGroupLengths));
      tileGroups.splice(longestTileGroupIndex, 1);

      let tilesToRemove = [].concat(...tileGroups);

      for(let i=0; i<tilesToRemove.length; i++){
         this.hexMap.delete(tilesToRemove[i]);
      }

   }

}