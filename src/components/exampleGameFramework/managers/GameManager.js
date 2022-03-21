import StateManagerClass from './StateManager';
import UIElementManagerClass from './UIElementManager';
import GameObjectManagerClass from './GameObjectManager';

export default class GameManagerClass {

    constructor(ctx, drawMethod, intervalList) {
        this.objects = new GameObjectManagerClass(ctx);
        this.ui = new UIElementManagerClass(ctx);
        this.state = new StateManagerClass(drawMethod, intervalList, this.objects, this.ui);
    }

}