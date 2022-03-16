import ExampleGameObject1DataClass from "./ExampleGameObject1Data";
import ExampleGameObject1BuilderClass from "./ExampleGameObject1Builder";
import ExampleGameObject1ControllerClass from "./ExampleGameObject1Controller";
import ExampleGameObject1ViewClass from "./ExampleGameObject1View";

export default class ExampleGameObeject1Class {

    constructor(ctx, x, y, size){
        this.data = new ExampleGameObject1DataClass(x, y, size);
        this.builder = new ExampleGameObject1BuilderClass(this.data);
        this.controller = new ExampleGameObject1ControllerClass(this.data);
        this.view = new ExampleGameObject1ViewClass(ctx, this.data);
    }

}