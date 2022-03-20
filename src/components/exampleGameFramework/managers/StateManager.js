import GameStateClass from "../GameState";
export default class StateManagerClass {

   constructor(drawMethod, intervalsList, gameObjectManager, uiManager){
      this.gameObjectManager = gameObjectManager;
      this.uiManager = uiManager;

      //create gloabl attributes
      this.globalAttributes = {
         globalAttribute1: null,
         globalAttribute2: null
      }

      this.draw = drawMethod;

      //create game states list
      this.gameStates = {

         //current game state
         current: null,

         //game state list
         state1: new GameStateClass(
            'state1',
            {
               attribute1: null
            }
         ),

         state2: new GameStateClass(
            'state2',
            {
               attribute1: null,
               attribute2: null
            },
            intervalsList.interval1, 10
         ),

         state3: new GameStateClass(
            'state3',
            {
               attribute1: null,
               attribute2: null,
               attribute3: [],
               attribute4: []
            },
            intervalsList.interval2, 10
         )
      }

   }

   //SET STATE HELPER METHODS

   setGameState = (state) => {
      this.gameStates.current = this.gameStates[state];
   }

   setGameStateInterval = () => {
      this.interval = setInterval(this.gameStates.current.interval, this.gameStates.current.intervalFrequency);
   }

   setGlobalAttribute = (attribute, value) => {
      this.globalAttributes[attribute] = value;
      this.draw();
   }

   setGlobalAttributes = (attributeValuePairs) => {
      for(let i=0; i<attributeValuePairs.length; i++){
         this.globalAttributes[attributeValuePairs[i][0]] = attributeValuePairs[i][1];
      }
      this.draw();
   }

   setGameStateAttribute = (attribute, value) => {
      this.gameStates.current[attribute] = value;
      this.draw();
   }

   setGameStateAttributes = (attributeValuePairs) => {
      for(let i=0; i<attributeValuePairs.length; i++){
         this.gameStates.current[attributeValuePairs[i][0]] = attributeValuePairs[i][1];
      }
      this.draw();
   }

   //END SET STATE HELPER METHODS


   //SET STATE METHODS

   setState1 = (variable1) => {
      
      //clear the current interval
      clearInterval(this.interval);

      //set the current gamestate
      this.setGameState('state1');

      //set global states
      this.setGlobalAttribute('globalState1', variable1); //create set global state method

      //set gamestate attributes
      this.setGameStateAttribute('attribute1', null);

      //set ui elements
      this.uiManager.setActive("exampleButton");

      //redraw the canvas
      this.draw();
   }

   setState2 = (variable1) => {
      
      //clear the current interval
      clearInterval(this.interval);

      //set the current gamestate
      this.setGameState('state2');

      //set gamestate attributes
      this.setGameStateAttributes([['attribute1', variable1], ['attribute2', 0]])

      //set ui elements
      this.uiManager.setInactive("exampleButton");

      //reset the current interval
      this.setGameStateInterval();

      //redraw the canvas
      this.draw();
   }

   setState3 = (variable1, variable2, variable3, variable4) => {

      //clear the current interval
      clearInterval(this.interval)

      //set the current gamestate
      this.setGameState('state3');

      //set gamestate attributes
      this.setGameStateAttributes([['attribute1', variable1], ['attribute2', variable2], ['attribute3', variable3], ['attribute4', variable4]])

      //set ui elements
      this.uiManager.setDisabled("exampleButton");

      //reset the current interval
      this.setGameStateInterval();

      //redraw the canvas
      this.draw();
   }
   
   //END SET STATE METHODS

}