
import { director, State, Vec2 } from './../../../util/import'
import resources from './../resources'
import global from './../../global'
const PathMap = {
    "path_0": resources.json_path_0,
    "path_1": resources.json_path_1,
    "path_2": resources.json_path_2,
    "path_3": resources.json_path_3,
    "path_4": resources.json_path_4,
    "path_5": resources.json_path_5,
    "path_6": resources.json_path_6,
    "path_7": resources.json_path_7
}

class EnemyAi {
    constructor(node) {
        this._node = node;
        this._state = new State();
        this._node.position = {
            x: director.designSize.width,
            y: 0
        }
        this._state.setState('enter');
        // this._targetPos = 
        //随机宇哥path map 

        let randomIndex = Math.round(Math.random() * (Object.keys(PathMap).length - 1));
        console.log('random index ', randomIndex);
        let key = Object.keys(PathMap)[randomIndex];
        console.log('key', key);
        this._controllerPath = global.resource[PathMap[key]].data;
        this._controllerIndex = 0;
        this._pathList = undefined;
        this._pathIndex = 0;
        this._currentPoint = undefined;
        this._node.position = this._controllerPath[0];


        this._state.setState('run');

        this._state.addState('wait', ()=>{
            setTimeout(()=>{
                this._state.setState('run');
            }, 2000);
        })
        this._state.addState('end', ()=>{
            console.log('end');
            this._node.runEnd();
        })
    }
    enterEffect(dt) {
        // this._node.position.x -= dt;
        // this._node.position.y += dt;

    }
    update(dt) {


        if (this._state.getState() == 'run') {
            if (this._pathList == undefined) {
                //取出路径点
                if (this._controllerIndex < this._controllerPath.length - 1) {
                    let v1 = new Vec2(
                        this._controllerPath[this._controllerIndex].x,
                        this._controllerPath[this._controllerIndex].y
                    );
                    let v2 = new Vec2(
                        this._controllerPath[this._controllerIndex + 1].x,
                        this._controllerPath[this._controllerIndex + 1].y
                    );
                    let distance = v1.distance(v2);
                    let count = Math.floor(distance / 20);
                    let currentDis = distance / count;
                    let direction = v2.sub(v1).getNormal();
                    this._pathList = [v1];
                    for (let i = 1; i < count - 1; i++) {
                        let disP = direction.multi(currentDis);
                        let endP = this._pathList[i - 1].add(disP.x, disP.y);
                        this._pathList.push(endP);
                    }
                }
            } else {

                if (this._currentPoint == undefined) {
                    if (this._pathIndex < this._pathList.length) {
                        this._currentPoint = this._pathList[this._pathIndex];
                        this._pathIndex++;

                    } else {
                        this._pathIndex = 0;
                        this._controllerIndex++;
                        if (this._controllerIndex == 1) {
                            this._state.setState('wait');
                        }

                        if (this._controllerIndex == 2){
                            this._state.setState('end');
                        }
                        this._pathList = undefined;

                    }
                }
            }

            if (this._currentPoint) {
                let v1 = new Vec2(this._node.position.x, this._node.position.y);
                let dis = this._currentPoint.distance(v1);
                if (dis < dt) {
                    this._currentPoint = undefined;
                } else {
                    let direction = this._currentPoint.sub(v1).getNormal();
                    if (this._node) {
                        this._node.position = {
                            x: this._node.position.x + direction.x * dt / 20,
                            y: this._node.position.y + direction.y * dt / 20
                        }
                    }
                }

            }
        }
    }

}
export default EnemyAi;