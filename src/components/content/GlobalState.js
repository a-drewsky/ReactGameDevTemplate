import GameStateClass from "./GameState";

//rename to GameStateManagerClass
export default class GlobalStateClass {

   constructor(hexMap, hexGroupMap, drawGameObjects){

      this.hexMap = hexMap;
      this.hexGroupMap = hexGroupMap;
      this.drawGameObjects = drawGameObjects;

      this.gameState = null;
      
      //need to implement
      this.globalStates = {
         player: null
      }

      this.gameStates = {
         playerTurn: new GameStateClass(
            'playerTurn',
            {
               player: null,
               attacker: null
            },
            null
         ),
         endTurn: new GameStateClass(
            'endTurn',
            {
               player: null,
               endTurnTransitionTime: null,
               endTurnTransitionTimer: null
            },
            this.endTurnInterval, 5
         ),
         battle: new GameStateClass(
            'battle',
            {
               attacker: null,
               defender: null,
               attackerRolls: [],
               defenderRolls: [],
               attackerStoppedRolls: [],
               defenderStoppedRolls: []
            },
            this.battleInterval, 10
         ),
         endBattle: new GameStateClass(
            'endBattle',
            {
               battleTransitionTime: 0.5,
               battleTransitionTimer: null,
               battleTransition: false,
            },
            null
         )
      }
      this.interval = null;
   }

   setPlayerTurn = (player) => {
      clearInterval(this.interval);
      console.log("Act2")
      this.gameState = this.gameStates.playerTurn;
      this.gameState.player = player;

      this.drawGameObjects();
   }

   setEndTurn = (player, endTurnTransitionTime) => {
      clearInterval(this.interval);

      this.gameState = this.gameStates.endTurn;
      this.gameState.player = player;
      this.gameState.endTurnTransitionTime = endTurnTransitionTime;
      this.gameState.endTurnTransitionTimer = 0;
      this.interval = setInterval(this.gameState.interval, this.gameState.intervalFrequency);

      this.drawGameObjects();
   }


   endTurnInterval = () => {

      console.log("interval")

      let endTurn = () => {
         let newPlayer = this.gameState.player+1;
         if (newPlayer == this.hexGroupMap.numPlayers) newPlayer = 0;

         this.setPlayerTurn(newPlayer)
      }

      let playerGroups = this.hexGroupMap.getPlayerGroups(this.gameState.player);
      let selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

      if (playerGroups.filter(group => group[1].dice < 8).length == 0) {
         endTurn();
         return;
      }


      while (selectedGroup[1].dice >= 8) selectedGroup = playerGroups[Math.floor(Math.random() * playerGroups.length)];

      selectedGroup[1].dice++;
      this.hexGroupMap.set(selectedGroup[0], selectedGroup[1]);


      if (this.gameState.endTurnTransitionTimer >= this.gameState.endTurnTransitionTime) {
         endTurn();
         return;
      }
      
      this.gameState.endTurnTransitionTimer++;
      this.drawGameObjects();
   }

}