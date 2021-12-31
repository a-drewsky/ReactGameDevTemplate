export default class PlayerControllerClass {

   constructor(hexGroupDiceMap, diceBattle, stateManager) {
      this.hexGroupDiceMap = hexGroupDiceMap;
      this.diceBattle = diceBattle;

      this.stateManager = stateManager;
   }

   click = (x, y) => {

      switch (this.stateManager.gameState.stateName) {
         case 'playerTurn':

            let buttonClick = this.stateManager.ui.click(x, y);
            if (buttonClick == 'endTurnButton') {
               this.stateManager.setEndTurn(this.hexGroupDiceMap.getPlayerGroups(this.stateManager.globalStates.currentPlayer).length - 1);
               return;
            }


            //test hexMap clicked
            let hexClicked = {
               Q: (Math.sqrt(3) / 3 * (x - this.hexGroupDiceMap.X) - 1 / 3 * ((y - this.hexGroupDiceMap.Y) * (1 / this.hexGroupDiceMap.squish))) / this.hexGroupDiceMap.size,
               R: (y - this.hexGroupDiceMap.Y) * (1 / this.hexGroupDiceMap.squish) * (2 / 3) / this.hexGroupDiceMap.size
            }
            hexClicked = this.hexGroupDiceMap.roundToNearestHex(hexClicked);


            if (this.stateManager.gameState.attacker == null) {

               //test dice clicked
               let groupDiceClicked = this.hexGroupDiceMap.click(x, y);
               if (groupDiceClicked == -1) return;
               if (groupDiceClicked != null && this.hexGroupDiceMap.getGroup(groupDiceClicked).playerNumber == this.stateManager.globalStates.currentPlayer) {
                  this.hexGroupDiceMap.setTiles('attacker', groupDiceClicked);
                  this.stateManager.setGameState('attacker', groupDiceClicked);
                  return;
               }

               //test hex clicked
               if (!this.hexGroupDiceMap.has(hexClicked.Q, hexClicked.R) || this.hexGroupDiceMap.getGroup(this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group).dice < 2 || this.hexGroupDiceMap.getGroup(this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group).playerNumber != this.stateManager.globalStates.currentPlayer) return;


               this.hexGroupDiceMap.setTiles('attacker', this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group);
               this.stateManager.setGameState('attacker', this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group);
               return;
            }

            if (this.stateManager.gameState.defender == null) {

               //test dice clicked
               let groupDiceClicked = this.hexGroupDiceMap.click(x, y);
               if (groupDiceClicked != null) {

                  if (this.stateManager.gameState.attacker == groupDiceClicked) {
                     this.hexGroupDiceMap.setTiles('default', groupDiceClicked);
                     this.stateManager.setGameState('attacker', null);
                     return;
                  }

                  if (this.hexGroupDiceMap.adjacentGroups(this.stateManager.gameState.attacker, groupDiceClicked) && this.hexGroupDiceMap.getGroup(groupDiceClicked).playerNumber != this.stateManager.globalStates.currentPlayer) {
                     this.hexGroupDiceMap.setTiles('defender', groupDiceClicked);
                     this.stateManager.setBattle(this.stateManager.gameState.attacker, groupDiceClicked, this.hexGroupDiceMap.getGroup(this.stateManager.gameState.attacker).dice, this.hexGroupDiceMap.getGroup(groupDiceClicked).dice);
                     return;
                  }

                  if (this.hexGroupDiceMap.getGroup(groupDiceClicked).dice >= 2 && this.hexGroupDiceMap.getGroup(groupDiceClicked).playerNumber == this.stateManager.globalStates.currentPlayer) {
                     this.hexGroupDiceMap.setTiles('attacker', groupDiceClicked);
                     this.hexGroupDiceMap.setTiles('default', this.stateManager.gameState.attacker);
                     this.stateManager.setGameState('attacker', groupDiceClicked);
                     return;
                  }

                  return;
               }

               //test hex clicked
               if (!this.hexGroupDiceMap.has(hexClicked.Q, hexClicked.R)) return;

               if (this.stateManager.gameState.attacker == this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group) {
                  this.hexGroupDiceMap.setTiles('default', this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group);
                  this.stateManager.setGameState('attacker', null);
                  return;
               }

               if (this.hexGroupDiceMap.adjacentGroups(this.stateManager.gameState.attacker, this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group) && this.hexGroupDiceMap.getGroup(this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group).playerNumber != this.stateManager.globalStates.currentPlayer) {
                  this.hexGroupDiceMap.setTiles('defender', this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group);
                  this.stateManager.setBattle(this.stateManager.gameState.attacker, this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group, this.hexGroupDiceMap.getGroup(this.stateManager.gameState.attacker).dice, this.hexGroupDiceMap.getGroup(this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group).dice);
                  return;
               }
               if (this.hexGroupDiceMap.getGroup(this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group).dice >= 2 && this.hexGroupDiceMap.getGroup(this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group).playerNumber == this.stateManager.globalStates.currentPlayer) {
                  this.hexGroupDiceMap.setTiles('attacker', this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group);
                  this.hexGroupDiceMap.setTiles('default', this.stateManager.gameState.attacker);
                  this.stateManager.setGameState('attacker', this.hexGroupDiceMap.get(hexClicked.Q, hexClicked.R).group);
                  return;
               }
            }



            break;
         case 'endTurn':
            break;
         case 'battle':
            break;
         case 'endBattle':
            break;
         default:
            break;
      }

   }

   click2 = (x, y) => {

      switch (this.stateManager.gameState.stateName) {
         case 'playerTurn':
            break;
         case 'endTurn':
            break;
         case 'battle':

            //test buttons clicked
            let buttonClicked = this.stateManager.ui2.click(x, y);
            if (buttonClicked != null) {
               if (buttonClicked == 'attackerStopAll') {
                  for (let i = 0; i < this.stateManager.gameState.attackerStoppedRolls.length; i++) this.stateManager.gameState.attackerStoppedRolls[i] = true;
                  return;
               }
               if (buttonClicked == 'defenderStopAll') {
                  for (let i = 0; i < this.stateManager.gameState.defenderStoppedRolls.length; i++) this.stateManager.gameState.defenderStoppedRolls[i] = true;
                  return;
               }
            }

            let dieClicked = this.diceBattle.click(x, y);

            if (dieClicked != null) {
               if (dieClicked.owner == 'attacker') {
                  let attackerStoppedRolls = this.stateManager.gameState.attackerStoppedRolls;
                  attackerStoppedRolls[dieClicked.index] = true;
                  this.stateManager.setGameState('attackerStoppedRolls', attackerStoppedRolls);
               } else if (dieClicked.owner == 'defender') {
                  let defenderStoppedRolls = this.stateManager.gameState.defenderStoppedRolls;
                  defenderStoppedRolls[dieClicked.index] = true;
                  this.stateManager.setGameState('defenderStoppedRolls', defenderStoppedRolls);
               }
            }

            break;
         case 'endBattle':
            break;
         default:
            break;
      }



   }

}