import CollisionClass from "../../utilities/collision";

export default class ExampleGameObjectControllerClass {

   constructor(exampleGameObject) {

      this.exampleGameObject = exampleGameObject;

      this.collision = new CollisionClass();
   }

   click = (x, y) => {

      for (let [key, value] of this.exampleGameObject.getMap()) {

         for (let j = 4; j < 8; j++) {
            if (this.collision.pointRect(
               x, y,
               this.exampleGameObject.X + value.drawPos.X - this.exampleGameObject.size, this.exampleGameObject.Y + value.drawPos.Y,
               this.exampleGameObject.size, this.exampleGameObject.size
            )) {
               return key;
            }
         }
      }
      return null;
   }

}