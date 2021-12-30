export default class PlayerControllerClass {

   constructor(hexMap, hexGroupMap, buttonManager, buttonManager2, diceMap, stateManager) {
      this.hexMap = hexMap;
      this.hexGroupMap = hexGroupMap;
      this.buttonManager = buttonManager;
      this.buttonManager2 = buttonManager2;
      this.diceMap = diceMap;

      this.stateManager = stateManager;
   }

   click = (x, y) => {

      switch (this.stateManager.gameState.stateName) {
         case 'playerTurn':

            //test buttons clicked
            let buttonClicked = this.buttonManager.click(x, y);
            if (buttonClicked != null) {
               if (buttonClicked == 'endTurnButton') {
                  this.stateManager.setEndTurn(this.hexGroupMap.getPlayerGroups(this.stateManager.globalStates.currentPlayer).length-1);
                  return;
               }
            }


            //test hexMap clicked
            let hexClicked = {
               Q: (Math.sqrt(3) / 3 * (x - this.hexMap.X) - 1 / 3 * ((y - this.hexMap.Y) * (1 / this.hexMap.squish))) / this.hexMap.size,
               R: (y - this.hexMap.Y) * (1 / this.hexMap.squish) * (2 / 3) / this.hexMap.size
            }
            hexClicked = this.hexMap.roundToNearestHex(hexClicked);


            if (this.stateManager.gameState.attacker == null) {

               //test dice clicked
               let groupDiceClicked = this.diceMap.click(x, y);
               if (groupDiceClicked == -1) return;
               if (groupDiceClicked != null && this.hexGroupMap.get(groupDiceClicked).playerNumber == this.stateManager.globalStates.currentPlayer) {
                  this.hexGroupMap.setTiles('attacker', groupDiceClicked);
                  this.stateManager.setGameState('attacker', groupDiceClicked);
                  return;
               }

               //test hex clicked
               if (!this.hexMap.has(hexClicked.Q, hexClicked.R) || this.hexGroupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).dice < 2 || this.hexGroupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber != this.stateManager.globalStates.currentPlayer) return;


               this.hexGroupMap.setTiles('attacker', this.hexMap.get(hexClicked.Q, hexClicked.R).group);
               this.stateManager.setGameState('attacker', this.hexMap.get(hexClicked.Q, hexClicked.R).group);
               return;
            }

            if (this.stateManager.gameState.defender == null) {

               //test dice clicked
               let groupDiceClicked = this.diceMap.click(x, y);
               if (groupDiceClicked != null) {

                  if (this.stateManager.gameState.attacker == groupDiceClicked) {
                     this.hexGroupMap.setTiles('default', groupDiceClicked);
                     this.stateManager.setGameState('attacker', null);
                     return;
                  }

                  if (this.hexGroupMap.adjacentGroups(this.stateManager.gameState.attacker, groupDiceClicked) && this.hexGroupMap.get(groupDiceClicked).playerNumber != this.stateManager.globalStates.currentPlayer) {
                     this.hexGroupMap.setTiles('defender', groupDiceClicked);
                     this.stateManager.setBattle(this.stateManager.gameState.attacker, groupDiceClicked, this.hexGroupMap.get(this.stateManager.gameState.attacker).dice, this.hexGroupMap.get(groupDiceClicked).dice);
                     return;
                  } 
                  
                  if (this.hexGroupMap.get(groupDiceClicked).dice >= 2 && this.hexGroupMap.get(groupDiceClicked).playerNumber == this.stateManager.globalStates.currentPlayer) {
                     this.hexGroupMap.setTiles('attacker', groupDiceClicked);
                     this.hexGroupMap.setTiles('default', this.stateManager.gameState.attacker);
                     this.stateManager.setGameState('attacker', groupDiceClicked);
                     return;
                  }

                  return;
               }

               //test hex clicked
               if (!this.hexMap.has(hexClicked.Q, hexClicked.R)) return;

               if (this.stateManager.gameState.attacker == this.hexMap.get(hexClicked.Q, hexClicked.R).group) {
                  this.hexGroupMap.setTiles('default', this.hexMap.get(hexClicked.Q, hexClicked.R).group);
                  this.stateManager.setGameState('attacker', null);
                  return;
               }

               if (this.hexGroupMap.adjacentGroups(this.stateManager.gameState.attacker, this.hexMap.get(hexClicked.Q, hexClicked.R).group) && this.hexGroupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber != this.stateManager.globalStates.currentPlayer) {
                  this.hexGroupMap.setTiles('defender', this.hexMap.get(hexClicked.Q, hexClicked.R).group);
                  this.stateManager.setBattle(this.stateManager.gameState.attacker, this.hexMap.get(hexClicked.Q, hexClicked.R).group, this.hexGroupMap.get(this.stateManager.gameState.attacker).dice, this.hexGroupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).dice);
                  return;
               } 
               if (this.hexGroupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).dice >= 2 && this.hexGroupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber == this.stateManager.globalStates.currentPlayer) {
                  this.hexGroupMap.setTiles('attacker', this.hexMap.get(hexClicked.Q, hexClicked.R).group);
                  this.hexGroupMap.setTiles('default', this.stateManager.gameState.attacker);
                  this.stateManager.setGameState('attacker', this.hexMap.get(hexClicked.Q, hexClicked.R).group);
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
            let buttonClicked = this.buttonManager2.click(x, y);
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

            let dieClicked = this.diceMap.click2(x, y);

            if(dieClicked != null){
               if(dieClicked.owner == 'attacker'){
                  let attackerStoppedRolls = this.stateManager.gameState.attackerStoppedRolls;
                  attackerStoppedRolls[dieClicked.index] = true;
                  this.stateManager.setGameState('attackerStoppedRolls', attackerStoppedRolls);
               } else if(dieClicked.owner == 'defender'){
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