import { Layer, Button, director } from './../../../util/import'
class ReadyLayer extends Layer {
    constructor(gamelayer, type) {
        super();
        let str = 'start'
        if (type && type == 'retry') {
            str = 'retry';
        }
        let startButton = new Button({
            text: str,
            touchCb: () => {
                console.log('开始游戏');
                gamelayer.startGame();
                this.outEffect();
            }
        });
        startButton.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 1.1
        }
        this.addChild(startButton);
        this._startButton = startButton;
        this.enterEffect();

    }
    enterEffect(){
        let enterEffect = new TWEEN
        .Tween(this._startButton.position)
        .to({
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.7
        }, 400)
        enterEffect.start();
    }
    outEffect(){
        let enterEffect = new TWEEN
        .Tween(this._startButton.position)
        .to({
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 1.1
        }, 400)
        .onComplete(()=>{
            console.log('完成');
        })
        enterEffect.start();
    }
    showReady(){
        this.enterEffect();
    }
}
export default ReadyLayer;