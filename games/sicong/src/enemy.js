import {Sprite} from './../../../util/import'
import resources from './../resources'
import global from './../../global'
import EnemyAi from './enemy-ai'
class Enemy extends Sprite{
    constructor(type, controller){
        super(global.resource[resources[type]].texture);
        this.scale.set(0.5);
        this._enemyAi = new EnemyAi(this);
        this._controller = controller;
    }
    update(dt){
        if (this._enemyAi){
            this._enemyAi.update(dt);
        }
    }
    runEnd (){
        if (this._controller){
            this._controller.enemyRunEnd(this);
        }
    }
}

export default Enemy;