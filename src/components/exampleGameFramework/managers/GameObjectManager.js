
//Import Game Object
import ExampleGameObeject1Class from '../gameObjects/ExampleGameObject1/ExampleGameObject1'
import ExampleGameObeject2Class from '../gameObjects/ExampleGameObject2/ExampleGameObject2';

export default class GameObjectManagerClass {

    constructor(ctx) {
        this.ctx = ctx;

        this.objectMap = new Map();

        this.objectStates = {
            disabled: 'disabled',
            inactive: 'inactive',
            active: 'active'
         }
    }

    //Set Object States
    setDisabled = (objectName) => {
        this.objectMap.get(objectName).object.data.setState(this.objectStates.disabled);
    }
    setInactive = (objectName) => {
        this.objectMap.get(objectName).object.data.setState(this.objectStates.inactive);
    }
    setActive = (objectName) => {
        this.objectMap.get(objectName).object.data.setState(this.objectStates.active);
    }

    //Delete Object
    deleteElement = (objectName) => {
        this.objectMap.delete(objectName);
    }

    //Set up function
    createObjects = (settings) => {
        this.objectMap.set("exampleGameObject1", {
            object: new ExampleGameObeject1Class(this.ctx, 100, 100, settings.size),
            state: this.objectStates.active
        });

        this.objectMap.set("exampleGameObject2", {
            object: new ExampleGameObeject2Class(this.ctx, 100, 100, settings.size),
            state: this.objectStates.active
        });
    }

}