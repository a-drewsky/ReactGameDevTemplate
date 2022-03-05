export default class CollisionClass {

   // POINT/RECTANGLE
pointRect = (px, py, rx, ry, rw, rh) => {

   // is the point inside the rectangle's bounds?
   if (px >= rx &&        // right of the left edge AND
       px <= rx + rw &&   // left of the right edge AND
       py >= ry &&        // below the top AND
       py <= ry + rh) {   // above the bottom
         return true;
   }
   return false;
 }

}