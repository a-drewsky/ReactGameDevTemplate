export default class GameStateClass {

   constructor(stateName, attributes, draw, interval, intervalFrequency){
      this.stateName = stateName;

      for(let i in attributes) this[i]=attributes[i];

      this.draw = draw;
      this.interval = interval;
      this.intervalFrequency = intervalFrequency;
   }

}