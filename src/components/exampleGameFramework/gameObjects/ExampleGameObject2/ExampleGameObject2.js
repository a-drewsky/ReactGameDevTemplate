import ExampleGameObject2DataClass from "./ExampleGameObject2Data";
import ExampleGameObject2BuilderClass from "./ExampleGameObject2Builder";
import ExampleGameObject2ControllerClass from "./ExampleGameObject2Controller";
import ExampleGameObject2ViewClass from "./ExampleGameObject2View";

export default class ExampleGameObeject2Class {

    constructor(ctx, x, y, size){
        this.data = new ExampleGameObject2DataClass(x, y, size);
        this.builder = new ExampleGameObject2BuilderClass(this.data);
        this.controller = new ExampleGameObject2ControllerClass(this.data);
        this.view = new ExampleGameObject2ViewClass(ctx, this.data);
    }

}