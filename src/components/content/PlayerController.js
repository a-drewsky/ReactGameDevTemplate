export default class PlayerControllerClass {

   constructor(hexMap, hexGroupMap, buttonManager, diceManager, stateManager) {
      this.hexMap = hexMap;
      this.hexGroupMap = hexGroupMap;
      this.buttonManager = buttonManager;
      this.diceManager = diceManager;

      this.stateManager = stateManager;
   }

   click = (x, y) => {

      switch (this.stateManager.gameState.stateName) {
         case 'playerTurn':

            //test buttons clicked
            let buttonClicked = this.buttonManager.click(x, y);
            if (buttonClicked != null) {
               if (buttonClicked == 'endTurnButton') {
                  this.stateManager.setEndTurn(this.hexGroupMap.getPlayerGroups(this.stateManager.globalStates.currentPlayer).length);
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
               let groupDiceClicked = this.diceManager.click(x, y);
               if (groupDiceClicked == -1) return;
               if (groupDiceClicked != null) {
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
               let groupDiceClicked = this.diceManager.click(x, y);
               if (groupDiceClicked == -1) return;
               if (groupDiceClicked != null) {
                  this.hexGroupMap.setTiles('defender', groupDiceClicked);
                  this.stateManager.setBattle(this.stateManager.gameState.attacker, groupDiceClicked, this.hexGroupMap.get(this.stateManager.gameState.attacker).dice, this.hexGroupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).dice);
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
               } else if (this.hexGroupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).dice >= 2 && this.hexGroupMap.get(this.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber == this.hexMap.playerTurn) {
                  this.hexGroupMap.setTiles('attacker', this.hexMap.get(hexClicked.Q, hexClicked.R).group);
                  this.stateManager.setGameState('attacker', this.hexMap.get(hexClicked.Q, hexClicked.R).group);
               }
               return;
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

   //need to implement
   click2 = (x, y) => {

      //check attacker stop all button
      if (x > this.hexGrid.RollBuffer && y > this.hexGrid.RollBuffer * 3 + this.hexGrid.diceSize * 4 && x < this.hexGrid.RollBuffer + this.hexGrid.buttonWidth && y < this.hexGrid.RollBuffer * 3 + this.hexGrid.diceSize * 4 + this.hexGrid.buttonWidth / 3) {
         for (let i = 0; i < this.hexGrid.currentBattle.attackerStoppedRolls.length; i++) this.hexGrid.currentBattle.attackerStoppedRolls[i] = true;
      }

      //check defender stop all button
      if (x > this.hexGrid.canvas2Dims.width - this.hexGrid.RollBuffer - this.hexGrid.buttonWidth && y > this.hexGrid.RollBuffer * 3 + this.hexGrid.diceSize * 4 && x < this.hexGrid.canvas2Dims.width - this.hexGrid.RollBuffer - this.hexGrid.buttonWidth + this.hexGrid.buttonWidth && y < this.hexGrid.RollBuffer * 3 + this.hexGrid.diceSize * 4 + this.hexGrid.buttonWidth / 3) {
         for (let i = 0; i < this.hexGrid.currentBattle.defenderStoppedRolls.length; i++) this.hexGrid.currentBattle.defenderStoppedRolls[i] = true;
      }

      //check attacker dice
      for (let i = 0; i < 4; i++) {

         if (y < this.hexGrid.RollBuffer || y > this.hexGrid.RollBuffer + this.hexGrid.diceSize * 2 || this.hexGrid.currentBattle.attackerRolls.length <= i) break;
         if (this.hexGrid.currentBattle.attackerStoppedRolls[i] == true) continue;
         if (x > this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i && x < this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i + this.hexGrid.diceSize * 2) {
            this.hexGrid.currentBattle.attackerStoppedRolls[i] = true;
            return;
         }

      }
      for (let i = 4; i < 8; i++) {
         if (y < this.hexGrid.RollBuffer * 2 + this.hexGrid.diceSize * 2 || y > this.hexGrid.RollBuffer * 2 + this.hexGrid.diceSize * 2 + this.hexGrid.diceSize * 2 || this.hexGrid.currentBattle.attackerRolls.length <= i) break;
         if (this.hexGrid.currentBattle.attackerStoppedRolls[i] == true) continue;
         if (x > this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4) && x < this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4) + this.hexGrid.diceSize * 2) {
            this.hexGrid.currentBattle.attackerStoppedRolls[i] = true;
            return;
         }

      }

      //check defender dice
      for (let i = 0; i < 4; i++) {

         if (y < this.hexGrid.RollBuffer || y > this.hexGrid.RollBuffer + this.hexGrid.diceSize * 2 || this.hexGrid.currentBattle.defenderRolls.length <= i) break;
         if (this.hexGrid.currentBattle.defenderStoppedRolls[i] == true) continue;
         if (x < this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i) && x > this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * i + this.hexGrid.diceSize * 2)) {
            this.hexGrid.currentBattle.defenderStoppedRolls[i] = true;
            return;
         }

      }
      for (let i = 4; i < 8; i++) {

         if (y < this.hexGrid.RollBuffer * 2 + this.hexGrid.diceSize * 2 || y > this.hexGrid.RollBuffer * 2 + this.hexGrid.diceSize * 2 + this.hexGrid.diceSize * 2 || this.hexGrid.currentBattle.defenderRolls.length <= i) break;
         if (this.hexGrid.currentBattle.defenderStoppedRolls[i] == true) continue;
         if (x < this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4)) && x > this.hexGrid.canvas2Dims.width - (this.hexGrid.RollBuffer + (this.hexGrid.diceSize * 2 + this.hexGrid.RollBuffer) * (i - 4) + this.hexGrid.diceSize * 2)) {
            this.hexGrid.currentBattle.defenderStoppedRolls[i] = true;
            return;
         }

      }
   }

}