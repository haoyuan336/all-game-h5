import Layer from './../../../util/render/layer'
import Sprite from '../../../util/render/sprite'
import resources from './../resources'
import global from './../../global'
import Fish from './fish'
import { FishType, FishWeight } from './fish-type'
import UILayer from './ui-layer'
import Bullet from './bullet'
class GameLayer extends Layer {
    constructor() {
        super();
        let bg = new Sprite(global.resource[resources.game_bg].texture);
        this.addChild(bg);
        bg.anchor.set(0);
        this._addFishTime = 0;
        this._fishMap = {};
        this._fishIdCount = 1;


        //浴池的列表
        this._fishPoolList = [];
        //初始化 浴池列表
        this._fishLayer = new Layer();
        this.addChild(this._fishLayer);

        this._uiLayer = new UILayer(this);
        this.addChild(this._uiLayer);

        global.event.on('shoot-bullet', this.shootBullet.bind(this));


        this._bulletMap = {};
        this._bulletIndex = 1;
    }
    shootBullet(data){
        data.controller = this;
        data.index = this._bulletIndex;
        let bullet = new Bullet(data);
        this.addChild(bullet);
        this._bulletMap[this._bulletIndex] = bullet;
        this._bulletIndex ++;

    }
    removeBullet(index){
        this.removeChild(this._bulletMap[index]);
        delete this._bulletMap[index];
    }
    update(dt) {
        if (this._addFishTime > 1000) {
            this._addFishTime = 0;
            this.addFish();
        } else {
            this._addFishTime += dt;
        }
        for (let i in this._fishMap) {
            let fish = this._fishMap[i];
            fish.fishUpdate(dt);
        }
    }
    getFishPoolList() {
        //根据鱼的权重 来初始化
        let fishPoolList = [];
        for (let i in FishWeight) {
            let weight = FishWeight[i];
            for (let j = 0; j < weight; j++) {
                let fishName = FishType[i];
                fishPoolList.push(fishName);
            }
        }

        //将列表打乱
        let list = [];
        let count = fishPoolList.length;
        for (let i = 0; i < count; i++) {
            let index = Math.round(Math.random() * (fishPoolList.length - 1));
            list.push(fishPoolList[index]);
            fishPoolList.splice(index, 1);
        }
        return list;
    }
    fishOver(type, index) {
        switch (type) {
            case 'run-end':
                // console.log('删除鱼');
                // this.removeChild(this._fishMap[index]);
                this._fishLayer.removeChild(this._fishMap[index]);
                delete this._fishMap[index];
                break;
            default:
                break;
        }
    }
    addFish() {

        //每条鱼出现的概率
        if (this._fishPoolList.length == 0) {
            this._fishPoolList = this.getFishPoolList();
        }
        let fishName = this._fishPoolList.pop();
        let fish = new Fish({
            fishName: fishName,
            index: this._fishIdCount,
            controller: this
        });
        this._fishMap[this._fishIdCount] = fish;
        this._fishIdCount++;
        this._fishLayer.addChild(fish);
    }
}
export default GameLayer;