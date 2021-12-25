export default class GameStateClass {

   constructor(stateName, attributes, interval, intervalFrequency){
      this.stateName = stateName;
      this.attributes = attributes;
      this.interval = interval;
      this.intervalFrequency = intervalFrequency;
   }

   setAttributes = (attributes) => {
      this.attributes = attributes;
   }

}