import GameStateClass from "./GameState";
import UIManagerClass from "./UIManager";

export default class StateManagerClass {

   constructor(drawMethods, intervals, uiManager1, uiManager2){

      this.drawMethods = drawMethods;

      this.uiManager1 = uiManager1;
      this.uiManager2 = uiManager2;

      this.interval = null;

      this.globalStates = {
         currentPlayer: null
      }

      this.gameStates = {
         current: null,
         playerTurn: new GameStateClass(
            'playerTurn',
            {
               attacker: null
            },
            this.drawMethods.defaultDrawMethod
         ),
         endTurn: new GameStateClass(
            'endTurn',
            {
               endTurnTransitionTime: null,
               endTurnTransitionTimer: null
            },
            this.drawMethods.defaultDrawMethod,
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
            this.drawMethods.battleDrawMethod,
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
            this.drawMethods.endBattleDrawMethod,
            intervals.endBattleInterval, 500
         )
      }



   }

   setGameStateInterval = () => {
      this.interval = setInterval(this.gameStates.current.interval, this.gameStates.current.intervalFrequency);
   }

   setGameState = (state, value) => {
      this.gameStates.current[state] = value;
      this.gameStates.current.draw();
   }

   setGameStates = (statesValuePairs) => {
      for(let i=0; i<statesValuePairs.length; i++){
         this.gameStates.current[statesValuePairs[i][0]] = statesValuePairs[i][1];
      }
      this.gameStates.current.draw();
   }

   setPlayerTurn = (player) => {
      
      clearInterval(this.interval);

      this.gameStates.current = this.gameStates.playerTurn;
      this.globalStates.currentPlayer = player; //create set global state method

      this.setGameState('attacker', null);

      this.uiManager1.setActive("endTurnButton");

      this.gameStates.current.draw();
   }

   setEndTurn = (endTurnTransitionTime) => {
      
      clearInterval(this.interval);

      this.gameStates.current = this.gameStates.endTurn;
      this.setGameStates([['endTurnTransitionTime', endTurnTransitionTime], ['endTurnTransitionTimer', 0]])

      this.uiManager1.setInactive("endTurnButton");

      this.setGameStateInterval();
      this.gameStates.current.draw();
   }
   
   setBattle = (attacker, defender, attackerDice, defenderDice) => {

      clearInterval(this.interval)

      this.gameStates.current = this.gameStates.battle;

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

      this.uiManager1.setInactive("endTurnButton");
      this.uiManager2.setActive("attackerStopAll");
      this.uiManager2.setActive("defenderStopAll");

      this.setGameStateInterval();
      this.gameStates.current.draw();

   }

   setEndBattle = (attacker, defender, attackerRolls, defenderRolls) => {

      clearInterval(this.interval)
      this.gameStates.current = this.gameStates.endBattle;

      this.setGameStates([['attacker', attacker], ['defender', defender], ['attackerRolls', attackerRolls], ['defenderRolls', defenderRolls]])

      this.uiManager2.setDisabled("attackerStopAll");
      this.uiManager2.setDisabled("defenderStopAll");

      this.setGameStateInterval();
      this.gameStates.current.draw();
   }
   

}