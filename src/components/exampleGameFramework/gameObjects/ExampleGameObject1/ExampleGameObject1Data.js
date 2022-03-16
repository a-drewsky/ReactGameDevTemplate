export default class ExampleGameObject1DataClass {

   constructor(x, y, size) {
      this.map = new Map();

      this.x = x;
      this.y = y;
      this.size = size;
   }


   //SET METHODS

   setDimensions = (x, y, size) => {
      this.x = x;
      this.y = y;
      this.size = size;
   }

   //Set an entry in the map (void)
   setEntry = (key, value) => {
      this.map.set(key, value);
   }

   //delete an entry in the map (void)
   deleteEntry = (key) => {
      this.map.delete(key);
   }

   //END SET METHODS



   //GET METHODS

   //get an entry in the map (returns a hex tile object)
   getEntry = (key) => {
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
   hasEntry = (q, r) => {
      return this.map.has([q, r].join(','));
   }

   //END CHECK METHODS



   //HELPER METHODS

   //converts key string to key object (returns a key object)
   splitEntry = (key) => {
      let nums = key.split(',').map(Number);
      return {
         q: nums[0],
         r: nums[1]
      }
   }

   //converts a key object to a key string (returns a key string)
   joinEntry = (q, r) => {
      return [q, r].join(',')
   }

   //END HELPER METHODS
}