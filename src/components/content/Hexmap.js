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

   //return all key strings
   keyStringsNullGroup = () => {
      let keyStrings = this.keyStrings();

      let filteredKeyStrings = [];

      for (let i = 0; i < keyStrings.length; i++) {
         let key = this.split(keyStrings[i]);
         if (this.get(key.Q, key.R).group == null) filteredKeyStrings.push(keyStrings[i]);
      }

      return filteredKeyStrings;

   }

   getGroupEdges = (q, r) => {
      let group = this.get(q, r).group;
      let edges = [];

      if (!this.has(q, r - 1) || this.get(q, r - 1).group != group) edges.push('TL');
      if (!this.has(q + 1, r - 1) || this.get(q + 1, r - 1).group != group) edges.push('TR');
      if (!this.has(q + 1, r) || this.get(q + 1, r).group != group) edges.push('R');
      if (!this.has(q, r + 1) || this.get(q, r + 1).group != group) edges.push('BR');
      if (!this.has(q - 1, r + 1) || this.get(q - 1, r + 1).group != group) edges.push('BL');
      if (!this.has(q - 1, r) || this.get(q - 1, r).group != group) edges.push('L');

      return edges;
   }

   getGroupTiles = (group) => {
      let keys = this.keys();
      let filteredKeys = [];

      for(let i=0; i<keys.length; i++){
         if(this.get(keys[i].Q, keys[i].R).group==group) filteredKeys.push(keys[i]);
      }

      return filteredKeys;
   }

   getGroupCenterTiles = (group, excludedTiles) => {
      let keys = this.getGroupTiles(group);
      let filteredKeys = [];

      let numNeighbors = 6;

      while(filteredKeys.length == 0){

         for(let i=0; i<keys.length; i++){

            let neighbors = this.neighborKeys(keys[i].Q, keys[i].R);
   
            if(neighbors.length < numNeighbors) continue;

            if(excludedTiles.includes(this.join(keys[i].Q, keys[i].R))) continue;
   
            let innerNeighbors = 0;
            for(let j=0; j<neighbors.length; j++){
               if(this.get(neighbors[j].Q, neighbors[j].R).group==group) innerNeighbors++;
            }
            if(innerNeighbors < numNeighbors) continue;
   
            filteredKeys.push(keys[i]);
         }

         numNeighbors--;

      }
      

       return filteredKeys;
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

   //returns keys of all neighbors adjacent to (q, r) that have 6 neighbors
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

   //returns keys of all neighbors adjacent to (q, r) that have 4 or less neighbors
   neighborKeysOuter = (q, r) => {

      let neighborKeys = this.neighborKeys(q, r);

      let filteredNeighbors = [];

      for (let i = 0; i < neighborKeys.length; i++) {
         let key = neighborKeys[i];
         if (this.neighborKeys(key.Q, key.R).length > 4) continue;
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

   neighborKeysNull = (q, r) => {

      let neighbors = this.neighborKeys(q, r);

      let filteredNeighbors = [];

      for (let i = 0; i < neighbors.length; i++) {
         if (this.get(neighbors[i].Q, neighbors[i].R).group != null) continue;

         let neighborNeighbors = this.neighborKeys(neighbors[i].Q, neighbors[i].R);
         let groupNeighbors = false;
         for(let j=0; j<neighborNeighbors.length; j++){
            if(this.get(neighborNeighbors[j].Q, neighborNeighbors[j].R).group != null){
               groupNeighbors = true;
               break;
            }
         }

         if(!groupNeighbors) filteredNeighbors.push(neighbors[i]);
      }

      if(filteredNeighbors.length > 0){
         return filteredNeighbors;
      } 

      filteredNeighbors = [];

      for (let i = 0; i < neighbors.length; i++) {
         if (this.get(neighbors[i].Q, neighbors[i].R).group != null) continue;
         filteredNeighbors.push(neighbors[i]);
      }

      return filteredNeighbors;

   }

   //returns a list of groups neighboring (q, r)
   neighborList = (q, r) => {
      let neighbors = new Set();

      if (this.has(q, r - 1) && this.get(q, r - 1).group != null) neighbors.add(this.get(q, r - 1).group);
      if (this.has(q + 1, r - 1) && this.get(q + 1, r - 1).group != null) neighbors.add(this.get(q + 1, r - 1).group);
      if (this.has(q + 1, r) && this.get(q + 1, r).group != null) neighbors.add(this.get(q + 1, r).group);
      if (this.has(q, r + 1) && this.get(q, r + 1).group != null) neighbors.add(this.get(q, r + 1).group);
      if (this.has(q - 1, r + 1) && this.get(q - 1, r + 1).group != null) neighbors.add(this.get(q - 1, r + 1).group);
      if (this.has(q - 1, r) && this.get(q - 1, r).group != null) neighbors.add(this.get(q - 1, r).group);

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
   randomNullGroup = () => {

      let keys = this.keys();
      let arr = [];

      for (let i = 0; i < keys.length; i++) {
         let key = keys[i];
         if (this.get(key.Q, key.R).group != null) continue;
         arr.push(key);
      }

      return arr[Math.floor(Math.random() * arr.length)]

   }

   randomGroupNeighbor = (group) => {
      //get all tiles in group
      let groupTiles = this.getGroupTiles(group);

      //get all null neighbors of tiles
      let groupNeighbors = new Set();

      for(let i=0; i<groupTiles.length; i++){
         let neighbors = this.neighborKeysNull(groupTiles[i].Q, groupTiles[i].R);


         for(let j=0; j<neighbors.length; j++){
            groupNeighbors.add(this.join(neighbors[j].Q, neighbors[j].R));
         }
      }


      let arr = Array.from(groupNeighbors).map(key => this.split(key));


      //return random null neighbor
      return arr[Math.floor(Math.random() * arr.length)];
   }

   randomNullNeighborsNull = () => {
      let keys = this.keys();
      let arr = [];

      for (let i = 0; i < keys.length; i++) {
         let key = keys[i];
         if (this.get(key.Q, key.R).group != null) continue;

         let neighborList = this.neighborList(key.Q, key.R);
         if(neighborList.length > 0) continue;
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

   randomOuterTile = () => {
      let keys = this.keys();
      let arr = [];

      for (let i = 0; i < keys.length; i++) {
         let key = keys[i];
         if (this.neighborKeys(key.Q, key.R).length == 6) continue;
         arr.push(key);
      }

      return arr[Math.floor(Math.random() * arr.length)]
   }

}