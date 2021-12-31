import HexagonViewClass from "./HexagonView";

export default class HexMapViewClass {

   constructor(ctx, hexMap){
      this.ctx = ctx;
      this.hexMap = hexMap;
      this.HexagonView = new HexagonViewClass();
   }

   draw = () => {

      for (let [key, value] of this.hexMap.map()) {

         let keyObj = this.hexMap.split(key);

         let xOffset = this.hexMap.VecQ.x * keyObj.Q + this.hexMap.VecR.x * keyObj.R;
         let yOffset = this.hexMap.VecQ.y * keyObj.Q * this.hexMap.squish + this.hexMap.VecR.y * keyObj.R * this.hexMap.squish;
         
         
         this.HexagonView.draw(this.ctx, this.hexMap.size, this.hexMap.squish, this.hexMap.X + xOffset, this.hexMap.Y + yOffset, value.color);
      }

   }

}