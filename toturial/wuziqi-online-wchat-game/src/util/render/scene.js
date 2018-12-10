import director from './director'
class Scene extends PIXI.Container {
    constructor() {
        super();
        this.nowTime = new Date().getTime();
        this.childLayerList = [];
    }
    recursiveChild(object, dt) {
        if (object.update && object.ClassType !== 'animate') {
            object.update(dt);
        }
        if(object.animateUpdate){
            object.animateUpdate(dt);
        }
        for (let i = 0; i < object.children.length; i++) {
            this.recursiveChild(object.children[i], dt);
        }
    }
    update(dt) {
        for (let i = 0; i < this.childLayerList.length; i++) {
            // this.childLayerList[i].update(dt);
            this.recursiveChild(this.childLayerList[i], dt);
        }
    }
    addLayer(layer) {
        this.childLayerList.push(layer);
        this.addChild(layer);
    }
    removeLayer(layer) {
        for (let i = 0; i < this.childLayerList.length; i++) {
            if (this.childLayerList[i] == layer) {
                this.childLayerList.splice(i, 1);
            }
        }
        this.removeChild(layer);
    }
    onLoad() {

    }
   
    destroy() {
        console.log('scene destroy');
        for (let i = 0; i < this.childLayerList.length; i++) {
            this.childLayerList[i].destroy();
        }
    }
}
export default Scene;