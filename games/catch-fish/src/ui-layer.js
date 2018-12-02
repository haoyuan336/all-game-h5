import { Layer, Sprite, director, Button } from './../../../util/import'
import global from './../../global'
import resource from './../resources'
import texturespackInfo from './../texturepacker-source-map'
import TextureInfo from './../../common/texture-info'
import Gun from './gun'
import PackageTexture from '../../common/package-texture'
import texturePackerSourceMap from './../texturepacker-source-map'

class UILayer extends Layer {
    constructor(controller) {
        super();
        this._controller = controller;


        let bigBg = new Sprite(global.resource[resource.game_bg].texture);
        this.addChild(bigBg);
        bigBg.alpha = 0;
        bigBg.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.5
        }
        //首先放一个炮台的背景
        let bg = new Sprite(
            global.resource[resource.texturespack].texture,
            new TextureInfo(resource.json_texturepacker, texturespackInfo.bottomBar)
        );
        this.addChild(bg);
        bg.position.x = director.designSize.width * 0.5;
        bg.position.y = director.designSize.height - bg.height * 0.5;
        this._gun = new Gun();
        this.addChild(this._gun);
        let addButton = new Button({
            normalTexture: new PackageTexture(resource.json_texturepacker , texturePackerSourceMap.cannonPlus),
            pressedTexture: new PackageTexture(resource.json_texturepacker, texturePackerSourceMap.cannonPlusDown),
            click: () => {
                console.log('加 按钮');
                this._gun.addLevel('+');
            }
        });
        addButton.position = {
            x: director.designSize.width * 0.5 + 100,
            y: director.designSize.height - 20
        }
        this.addChild(addButton);

        let subButton = new Button({
            normalTexture: new PackageTexture(resource.json_texturepacker,texturePackerSourceMap.cannonMinus),
            pressedTexture: new PackageTexture(resource.json_texturepacker,texturePackerSourceMap.cannonMinusDown),
            click: () => {
                console.log('减 按钮');
                this._gun.addLevel('-');

            }
        });
        subButton.position = {
            x: director.designSize.width * 0.5 - 20,
            y: director.designSize.height - 20
        }
        this.addChild(subButton);
        this.interactive = true;
    }
    onTouchStart(event) {
        let data = event.data.getLocalPosition(this);
        // console.log('touch', data);
        this._gun.shoot(data);
    }
}
export default UILayer;