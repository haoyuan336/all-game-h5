import { Sprite, State } from './../../../util/import'
import resources from './../resources'
import global from './../../global'
class SiCong extends Sprite {
    constructor(controller) {
        super(global.resource[resources.sicong].texture);
        this.scale.set(0.2);
        this.interactive = true;
        this._isTouching = false;
        this._fireTime = 0;
        this._controller = controller;
        this._state = new State();
        this._oldTouch = undefined;
    }
    onTouchStart() {
        if (this._state.getState() == 'run') {
            this._controller.shootBullet();

        }
        this._isTouching = true;

    }
    onTouchMove(event) {
        if (this._isTouching && this._state.getState() == 'run') {
            let data = event.data.getLocalPosition(this._controller);
           
            if (this._oldTouch == undefined){
                this._oldTouch = this.position;
            }
            let direction = {
                x: data.x - this._oldTouch.x,
                y: data.y - this._oldTouch.y
            }
            this._oldTouch = data;
            this.position = {
                x: this.position.x + direction.x,
                y: this.position.y + direction.y
            }
        }
    }
    onTouchEnd() {
        this._isTouching = false;
    }
    update(dt) {
        if (this._isTouching && this._state.getState() == 'run') {
            if (this._fireTime > 100) {
                this._fireTime = 0;
                this._controller.shootBullet();
            } else {
                this._fireTime += dt;
            }
        }
    }
    startGame() {
        this._state.setState('run');
    }
}
export default SiCong;