import noise from "../../utilities/perlin";

export default class ExampleGameObjectBuilderClass {

   constructor(exampleGameObject) {

      this.exampleGameObject = exampleGameObject;

   }

   generateMap = () => {
      for (let x = 0; x < 10; x++) {
         this.exampleGameObject.set(x, {
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