import { Animate, Bezier, Vec2 } from './../../../util/import'
import global from './../../global'
import sourcesMap from './../texturepacker-source-map'
import State from './../../common/state'
import PackageTexture from '../../common/package-texture'
import { FishPath } from './fish-type'
import resources from './../resources'
function getTextureList(fishName, type) {
    let list = [];
    for (let i = 0; i < 10; i++) {
        let str = 'fish_' + fishName + '_' + type + '_' + i;
        if (sourcesMap[str]) {
            list.push(new PackageTexture(  resources.json_texturepacker,sourcesMap[str]));
        }
    }
    return list;
}
class Fish extends Animate {
    constructor(spec) {
        //首先取出这条鱼的 游动的纹理

        let fishName = spec.fishName;
        let controller = spec.controller;
        let runTextureList = getTextureList(fishName, 'run');
        let deadTextureList = getTextureList(fishName, 'dead');
        super(runTextureList);
        this._index = index;
        this._controller = controller;
        this._index = spec.index;
        this._runTextureList = runTextureList;
        this._deadTextureList = deadTextureList;
        this.animationSpeed = 0.1;
        this._state = new State();
        this._state.addState('run', () => {
            this.textures = this._runTextureList;
            this.play();
        })
        this._state.addState('dead', () => {
            // this.gotoAndPlay(this.animateFrameNum.dead.start);
            this.stop();
            this.textures = this._deadTextureList;
            this.loop = false;
            this.gotoAndPlay(0);
        });

        this._state.addState('run-end', () => {
            //游动结束了 
            controller.fishOver('run-end', this._index);
        })
        this._state.setState('run');
        //随机一条鱼的路径
        let keys = Object.keys(FishPath);
        let index = keys[Math.round(Math.random() * (keys.length - 1))];
        let value = FishPath[index];
        let bezierController = global.resource[value].data;
        this._pathPointList = Bezier(bezierController, 0, 100).getPoints(100);
        this.position = this._pathPointList[0];
        this.anchor.set(0.5);



    }
    fishUpdate(dt) {
        if (this._state.getState() === 'run') {
            if (this._pathPointList.length !== 0) {
                //取出来第一个点
                if (this._currentTargetPoint == undefined) {
                    let point = this._pathPointList.shift();
                    //目标位置 需要在调整一下
                    point = {
                        x: point.x,
                        y: point.y
                    }
                    this._currentTargetPoint = new Vec2(point.x, point.y);
                }
                if (this._currentTargetPoint) {
                    let dis = this._currentTargetPoint.distance(this.position);
                    if (dis > 5) {
                        let direction = this._currentTargetPoint.sub(this.position).getNormal();
                        this.position = {
                            x: this.position.x + direction.x * dt / 10,
                            y: this.position.y + direction.y * dt / 10
                        }
                        let angle = new Vec2(0, 1).getRadians(direction);
                        let disAngle = (angle + Math.PI * 0.5 - this.rotation) % (Math.PI * 0.5);
                        this.rotation += Math.abs(disAngle * 0.1) * (disAngle / Math.abs(disAngle));
                    } else {
                        let point = this._pathPointList.shift();

                        //目标位置 需要在调整一下
                        point = {
                            x: point.x,
                            y: point.y
                        }

                        this._currentTargetPoint = new Vec2(point.x, point.y);
                    }
                }
            } else {
                this._state.setState('run-end');
            }
        }
    }
}
export default Fish;