import { Layer, Sprite, director, Button } from '../util/import'
import global from './../global'
import resources from './../resources'
import { Shape, ShapeType, Graphics, Style } from './../util/render/graphics'
class WaitLayer extends Layer {
    constructor(controller) {
        super();
        this._controller = controller;
        let graphics = new Graphics();
        this.addChild(graphics);
        let rect = new Shape(ShapeType.Rect, 0, 0, 750, 1640, new Style({ fill: 0x000000, alpha: 0.5 }));
        graphics.addChild(rect);

        let title = new Sprite(global.resource[resources.wait_tips].texture);
        this.addChild(title);
        title.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.5 - 140
        }
        title.scale.set(2);

        let reStartButton = new Button({
            normalTexture: global.resource[resources.re_start_button].texture,
            touchCb: () => {
                console.log('重新匹配');
                this._controller.reStartGame();
            }
        });
        this.addChild(reStartButton);
        reStartButton.scale.set(1.8);
        reStartButton.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.5
        }

        let putFriendButton = new Button({
            normalTexture: global.resource[resources.shard_friend_button].texture,
            touchCb: () => {
                console.log('邀请好友');
                this._controller.shareToFriend();

            }
        });
        this._title = title;
        this.addChild(putFriendButton);
        putFriendButton.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.5 + 120
        }
        putFriendButton.scale.set(1.8);

        this.interactive = true;

    }
    reMatchGame() {
        this._title.texture = global.resource[resources.matching_title].texture;
        this._title.scale.set(2);
    }
    shareToFriend() {
        this._title.texture = global.resource[resources.wait_friend_tips].texture;
        this._title.scale.set(2);
    }

}
export default WaitLayer;