import HexagonClass from './Hexagon.js'
import HexmapClass from './Hexmap.js';
import HexgridBuilderClass from './HexmapBuilder.js';
import HexGroup from './HexGroup.js';

import testImage from './testImage10x.png';

export default class hexGridClass {

   constructor(ctx, canvasScalarSize, canvasW, canvasH, mapSize, numPlayers, mapGeneration) {

      this.ctx = ctx
      this.canvasDims = {
         width: canvasW,
         height: canvasH
      }
      this.size = (mapSize == "small" ? canvasScalarSize * 9 : mapSize == "medium" ? canvasScalarSize * 7 : canvasScalarSize * 5)
      this.squish = 0.75;
      this.numGroups = (mapSize == "small" ? 10 : mapSize == "medium" ? 20 : 30)
      this.numPlayers = numPlayers
      this.mapGeneration = mapGeneration
      this.mapPos = 0.8
      this.Q = Math.floor((canvasW / (Math.sqrt(3) * this.size)) - 1);
      this.R = Math.floor((canvasH / (3 / 2 * this.size)) - 1);
      this.X = (canvasW - (this.Q * Math.sqrt(3) * this.size) - Math.sqrt(3) * this.size / (mapSize == "small" ? 1.5 : mapSize == "medium" ? 2 : 4));
      this.Y = (canvasH - (this.R * (3 / 2) * this.size * this.squish/this.mapPos) - this.size / 4);
      this.VecQ = { x: Math.sqrt(3) * this.size, y: 0 }
      this.VecR = { x: Math.sqrt(3) / 2 * this.size, y: 3 / 2 * this.size }

      this.hexMap = new HexmapClass();
      this.HexagonClass = new HexagonClass(ctx, this.size, this.squish);
      this.hexMapBuilder = new HexgridBuilderClass(this.hexMap, mapSize);
      this.groupMap = [];

      this.colorMap = ['FireBrick', 'DarkSeaGreen', 'BlueViolet', 'Coral', 'IndianRed', 'LightPink', 'LightGreen', 'MediumPurple', 'Orchid', 'LightCyan']


      this.testImage = new Image();
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

            while (selectedGroup.dice > 8) selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

            selectedGroup.dice++;
         }

      }
   }

   getTakenGroupPositions = () => {

      let positions = [];

      for(let i=0; i<this.groupMap.length; i++){
         let groupHexPos = this.groupMap[i].drawHexPos;

         positions.push(this.hexMap.join(groupHexPos.Q, groupHexPos.R));

         positions.push(this.hexMap.join(groupHexPos.Q, groupHexPos.R-1));
         positions.push(this.hexMap.join(groupHexPos.Q+1, groupHexPos.R-1));
         positions.push(this.hexMap.join(groupHexPos.Q+1, groupHexPos.R));
         positions.push(this.hexMap.join(groupHexPos.Q, groupHexPos.R+1));
         positions.push(this.hexMap.join(groupHexPos.Q-1, groupHexPos.R+1));
         positions.push(this.hexMap.join(groupHexPos.Q-1, groupHexPos.R));
         
         positions.push(this.hexMap.join(groupHexPos.Q+1, groupHexPos.R-2));
         positions.push(this.hexMap.join(groupHexPos.Q-1, groupHexPos.R+2));

      }

      return positions;
   }

   assignGroups = () => {
      for (let i = 0; i < this.numGroups; i++) {

         let takenPositions = this.getTakenGroupPositions();

         console.log(takenPositions)

         let tiles = this.hexMap.getGroupCenterTiles(i, takenPositions);

         let tilePositions = [];
         let tileHexPositions = [];
         let averagePos = {
            X: 0,
            Y: 0
         }

         for (let j = 0; j < tiles.length; j++) {
            let tilePos = {
               X: this.VecQ.x * tiles[j].Q + this.VecR.x * tiles[j].R,
               Y: this.VecQ.y * tiles[j].Q + this.VecR.y * tiles[j].R
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

         let groupDrawPos = this.closestTile(averagePos, tilePositions);
         let groupDrawHexPos = tileHexPositions[tilePositions.indexOf(groupDrawPos)];
         this.groupMap[i] = new HexGroup(i % this.numPlayers, groupDrawPos, groupDrawHexPos);
      }

      this.groupMap.sort((a, b) => a.drawPos.Y - b.drawPos.Y);

   }

   createHexMap = () => {

      this.testImage.src = testImage;



      let groupsCreated = -1;

      if (this.mapGeneration == "noise") {
         while (groupsCreated == -1) {
            this.hexMapBuilder.generateMap(this.Q, this.R);
            this.hexMapBuilder.removeNoiseTiles();
            this.hexMapBuilder.deleteIslands();
            groupsCreated = this.hexMapBuilder.createGroups(this.numGroups);
         }
      } else if (this.mapGeneration == "algorithmic") {
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

      this.ctx.clearRect(0, 0, this.canvasDims.width, this.canvasDims.height);

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q * this.squish + this.VecR.y * keyObj.R * this.squish;

         this.HexagonClass.drawHexagon(this.X + xOffset, this.Y + yOffset, this.colorMap[this.groupMap[value.group].player]);
      }

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.VecQ.x * keyObj.Q + this.VecR.x * keyObj.R;
         let yOffset = this.VecQ.y * keyObj.Q * this.squish + this.VecR.y * keyObj.R * this.squish;

         let edges = [];
         if (value.group != null) edges = this.hexMap.getGroupEdges(keyObj.Q, keyObj.R);

         this.HexagonClass.drawEdges(this.X + xOffset, this.Y + yOffset, edges, Math.floor(this.size/5.5), "pixel")
      }

      for (let i = 0; i < this.groupMap.length; i++) {

         let diceSize = this.size * 1.5

         this.ctx.fillStyle = 'rgba(25,25,25,0.8)';
         this.ctx.beginPath();
         this.ctx.ellipse(this.X + this.groupMap[i].drawPos.X + diceSize * 0.25, this.Y + this.groupMap[i].drawPos.Y * this.squish + diceSize / 8, diceSize / 2, diceSize / 4, Math.PI, Math.PI / 2, Math.PI * 2);
         this.ctx.fill();

         for (let j = 4; j < 8; j++) {
            if(this.groupMap[i].dice > j) this.ctx.drawImage(this.testImage, this.X + this.groupMap[i].drawPos.X - diceSize * 1.35, this.Y + this.groupMap[i].drawPos.Y * this.squish - diceSize * (1 + (j-4)*0.55), diceSize, diceSize);
            else break;
         }

         for (let j = 0; j < 4; j++) {
            if(this.groupMap[i].dice > j) this.ctx.drawImage(this.testImage, this.X + this.groupMap[i].drawPos.X - diceSize * 0.6, this.Y + this.groupMap[i].drawPos.Y * this.squish - diceSize * (0.75 + j*0.55), diceSize, diceSize);
         }
      }
   }

}