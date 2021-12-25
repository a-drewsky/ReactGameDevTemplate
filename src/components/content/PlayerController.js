export default class PlayerControllerClass {

   constructor(hexMap, hexGroupMap, buttonManager, globalState) {
      this.hexMap = hexMap;
      this.hexGroupMap = hexGroupMap;
      this.buttonManager = buttonManager;

      this.globalState = globalState;
   }

   click = (x, y) => {

      let roundToNearestHex = (hex) => {
         let fracQ = hex.Q;
         let fracR = hex.R;
         let fracS = -1 * hex.Q - hex.R

         let Q = Math.round(fracQ);
         let R = Math.round(fracR);
         let S = Math.round(fracS);

         let diffQ = Math.abs(Q - fracQ);
         let diffR = Math.abs(R - fracR);
         let diffS = Math.abs(S - fracS);

         if (diffQ > diffR && diffQ > diffS) {
            Q = -1 * R - S
         } else if (diffR > diffS) {
            R = -1 * Q - S
         } else {
            S = -1 * Q - R
         }

         return {
            Q: Q,
            R: R
         }

      }

      let adjacentGroups = (group1, group2) => {
         let group1Tiles = this.hexGroupMap.getGroupTiles(group1);
         let group2Tiles = this.hexGroupMap.getGroupTiles(group2);

         for (let i = 0; i < group1Tiles.length; i++) {
            let neighbors = this.hexGrid.hexMap.neighborKeys(group1Tiles[i].Q, group1Tiles[i].R);

            for (let j = 0; j < neighbors.length; j++) {
               let neighbor = neighbors[j];

               for (let k = 0; k < group2Tiles.length; k++) {
                  if (neighbor.Q == group2Tiles[k].Q && neighbor.R == group2Tiles[k].R) return true;
               }
            }
         }
         return false;
      }

      switch (this.globalState.gameState.stateName) {
         case 'playerTurn':

            //test buttons clicked
            let buttonClicked = this.buttonManager.click(x, y);
            if (buttonClicked != null) {
               if (buttonClicked == 'endTurnButton') {
                  this.globalState.setEndTurn(this.globalState.gameState.player, this.hexGroupMap.getPlayerGroups(this.globalState.gameState.player).length);
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




      let hexClicked = {
         Q: (Math.sqrt(3) / 3 * (x - this.hexGrid.X) - 1 / 3 * ((y - this.hexGrid.Y) * (1 / this.hexGrid.squish))) / this.hexGrid.size,
         R: (y - this.hexGrid.Y) * (1 / this.hexGrid.squish) * (2 / 3) / this.hexGrid.size
      }
      hexClicked = roundToNearestHex(hexClicked);

      if (this.hexGrid.endTurnTransitionTimer != null) return;

      //test end turn button clicked
      // let buttonX = this.hexGrid.buttonWidth * 0.0625
      // let buttonY = 60
      // let buttonWidth = this.hexGrid.buttonWidth;
      // let buttonHeight = this.hexGrid.buttonWidth / 3;
      // if (x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight) {
      //    this.endTurn();
      //    return;
      // }

      //test grid clicked
      if (this.hexGrid.currentBattle.attacker == null) {

         //test dice clicked
         for (let [key, value] of this.hexGroupMap.getMap()) {

            for (let j = 4; j < 8; j++) {
               if (value.dice > j) {
                  if (x > this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 1.35
                     && y > this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (1 + (j - 4) * 0.55)
                     && x < this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 1.35 + this.hexGrid.diceSize
                     && y < this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (1 + (j - 4) * 0.55) + this.hexGrid.diceSize) {
                     if (this.hexGroupMap.get(key).dice < 2 || this.hexGroupMap.get(key).playerNumber != this.hexGrid.playerTurn) return;
                     this.hexGrid.currentBattle.attacker = key;
                     this.hexGrid.drawHexGrid();
                     return;
                  }
               }
               else break;
            }
            for (let j = 0; j < 4; j++) {
               if (value.dice > j) {
                  if (x > this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 0.6
                     && y > this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (0.75 + j * 0.55)
                     && x < this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 0.6 + this.hexGrid.diceSize
                     && y < this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (0.75 + j * 0.55) + this.hexGrid.diceSize) {
                     if (this.hexGroupMap.get(key).dice < 2 || this.hexGroupMap.get(key).playerNumber != this.hexGrid.playerTurn) return;
                     this.hexGrid.currentBattle.attacker = key;
                     this.hexGrid.drawHexGrid();
                     return;
                  }
               }
            }
         }

         //test hex clicked
         if (!this.hexGrid.hexMap.has(hexClicked.Q, hexClicked.R) || this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).dice < 2 || this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber != this.hexGrid.playerTurn) return;

         this.hexGrid.currentBattle.attacker = this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group;

         this.hexGrid.drawHexGrid();
         return;
      }

      if (this.hexGrid.currentBattle.defender == null) {

         //test dice clicked
         for (let [key, value] of this.hexGroupMap.getMap()) {

            for (let j = 4; j < 8; j++) {
               if (value.dice > j) {
                  if (x > this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 1.35
                     && y > this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (1 + (j - 4) * 0.55)
                     && x < this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 1.35 + this.hexGrid.diceSize
                     && y < this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (1 + (j - 4) * 0.55) + this.hexGrid.diceSize) {

                     if (this.hexGrid.currentBattle.attacker == key) {
                        this.hexGrid.currentBattle.attacker = null;
                        this.hexGrid.drawHexGrid();
                        return;
                     }

                     if (adjacentGroups(this.hexGrid.currentBattle.attacker, key) && this.hexGroupMap.get(key).playerNumber != this.hexGrid.playerTurn) {
                        this.hexGrid.currentBattle.defender = key;
                        this.hexGrid.drawHexGrid();
                        this.startBattle();
                        return;
                     } else if (this.hexGroupMap.get(key).dice >= 2 && this.hexGroupMap.get(key).playerNumber == this.hexGrid.playerTurn) {
                        this.hexGrid.currentBattle.attacker = key;
                     }

                     this.hexGrid.drawHexGrid();
                     return;
                  }
               }
               else break;
            }
            for (let j = 0; j < 4; j++) {
               if (value.dice > j) {
                  if (x > this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 0.6
                     && y > this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (0.75 + j * 0.55)
                     && x < this.hexGrid.X + value.drawPos.X - this.hexGrid.diceSize * 0.6 + this.hexGrid.diceSize
                     && y < this.hexGrid.Y + value.drawPos.Y * this.hexGrid.squish - this.hexGrid.diceSize * (0.75 + j * 0.55) + this.hexGrid.diceSize) {

                     if (this.hexGrid.currentBattle.attacker == key) {
                        this.hexGrid.currentBattle.attacker = null;
                        this.hexGrid.drawHexGrid();
                        return;
                     }

                     if (adjacentGroups(this.hexGrid.currentBattle.attacker, key) && this.hexGroupMap.get(key).playerNumber != this.hexGrid.playerTurn) {
                        this.hexGrid.currentBattle.defender = key;
                        this.hexGrid.drawHexGrid();
                        this.startBattle();
                        return;
                     } else if (this.hexGroupMap.get(key).dice >= 2 && this.hexGroupMap.get(key).playerNumber == this.hexGrid.playerTurn) {
                        this.hexGrid.currentBattle.attacker = key;
                     }

                     this.hexGrid.drawHexGrid();
                     return;
                  }
               }
            }
         }

         //test hex clicked
         if (!this.hexGrid.hexMap.has(hexClicked.Q, hexClicked.R)) return;

         if (this.hexGrid.currentBattle.attacker == this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group) {
            this.hexGrid.currentBattle.attacker = null;
            this.hexGrid.drawHexGrid();
            return;
         }

         if (adjacentGroups(this.hexGrid.currentBattle.attacker, this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group) && this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber != this.hexGrid.playerTurn) {
            this.hexGrid.currentBattle.defender = this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group;
            this.hexGrid.drawHexGrid();
            this.startBattle();
            return;
         } else if (this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).dice >= 2 && this.hexGroupMap.get(this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group).playerNumber == this.hexGrid.playerTurn) {
            this.hexGrid.currentBattle.attacker = this.hexGrid.hexMap.get(hexClicked.Q, hexClicked.R).group;
         }


         this.hexGrid.drawHexGrid();
         return;
      }

   }

}