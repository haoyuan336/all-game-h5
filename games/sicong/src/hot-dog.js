import { Sprite, State, director } from './../../../util/import'
import global from './../../global'
import resources from './../resources'

class HotDog extends Sprite {
    constructor() {
        super(global.resource[resources.hotdog].texture);
        this.scale.set(0.2);
        this._state = new State();
        this._cb = undefined;
        this._state.addState('fire-end', () => {
            if (this._cb) {
                this._cb();
            }
        });
    }
    update(dt) {
        if (this._state.getState() == 'fire') {
            this.position.x += dt;
            if (this.position.x - this.width * 0.5 > director.width) {
                this._state.setState('fire-end');
            }
        }
    }
    fire(cb) {
        this._state.setState('fire');
        this._cb = cb;
    }
}
export default HotDog;