

export default class HexGroupMapClass {

   constructor(hexMap, numGroups, numPlayers, VecQ, VecR){
      this.VecQ = VecQ;
      this.VecR = VecR;
      this.numGroups = numGroups
      this.numPlayers = numPlayers
      this.groupMap = new Map();
      this.hexMap = hexMap;
   }

   get = (index) => {
      return this.groupMap.get(index);
   }

   set = (index, obj) => {
      this.groupMap.set(index, obj);
   }

   map = () => {
      return this.groupMap;
   }

   entries = () => {
      return this.groupMap.entries();
   }

   getNumPlayerGroups = (playerNumber) => {
      return [...this.groupMap.entries()].filter(group => group[1].playerNumber == playerNumber).length;
   }

   getPlayerGroups = (playerNumber) => {
      return [...this.groupMap.entries()].filter(group => group[1].playerNumber == playerNumber);
   }

   getGroupEdges = (q, r) => {
      let group = this.hexMap.get(q, r).group;
      let edges = [];

      if (!this.hexMap.has(q, r - 1) || this.hexMap.get(q, r - 1).group != group) edges.push('TL');
      if (!this.hexMap.has(q + 1, r - 1) || this.hexMap.get(q + 1, r - 1).group != group) edges.push('TR');
      if (!this.hexMap.has(q + 1, r) || this.hexMap.get(q + 1, r).group != group) edges.push('R');
      if (!this.hexMap.has(q, r + 1) || this.hexMap.get(q, r + 1).group != group) edges.push('BR');
      if (!this.hexMap.has(q - 1, r + 1) || this.hexMap.get(q - 1, r + 1).group != group) edges.push('BL');
      if (!this.hexMap.has(q - 1, r) || this.hexMap.get(q - 1, r).group != group) edges.push('L');

      return edges;
   }

   

   getGroupTiles = (group) => {
      let keys = this.hexMap.keys();
      let filteredKeys = [];

      for(let i=0; i<keys.length; i++){
         if(this.hexMap.get(keys[i].Q, keys[i].R).group==group) filteredKeys.push(keys[i]);
      }

      return filteredKeys;
   }

   getGroupCenterTiles = (group, excludedTiles) => {
      let keys = this.getGroupTiles(group);
      let filteredKeys = [];

      let numNeighbors = 6;

      while(filteredKeys.length == 0){

         for(let i=0; i<keys.length; i++){

            let neighbors = this.hexMap.neighborKeys(keys[i].Q, keys[i].R);
   
            if(neighbors.length < numNeighbors) continue;

            if(excludedTiles.includes(this.hexMap.join(keys[i].Q, keys[i].R))) continue;
   
            let innerNeighbors = 0;
            for(let j=0; j<neighbors.length; j++){
               if(this.hexMap.get(neighbors[j].Q, neighbors[j].R).group==group) innerNeighbors++;
            }
            if(innerNeighbors < numNeighbors) continue;
   
            filteredKeys.push(keys[i]);
         }

         numNeighbors--;

      }
      

       return filteredKeys;
   }

}