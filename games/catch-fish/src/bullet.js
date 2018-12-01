import {Sprite, director} from './../../../util/import'
import resources from './../resources'
import global from './../../global'
class Bullet extends Sprite{
    constructor(spec){

        let level = spec.level;
        let startPos = spec.startPos;
        let endPos = spec.endPos;
        let angle = spec.angle;


        let texture = global.resource[resources['paodan' + level]].texture;
        super(texture);
        this.position = startPos;
        this.rotation = angle;
        this._direction = spec.direction;
        this._controller = spec.controller;
        this._index = spec.index;
    }
    update(dt){
        this.position = {
            x: this.position.x + this._direction.x * dt,
            y: this.position.y + this._direction.y * dt
        }
        if (this.position.x < 0 || this.position.x > director.designSize.width || this.position.y < 0){
            this._controller.removeBullet(this._index);
        }
    }
} 
export default Bullet;