import CollisionClass from "../../utilities/collision";

export default class ExampleGameObject1ControllerClass {

   constructor(exampleGameObject2Data) {

      this.exampleGameObject2Data = exampleGameObject2Data;

      this.collision = new CollisionClass();
   }

   click = (x, y) => {

      for (let [key, value] of this.exampleGameObject2Data.getMap()) {

         for (let j = 4; j < 8; j++) {
            if (this.collision.pointRect(
               x, y,
               this.exampleGameObject2Data.X + value.drawPos.X - this.exampleGameObject2Data.size, this.exampleGameObject2Data.Y + value.drawPos.Y,
               this.exampleGameObject2Data.size, this.exampleGameObject2Data.size
            )) {
               return key;
            }
         }
      }
      return null;
   }

}