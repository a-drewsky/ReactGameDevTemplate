import HexmapClass from './Hexmap.js';

export default class HexGroupMapClass extends HexmapClass {

   constructor(x, y, size, squish, stateManager, numGroups, numPlayers, colorMap){
      
      super(x, y, size, squish);

      this.numGroups = numGroups;
      this.numPlayers = numPlayers;
      this.hexGroupMap = new Map();
      this.stateManager = stateManager;
      this.colorMap = colorMap;
   }

   //SET METHODS

   setGroup = (index, obj) => {
      this.hexGroupMap.set(index, obj);
   }

   setGroupMap = (map) => {
      this.hexGroupMap = map;
   }

   //END SET METHODS


   //GET METHODS

   getGroup = (index) => {
      return this.hexGroupMap.get(index);
   }

   getGroupMap = () => {
      return this.hexGroupMap;
   }

   groupMapEntries = () => {
      return this.hexGroupMap.entries();
   }

   getPlayerGroups = (playerNumber) => {
      return [...this.hexGroupMap.entries()].filter(group => group[1].playerNumber == playerNumber);
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

   //END GET METHODS

   
   //BOOL METHODS

   adjacentGroups = (group1, group2) => {
      let group1Tiles = this.getGroupTiles(group1);
      let group2Tiles = this.getGroupTiles(group2);

      for (let i = 0; i < group1Tiles.length; i++) {
         let neighbors = this.neighborKeys(group1Tiles[i].Q, group1Tiles[i].R);

         for (let j = 0; j < neighbors.length; j++) {
            let neighbor = neighbors[j];

            for (let k = 0; k < group2Tiles.length; k++) {
               if (neighbor.Q == group2Tiles[k].Q && neighbor.R == group2Tiles[k].R) return true;
            }
         }
      }
      return false;
   }

   //END BOOL METHODS



   setTiles = (state, group) => {

      let tiles = this.getGroupTiles(group)

      switch(state){
         case 'attacker':
            for(let i=0; i<tiles.length; i++){
               this.set(tiles[i].Q, tiles[i].R, {
                  group: group,
                  color: 'snow'
               })
            }
            break;
         case 'defender':
            for(let i=0; i<tiles.length; i++){
               this.set(tiles[i].Q, tiles[i].R, {
                  group: group,
                  color: 'slateGrey'
               })
            }
            break;
         default:
            for(let i=0; i<tiles.length; i++){
               this.set(tiles[i].Q, tiles[i].R, {
                  group: group,
                  color: this.colorMap[this.getGroup(group).playerNumber]
               })
            }
            break;
      }

      
   }

}