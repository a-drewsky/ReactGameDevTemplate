import GameStateClass from "./GameState";

export default class StateManagerClass {

   constructor(drawGameObjects, intervals){

      this.drawGameObjects = drawGameObjects;
      this.gameState = null;

      this.interval = null;

      this.globalStates = {
         currentPlayer: null
      }

      this.gameStates = {
         playerTurn: new GameStateClass(
            'playerTurn',
            {
               attacker: null
            },
            null
         ),
         endTurn: new GameStateClass(
            'endTurn',
            {
               endTurnTransitionTime: null,
               endTurnTransitionTimer: null
            },
            intervals.endTurnInterval, 5
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
            intervals.battleInterval, 10
         ),
         endBattle: new GameStateClass(
            'endBattle',
            {
               battleTransitionTime: 0.5,
               battleTransitionTimer: null,
               battleTransition: false,
            },
            intervals.endBattleInterval, 10
         )
      }
   }

   setGameStateInterval = () => {
      this.interval = setInterval(this.gameState.interval, this.gameState.intervalFrequency);
   }

   setGameState = (state, value) => {
      this.gameState[state] = value;
      this.drawGameObjects();
   }

   setGameStates = (statesValuePairs) => {
      for(let i=0; i<statesValuePairs.length; i++){
         this.gameState[statesValuePairs[i][0]] = statesValuePairs[i][1];
      }
      this.drawGameObjects();
   }

   setPlayerTurn = (player) => {
      clearInterval(this.interval);
      this.gameState = this.gameStates.playerTurn;
      this.globalStates.currentPlayer = player;

      this.drawGameObjects();
   }

   setEndTurn = (endTurnTransitionTime) => {
      clearInterval(this.interval);

      this.gameState = this.gameStates.endTurn;
      this.setGameStates([['endTurnTransitionTime', endTurnTransitionTime], ['endTurnTransitionTimer', 0]])

      this.setGameStateInterval();
      this.drawGameObjects();
   }
   
   setBattle = (attacker, defender, attackerDice, defenderDice) => {

      clearInterval(this.interval)

      this.gameState = this.gameStates.battle;

      let attackerRolls = [];
      let defenderRolls = [];
      let attackerStoppedRolls = [];
      let defenderStoppedRolls = [];

      for (let i = 0; i < attackerDice; i++) {
         attackerRolls[i] = Math.floor(Math.random() * 6);
         attackerStoppedRolls[i] = false;
      }
      for (let i = 0; i < defenderDice; i++) {
         defenderRolls[i] = Math.floor(Math.random() * 6);
         defenderStoppedRolls[i] = false;
      }

      this.setGameStates([['attacker', attacker], ['defender', defender], ['attackerRolls', attackerRolls], ['defenderRolls', defenderRolls], ['attackerStoppedRolls', attackerStoppedRolls], ['defenderStoppedRolls', defenderStoppedRolls]]);

      this.setGameStateInterval();
      this.drawGameObjects();

   }

   //need to implement
   setEndBattle = () => {
      clearInterval(this.interval)

      this.hexGrid.battleTransitionTimer = null;
      this.hexGrid.battleTransition = false;

      let attackerRollTotal = this.hexGrid.currentBattle.attackerRolls.reduce((a, b) => a + b, 0);

      //defender roll total
      let defenderRollTotal = this.hexGrid.currentBattle.defenderRolls.reduce((a, b) => a + b, 0);

      //result
      if (attackerRollTotal > defenderRollTotal) {
         this.hexGroupMap.get(this.hexGrid.currentBattle.defender).playerNumber = this.hexGroupMap.get(this.hexGrid.currentBattle.attacker).playerNumber;
         this.hexGroupMap.get(this.hexGrid.currentBattle.defender).dice = this.hexGroupMap.get(this.hexGrid.currentBattle.attacker).dice - 1;
         this.hexGroupMap.get(this.hexGrid.currentBattle.attacker).dice = 1;
      } else {
         this.hexGroupMap.get(this.hexGrid.currentBattle.attacker).dice = 1;
      }

      this.hexGrid.currentBattle = {
         attacker: null,
         defender: null,
         attackerRolls: [],
         defenderRolls: [],
         attackerStoppedRolls: [],
         defenderStoppedRolls: [],
         interval: null
      }

      this.hexGrid.drawHexGrid();
   }
   

}