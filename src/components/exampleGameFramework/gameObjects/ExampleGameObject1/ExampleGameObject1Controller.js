import CollisionClass from "../../utilities/collision";

export default class ExampleGameObject1ControllerClass {

   constructor(exampleGameObject1Data) {

      this.exampleGameObject1Data = exampleGameObject1Data;

      this.collision = new CollisionClass();
   }

   click = (x, y) => {

      for (let [key, value] of this.exampleGameObject1Data.getMap()) {

         for (let j = 4; j < 8; j++) {
            if (this.collision.pointRect(
               x, y,
               this.exampleGameObject1Data.X + value.drawPos.X - this.exampleGameObject1Data.size, this.exampleGameObject1Data.Y + value.drawPos.Y,
               this.exampleGameObject1Data.size, this.exampleGameObject1Data.size
            )) {
               return key;
            }
         }
      }
      return null;
   }

}