import HexagonClass from './Hexagon.js'
import HexmapClass from './Hexmap.js';
import HexgridBuilderClass from './HexmapBuilder.js';
import HexGroup from './HexGroup.js';

export default class hexGridClass {

   constructor(ctx, canvasScalarSize, canvasW, canvasH, mapSize, numPlayers, mapGeneration) {

      this.ctx = ctx
      this.size = (mapSize == "small" ? canvasScalarSize * 4.5 : mapSize == "medium" ? canvasScalarSize * 3.5 : canvasScalarSize * 2.5)
      this.numGroups = (mapSize == "small" ? 10 : mapSize == "medium" ? 20 : 30)
      this.numPlayers = numPlayers
      this.mapGeneration = mapGeneration
      this.Q = Math.floor((canvasW / 2 / (Math.sqrt(3) * this.size)) - 1);
      this.R = Math.floor((canvasH / 2 / (3 / 2 * this.size)) - 1);
      this.X = (canvasW / 2 - (this.Q * Math.sqrt(3) * this.size) - Math.sqrt(3) * this.size / 4);
      this.Y = (canvasH / 2 - (this.R * (3 / 2) * this.size) - this.size / 4);
      this.VecQ = { x: Math.sqrt(3) * this.size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * this.size, y: 3 / 2 * this.size }

      this.hexMap = new HexmapClass();
      this.HexagonClass = new HexagonClass(ctx, this.size);
      this.hexMapBuilder = new HexgridBuilderClass(this.hexMap, mapSize);
      this.groupMap = [];

      this.colorMap = ['Coral', 'BlueViolet', 'DarkSeaGreen', 'FireBrick', 'IndianRed', 'LightPink', 'LightGreen', 'MediumPurple', 'Orchid', 'LightCyan']

   }

   closestTile = (pos, posList) => {
      let distances = [];
      for (let i = 0; i < posList.length; i++) {
         distances[i] = Math.sqrt(Math.pow(pos.X - posList[i].X, 2) + Math.pow(pos.Y - posList[i].Y, 2));
      }

      let shortest = Math.min(...distances);

      let index = distances.indexOf(shortest);


      return posList[index];

   }

   assignDice = () => {
      for (let i = 0; i < this.numPlayers; i++) {
         let numDice = this.numGroups / this.numPlayers * 3;
         let playerGroups = this.groupMap.filter(group => group.player == i);

         numDice -= playerGroups.length;

         for (let j = 0; j < numDice; j++) {
            let selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];
            selectedGroup.dice++;
         }

      }
   }

   assignGroups = () => {
      for (let i = 0; i < this.numGroups; i++) {

         let tiles = this.hexMap.getGroupTiles(i);
         let tilePositions = [];
         let averagePos = {
            X: 0,
            Y: 0
         }

         for (let j = 0; j < tiles.length; j++) {
            let tilePos = {
               X: this.VecQ.x * tiles[j].Q + this.VecR.x * tiles[j].R,
               Y: this.VecQ.y * tiles[j].Q + this.VecR.y * tiles[j].R
            }
            tilePositions[j] = tilePos;
            averagePos.X += tilePos.X;
            averagePos.Y += tilePos.Y;
         }

         averagePos.X /= tilePositions.length;
         averagePos.Y /= tilePositions.length;

         let groupDrawPos = this.closestTile(averagePos, tilePositions);
         this.groupMap[i] = new HexGroup(i % this.numPlayers, groupDrawPos);
      }
   }

   createHexMap = () => {

      let groupsCreated = -1;

      if (this.mapGeneration == "noise") {
         while (groupsCreated == -1) {
            this.hexMapBuilder.generateMap(this.Q, this.R);
            this.hexMapBuilder.removeNoiseTiles();
            this.hexMapBuilder.deleteIslands();
            groupsCreated = this.hexMapBuilder.createGroups(this.numGroups);
         }
      } else if(this.mapGeneration == "algorithmic") {
         while (groupsCreated == -1) {
            this.hexMapBuilder.generateMap(this.Q, this.R);
            this.hexMapBuilder.removeOuterTiles();
            this.hexMapBuilder.removeInnerTiles();
            this.hexMapBuilder.deleteIslands();
            groupsCreated = this.hexMapBuilder.createGroups(this.numGroups);
         }
      } else {
         while (groupsCreated == -1) {
            this.hexMapBuilder.generateMap(this.Q, this.R);
            groupsCreated = this.hexMapBuilder.createGroups(this.numGroups);
         }
      }

      this.assignGroups();
      this.assignDice();

   }

   drawHexGrid = () => {

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q + this.VecR.y * keyObj.R;

         this.HexagonClass.drawHexagon(this.X + xOffset, this.Y + yOffset, this.colorMap[this.groupMap[value.group].player]);
      }

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q + this.VecR.y * keyObj.R;

         let edges = [];
         if (value.group != null) edges = this.hexMap.getGroupEdges(keyObj.Q, keyObj.R);

         this.HexagonClass.drawEdges(this.X + xOffset, this.Y + yOffset, edges)
      }

      for (let i = 0; i < this.groupMap.length; i++) {
         this.ctx.fillStyle = 'lightGrey'
         this.ctx.fillRect(this.X + this.groupMap[i].drawPos.X - this.size/3, this.Y + this.groupMap[i].drawPos.Y - this.size/3, this.size/1.5, this.size/1.5);
         this.ctx.strokeRect(this.X + this.groupMap[i].drawPos.X - this.size/3, this.Y + this.groupMap[i].drawPos.Y - this.size/3, this.size/1.5, this.size/1.5);
         this.ctx.fillStyle = 'black'
         this.ctx.fillText(this.groupMap[i].dice, this.X + this.groupMap[i].drawPos.X, this.Y + this.groupMap[i].drawPos.Y + 1);
      }
   }

}