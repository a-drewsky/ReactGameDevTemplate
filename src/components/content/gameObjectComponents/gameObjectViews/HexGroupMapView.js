import HexMapViewClass from "./HexMapView";
import HexagonEdgesViewClass from "./HexagonEdgesView";

export default class HexGroupMapViewClass {

   constructor(ctx, hexGroupMap){
      this.ctx = ctx;
      this.hexGroupMap = hexGroupMap;

      this.hexMapView = new HexMapViewClass(ctx, hexGroupMap);
      this.HexagonEdgesView = new HexagonEdgesViewClass()
   }

   draw = () => {

      this.hexMapView.draw();

      //draw all edges
      for (let [key, value] of this.hexGroupMap.map()) {

         let keyObj = this.hexGroupMap.split(key);

         let xOffset = this.hexGroupMap.VecQ.x * keyObj.Q + this.hexGroupMap.VecR.x * keyObj.R;
         let yOffset = this.hexGroupMap.VecQ.y * keyObj.Q * this.hexGroupMap.squish + this.hexGroupMap.VecR.y * keyObj.R * this.hexGroupMap.squish;

         let edges = [];
         if (value.group != null) edges = this.hexGroupMap.getGroupEdges(keyObj.Q, keyObj.R);

         this.HexagonEdgesView.draw(this.ctx, this.hexGroupMap.size, this.hexGroupMap.squish, this.hexGroupMap.X + xOffset, this.hexGroupMap.Y + yOffset, edges, Math.floor(this.hexGroupMap.size / 5.5), "pixel")
      }

      //draw defender edges
      for (let [key, value] of this.hexGroupMap.map()) {

         let keyObj = this.hexGroupMap.split(key);

         let xOffset = this.hexGroupMap.VecQ.x * keyObj.Q + this.hexGroupMap.VecR.x * keyObj.R;
         let yOffset = this.hexGroupMap.VecQ.y * keyObj.Q * this.hexGroupMap.squish + this.hexGroupMap.VecR.y * keyObj.R * this.hexGroupMap.squish;

         let edges = [];
         if (value.group != null) edges = this.hexGroupMap.getGroupEdges(keyObj.Q, keyObj.R);

         if (value.group == this.hexGroupMap.stateManager.gameState.defender) this.HexagonEdgesView.draw(this.ctx, this.hexGroupMap.size, this.hexGroupMap.squish, this.hexGroupMap.X + xOffset, this.hexGroupMap.Y + yOffset, edges, Math.floor(this.hexGroupMap.size / 5.5), "pixel", "#ff0000")

      }

      //draw attacker edges
      for (let [key, value] of this.hexGroupMap.map()) {

         let keyObj = this.hexGroupMap.split(key);

         let xOffset = this.hexGroupMap.VecQ.x * keyObj.Q + this.hexGroupMap.VecR.x * keyObj.R;
         let yOffset = this.hexGroupMap.VecQ.y * keyObj.Q * this.hexGroupMap.squish + this.hexGroupMap.VecR.y * keyObj.R * this.hexGroupMap.squish;

         let edges = [];
         if (value.group != null) edges = this.hexGroupMap.getGroupEdges(keyObj.Q, keyObj.R);

         if (value.group == this.hexGroupMap.stateManager.gameState.attacker) this.HexagonEdgesView.draw(this.ctx, this.hexGroupMap.size, this.hexGroupMap.squish, this.hexGroupMap.X + xOffset, this.hexGroupMap.Y + yOffset, edges, Math.floor(this.hexGroupMap.size / 5.5), "pixel", "#ffd900")

      }

   }

}