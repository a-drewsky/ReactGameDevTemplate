export default class HexmapClass {

   constructor(){
      this.hexMap = new Map();
   }

   set = (q, r, obj) => {
      this.hexMap.set(q + ',' + r, obj);
   }

   get = (q, r) => {
      return this.hexMap.get(q + "," + r);
   }

   delete = (q, r) => {
      this.hexMap.delete(q + "," + r);
   }

   has = (q, r) => {
      return this.hexMap.has([q, r].join(','));
   }

   split = (key) => {
      let nums = key.split(',').map(Number);
      return {
         Q: nums[0],
         R: nums[1]
      }
   }

   join = (q, r) => {
      return [q, r].join(',')
   }

   map = () => {
      return this.hexMap
   }

   size = () => {
      return this.hexMap.size
   }

   keys = () => {
      return [...this.hexMap.keys()].map(key => this.split(key))
   }

   neighborKeys = (q, r) => {
      let neighbors = [];

      if(this.has(q, r-1)) neighbors.push(this.join(q, r-1));
      if(this.has(q+1, r-1)) neighbors.push(this.join(q+1, r-1));
      if(this.has(q+1, r)) neighbors.push(this.join(q+1, r));
      if(this.has(q, r+1)) neighbors.push(this.join(q, r+1));
      if(this.has(q-1, r+1)) neighbors.push(this.join(q-1, r+1));
      if(this.has(q-1, r)) neighbors.push(this.join(q-1, r));

      return neighbors.map(key => this.split(key));
   }

   //return list of neighboring groups
   neighborList = (q, r) => {
      let neighbors = new Set();

      if(this.has(q, r-1)) neighbors.add(this.get(q, r-1).group);
      if(this.has(q+1, r-1)) neighbors.add(this.get(q+1, r-1).group);
      if(this.has(q+1, r)) neighbors.add(this.get(q+1, r).group);
      if(this.has(q, r+1)) neighbors.add(this.get(q, r+1).group);
      if(this.has(q-1, r+1)) neighbors.add(this.get(q-1, r+1).group);
      if(this.has(q-1, r)) neighbors.add(this.get(q-1, r).group);

      return Array.from(neighbors);
   }

   //return list of neighboring groups except for (exQ, exR)
   neighborListExclude = (q, r, exQ, exR) => {
      let neighbors = new Set();

      if((q!=exQ || r-1!=exR) && this.has(q, r-1)) neighbors.add(this.get(q, r-1).group);
      if((q+1!=exQ || r-1!=exR) && this.has(q+1, r-1)) neighbors.add(this.get(q+1, r-1).group);
      if((q+1!=exQ || r!=exR) && this.has(q+1, r)) neighbors.add(this.get(q+1, r).group);
      if((q!=exQ || r+1!=exR) && this.has(q, r+1)) neighbors.add(this.get(q, r+1).group);
      if((q-1!=exQ || r+1!=exR) && this.has(q-1, r+1)) neighbors.add(this.get(q-1, r+1).group);
      if((q-1!=exQ || r!=exR) && this.has(q-1, r)) neighbors.add(this.get(q-1, r).group);

      return Array.from(neighbors);
   }

   //return all neighbors that are not adjacent to a tile of {group}
   neighborKeysFiltered = (q, r, group) => {

      let neighbors = this.neighborKeys(q, r);

      let filteredNeighbors = [];

      for(let i=0; i<neighbors.length; i++){
         if(this.get(neighbors[i].Q, neighbors[i].R).group == group) continue;
         if(this.neighborListExclude(neighbors[i].Q, neighbors[i].R, q, r).includes(group)) continue;
         filteredNeighbors.push(neighbors[i]);
      }

      return filteredNeighbors;

   }

   //filter out all tiles with selected group and its neighbors except for the neighbors of (Q, R)
   randomFilterOut = (group) => {

     let keys = this.keys();
      let arr = [];

      for(let i=0; i<keys.length; i++){
         let key = keys[i];
         if(this.get(key.Q, key.R).group == group) continue;
         if(this.neighborList(key.Q, key.R).includes(group)) continue;
         arr.push(key);
      }

      return arr[Math.floor(Math.random() * arr.length)]

   }

}