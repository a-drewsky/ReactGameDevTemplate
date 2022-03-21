import noise from "../../utilities/perlin";

export default class ExampleGameObject1BuilderClass {

   constructor(exampleGameObject1Data) {

      this.exampleGameObject1Data = exampleGameObject1Data;

   }

   //Build helper methods
   generateMap = () => {
      for (let x = 0; x < 10; x++) {
         this.exampleGameObject1Data.setEntry(x, {
            example: null
         })
      }
   }

   //Build methods
   build = (mapGeneration) => {

      if (mapGeneration == "gen1") {
         this.generateMap();
      } else if (mapGeneration == "gen2") {
         this.generateMap();
      } else {
         this.generateMap();
      }
   }

}