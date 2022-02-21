import GameStateClass from "./GameState";
import UIManagerClass from "./UIManager";

export default class StateManagerClass {

   constructor(drawGameObjects, intervals){

      this.drawGameObjects = drawGameObjects;

      this.gameState = null;

      this.interval = null;

      this.ui= new UIManagerClass(drawGameObjects);
      this.ui2 = new UIManagerClass(drawGameObjects);

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
            intervals.battleInterval, 50
         ),
         endBattle: new GameStateClass(
            'endBattle',
            {
               attacker: null,
               defender: null,
               attackerRolls: [],
               defenderRolls: [],
            },
            intervals.endBattleInterval, 500
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

      this.setGameState('attacker', null);

      this.ui.setActive("endTurnButton");

      this.drawGameObjects();
   }

   setEndTurn = (endTurnTransitionTime) => {
      
      clearInterval(this.interval);

      this.gameState = this.gameStates.endTurn;
      this.setGameStates([['endTurnTransitionTime', endTurnTransitionTime], ['endTurnTransitionTimer', 0]])

      this.ui.setInactive("endTurnButton");

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

      this.ui.setInactive("endTurnButton");
      this.ui2.setActive("attackerStopAll");
      this.ui2.setActive("defenderStopAll");

      this.setGameStateInterval();
      this.drawGameObjects();

   }

   setEndBattle = (attacker, defender, attackerRolls, defenderRolls) => {

      clearInterval(this.interval)
      this.gameState = this.gameStates.endBattle;

      this.setGameStates([['attacker', attacker], ['defender', defender], ['attackerRolls', attackerRolls], ['defenderRolls', defenderRolls]])

      this.ui2.setDisabled("attackerStopAll");
      this.ui2.setDisabled("defenderStopAll");

      this.setGameStateInterval();
      this.drawGameObjects();
   }
   

}