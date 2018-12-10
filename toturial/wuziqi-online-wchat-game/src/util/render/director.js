const { pixelRatio, windowHeight, windowWidth } = wx.getSystemInfoSync()
class Director {
    init(width, height) {
        console.log('width ', windowWidth);
        console.log('height', windowHeight);
        this.width = windowWidth * pixelRatio;
        this.height = windowHeight * pixelRatio;
        this.runningScene = undefined;
        this.pixelRatio = pixelRatio;
        /* 根据需要 */
        PIXI.utils.isWebGLSupported = function () {
            return true
        }
        // PIXI.interaction.InteractionManager.prototype.mapPositionToPoint = (point, x, y) => {
        //     point.x = x * pixelRatio
        //     point.y = y * pixelRatio
        // }


        this.app = new PIXI.Application({
            view: canvas,
            width: width,
            height: height
        });



        this.app.ticker.add(this.update.bind(this));
        this.nowTime = new Date().getTime();

        this.root = new PIXI.Container();
        this.app.stage.addChild(this.root);
        let designSize = {
            width: 750,
            height: 1334
        }
        
        
        // this.root.scale = {
        //     x: 2,
        //     y: 1.6
        // }
        let currentRate = this.width / this.height;
        console.log('current rate = ', currentRate);
        director.screenType = 'normal';

        if (currentRate < 0.462) {
            director.screenType = 'length';
        }
        this.designSize = {
            width: this.width,
            height: this.height
        };
        this.app.renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => {
            point.x = x * 2;
            point.y = y * 2;
        }
    }

    update() {
        let currentTime = new Date().getTime();
        let dt = currentTime - this.nowTime;
        this.nowTime = currentTime;
        if (this.runningScene) {
            this.runningScene.update(dt);
        }
        TWEEN.update();

    }
    reSetSize(width, height) {
        console.log('重新设置尺寸?')
    }
    startScene(loadScene, scene) {
        // this.runningScene = scene;

        if (this.runningScene) {
            // this.app.stage.removeChild(this.runningScene);
            this.root.removeChild(this.runningScene);
            this.runningScene.destroy();
            this.runningScene = undefined;
        }
        this.root.addChild(loadScene);
        loadScene.load(() => {
            console.log('资源加载完毕');
            this.root.addChild(scene);
            this.root.removeChild(loadScene);
            this.runningScene = scene;
            this.runningScene.onLoad();
        });

    }
    showApp(element) {
        // element.appendChild(this.root.view);
    }
}
let director = new Director();
export default director;
