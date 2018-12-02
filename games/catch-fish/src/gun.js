import { Layer, Animate, Vec2, director } from './../../../util/import'
import texturePackerSourceMap from './../texturepacker-source-map'
import PackageTexture from '../../common/package-texture'
import global from './../../global'
import resources from './../resources'
class Gun extends Layer {
    constructor(texture) {
        super(texture);
        //取出大炮的纹理
        this._level = 1;
        let textureList = this._getTextureList(this._level);
        this._animate = new Animate(textureList);
        this._animate.anchor = {
            x: 0.5,
            y: 0.8
        }
        this._animate.animationSpeed = 0.1;
        this._animate.loop = false;
        this.addChild(this._animate);

        this._animate.position = {
            x: director.designSize.width * 0.5 + 40,
            y: director.designSize.height - 20
        }
    }
    _getTexture(str) {
        let texture = new PackageTexture(resources.json_texturepacker ,texturePackerSourceMap[str]);
        return texture;
    }
    _getTextureList(level) {
        let list = [];
        for (let i = 0; i < 5; i++) {
            let str = 'weapon_level_' + level + '_' + i;
            list.push(this._getTexture(str));
        }
        return list;
    }
    addLevel(type) {
        console.log('升级炮' + type);
        let endLevel = this._level + 1 * (type === '+' ? 1 : -1);
        if (endLevel > 7 || endLevel < 1) {
            return;
        }
        this._level = endLevel;
        let textureList = this._getTextureList(this._level);
        this._animate.textures = textureList;
    }
    shoot(point) {
        //根据传来的点，旋转炮台的角度
        if (point.y > director.designSize.height - 80){
            return;
        }
        let animateVec = new Vec2(this._animate.position.x, this._animate.position.y);
        let pointVec = new Vec2(point.x, point.y);
        let direction = pointVec.sub(animateVec).getNormal();
        let angle =  - direction.getRadians(new Vec2(0, -1));
        this._animate.rotation = angle;
        this._animate.gotoAndPlay(0);
        this._animate.onComplete = function(){
        }

        //根据大炮的指向 给打出去的炮弹一个 其实位置
        let startPos = animateVec.add(direction.multi(100));

        global.event.fire('shoot-bullet', {
            level: this._level,
            startPos: startPos,
            endPos: point,
            angle: angle,
            direction: direction
        });

    }

}
export default Gun;