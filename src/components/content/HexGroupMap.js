import HexagonClass from './Hexagon.js'

export default class HexGroupMapClass {

   constructor(ctx, hexMap, stateManager, numGroups, numPlayers, colorMap){
      
      this.numGroups = numGroups
      this.numPlayers = numPlayers
      this.groupMap = new Map();
      this.hexMap = hexMap;
      this.stateManager = stateManager;
      this.colorMap = colorMap

      this.HexagonClass = new HexagonClass(ctx, this.hexMap.size, this.hexMap.squish);
   }

   get = (index) => {
      return this.groupMap.get(index);
   }

   set = (index, obj) => {
      this.groupMap.set(index, obj);
   }

   getMap = () => {
      return this.groupMap;
   }

   setMap = (map) => {
      this.groupMap = map;
   }

   entries = () => {
      return this.groupMap.entries();
   }

   setTiles = (state, group) => {

      let tiles = this.getGroupTiles(group)

      switch(state){
         case 'attacker':
            for(let i=0; i<tiles.length; i++){
               this.hexMap.set(tiles[i].Q, tiles[i].R, {
                  group: group,
                  color: 'snow'
               })
            }
            break;
         case 'defender':
            for(let i=0; i<tiles.length; i++){
               this.hexMap.set(tiles[i].Q, tiles[i].R, {
                  group: group,
                  color: 'slateGrey'
               })
            }
            break;

         default:
            for(let i=0; i<tiles.length; i++){
               this.hexMap.set(tiles[i].Q, tiles[i].R, {
                  group: group,
                  color: this.colorMap[this.get(group).playerNumber]
               })
            }
            break;
      }

      
   }

   adjacentGroups = (group1, group2) => {
      let group1Tiles = this.getGroupTiles(group1);
      let group2Tiles = this.getGroupTiles(group2);

      for (let i = 0; i < group1Tiles.length; i++) {
         let neighbors = this.hexMap.neighborKeys(group1Tiles[i].Q, group1Tiles[i].R);

         for (let j = 0; j < neighbors.length; j++) {
            let neighbor = neighbors[j];

            for (let k = 0; k < group2Tiles.length; k++) {
               if (neighbor.Q == group2Tiles[k].Q && neighbor.R == group2Tiles[k].R) return true;
            }
         }
      }
      return false;
   }

   drawGroupEdges = () => {
      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.hexMap.VecQ.x * keyObj.Q + this.hexMap.VecR.x * keyObj.R;
         let yOffset = this.hexMap.VecQ.y * keyObj.Q * this.hexMap.squish + this.hexMap.VecR.y * keyObj.R * this.hexMap.squish;

         let edges = [];
         if (value.group != null) edges = this.getGroupEdges(keyObj.Q, keyObj.R);

         this.HexagonClass.drawEdges(this.hexMap.X + xOffset, this.hexMap.Y + yOffset, edges, Math.floor(this.hexMap.size / 5.5), "pixel")
      }

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.hexMap.VecQ.x * keyObj.Q + this.hexMap.VecR.x * keyObj.R;
         let yOffset = this.hexMap.VecQ.y * keyObj.Q * this.hexMap.squish + this.hexMap.VecR.y * keyObj.R * this.hexMap.squish;

         let edges = [];
         if (value.group != null) edges = this.getGroupEdges(keyObj.Q, keyObj.R);

         if (value.group == this.stateManager.gameState.defender) this.HexagonClass.drawEdges(this.hexMap.X + xOffset, this.hexMap.Y + yOffset, edges, Math.floor(this.hexMap.size / 5.5), "pixel", "#ff0000")

      }

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.hexMap.VecQ.x * keyObj.Q + this.hexMap.VecR.x * keyObj.R;
         let yOffset = this.hexMap.VecQ.y * keyObj.Q * this.hexMap.squish + this.hexMap.VecR.y * keyObj.R * this.hexMap.squish;

         let edges = [];
         if (value.group != null) edges = this.getGroupEdges(keyObj.Q, keyObj.R);

         if (value.group == this.stateManager.gameState.attacker) this.HexagonClass.drawEdges(this.hexMap.X + xOffset, this.hexMap.Y + yOffset, edges, Math.floor(this.hexMap.size / 5.5), "pixel", "#ffd900")

      }

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