import noise from "../../utilities/perlin";

export default class ExampleGameObject1BuilderClass {

   constructor(exampleGameObject2Data) {

      this.exampleGameObject2Data = exampleGameObject2Data;

   }

   generateMap = () => {
      for (let x = 0; x < 10; x++) {
         this.exampleGameObject2Data.set(x, {
            example: null
         })
      }
   }

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