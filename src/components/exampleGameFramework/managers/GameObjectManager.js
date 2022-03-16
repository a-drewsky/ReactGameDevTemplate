
//Import Game Object
import ExampleGameObeject1Class from '../gameObjects/ExampleGameObject1/ExampleGameObject1'
import ExampleGameObeject2Class from '../gameObjects/ExampleGameObject2/ExampleGameObject2';

export default class GameObjectManagerClass {

    constructor(ctx) {
        this.ctx = ctx;

        this.objectMap = new Map();
    }

    //Set up function
    createObjects = (settings) => {
        this.objectMap.set("exampleGameObject1", new ExampleGameObeject1Class(this.ctx, 100, 100, settings.size));
        this.objectMap.set("exampleGameObject2", new ExampleGameObeject2Class(this.ctx, 100, 100, settings.size));
    }

}