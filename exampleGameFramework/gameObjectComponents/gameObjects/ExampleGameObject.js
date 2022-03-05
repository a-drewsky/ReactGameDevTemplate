export default class ExampleGameObjectClass {

   constructor(x, y, size) {
      this.map = new Map();

      //move all of this to hexagonViewClass
      this.X = x;
      this.Y = y;
      this.size = size;
   }


   //SET METHODS

   //Set an entry in the map (void)
   set = (key, value) => {
      this.map.set(key, value);
   }

   //delete an entry in the map (void)
   delete = (key) => {
      this.map.delete(key);
   }

   //END SET METHODS



   //GET METHODS

   //get an entry in the map (returns a hex tile object)
   get = (key) => {
      return this.map.get(key);
   }

   //returns the map
   getMap = () => {
      return this.map
   }

   //returns the number of entries in the map
   getMapSize = () => {
      return this.map.size
   }

   //returns all keys for the map
   getKeys = () => {
      return [...this.map.keys()]
   }

   //END GET METHODS



   //CHECK METHODS

   //check if map has an entry (returns a boolean)
   has = (q, r) => {
      return this.map.has([q, r].join(','));
   }

   //END CHECK METHODS



   //HELPER METHODS

   //converts key string to key object (returns a key object)
   split = (key) => {
      let nums = key.split(',').map(Number);
      return {
         Q: nums[0],
         R: nums[1]
      }
   }

   //converts a key object to a key string (returns a key string)
   join = (q, r) => {
      return [q, r].join(',')
   }

   //END HELPER METHODS
}