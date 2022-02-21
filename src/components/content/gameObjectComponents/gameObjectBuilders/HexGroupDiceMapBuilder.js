import HexGroupMapBuilderClass from "./HexGroupMapBuilder";

export default class HexGroupDiceMapBuilderClass extends HexGroupMapBuilderClass {

   constructor(hexGroupDiceMap, mapSize){

      super(hexGroupDiceMap, mapSize)

   }

   assignDice = () => {
      for (let i = 0; i < this.hexGroupMap.numPlayers; i++) {
         let numDice = this.hexGroupMap.numGroups / this.hexGroupMap.numPlayers * 3;
         let playerGroups = this.hexGroupMap.getPlayerGroups(i);

         numDice -= playerGroups.length;

         for (let j = 0; j < numDice; j++) {
            let selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

            if (playerGroups.filter(group => group[1].dice < 8).length == 0) break;
            while (selectedGroup[1].dice >= 8) selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

            selectedGroup[1].dice++;
            this.hexGroupMap.setGroup(selectedGroup[0], selectedGroup[1]);
         }

      }
   }

   build = (mapGeneration, Q, R, numGroups) => {
      let groupsCreated = -1;

      if (mapGeneration == "noise") {
         while (groupsCreated == -1) {
            this.generateMap(Q, R);
            this.removeNoiseTiles();
            this.deleteIslands();
            groupsCreated = this.createGroups(numGroups);
         }
      } else if (mapGeneration == "algorithmic") {
         while (groupsCreated == -1) {
            this.generateMap(Q, R);
            this.removeOuterTiles();
            this.removeInnerTiles();
            this.deleteIslands();
            groupsCreated = this.createGroups(numGroups);
         }
      } else {
         while (groupsCreated == -1) {
            this.generateMap(Q, R);
            groupsCreated = this.createGroups(numGroups);
         }
      }

      this.assignGroups();
      this.assignDice();
   }

}