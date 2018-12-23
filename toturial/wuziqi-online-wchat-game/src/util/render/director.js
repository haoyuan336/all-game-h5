const { pixelRatio, windowHeight, windowWidth, screenWidth, screenHeight, model } = wx.getSystemInfoSync()
import defines from './../../defines'
class Director {
    init(width, height) {

        let systemInfo = wx.getSystemInfoSync();
        let modelType = systemInfo.model;
        console.log('model type = ', modelType);

        console.log('width ', windowWidth);
        console.log('height', windowHeight);

        console.log('screen width ', screenWidth);
        console.log('screen height', screenHeight);

        this.width = windowWidth * pixelRatio;
        this.height = windowHeight * pixelRatio;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
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
      
        this.app.renderer.autoResize = true;
    

        this.app.ticker.add(this.update.bind(this));
        this.nowTime = new Date().getTime();

        this.root = new PIXI.Container();
        this.app.stage.addChild(this.root);
        // let currentRate = this.width / this.height;

        // if (currentRate < 0.462) {
        //     this.root.scale = {
        //         x: 1,
        //         y: this.width / this.height * (1334 / 750)
        //     }
        // }
        this.app.renderer.resize(750, 1334);
        this.designSize = {
            width: 750,
            height: 1334
        };
        if (modelType.indexOf('iPhone XS Max') != -1) {
            console.log('iPhone xs Max')
            // let button = wx.createBu
            this.app.renderer.resize(750, 1624);
            this.designSize = {
                width: 750,
                height: 1624
            };
        }


       
    
        this.app.renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => {
            point.x = x * 750 / windowWidth;
            point.y = y * 750 / windowWidth;
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
