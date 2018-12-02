class Director {
    init(width, height) {
        this.width = width;
        this.height = height;
        this.runningScene = undefined;
        this.root = new PIXI.Application({ width: width, height: height });
        this.root.ticker.add(this.update.bind(this));
        this.nowTime = new Date().getTime();
        this.designSize = {
            width: width,
            height: height
        };
        this.sizeRate = this.width / this.height;
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
            this.root.stage.removeChild(this.runningScene);
            this.runningScene.destroy();
            this.runningScene = undefined;
        }
        this.root.stage.addChild(loadScene);
        loadScene.load(() => {
            console.log('资源加载完毕');
            this.root.stage.addChild(scene);
            this.root.stage.removeChild(loadScene);
            this.runningScene = scene;
            this.runningScene.onLoad();
        });

    }
    showApp(element) {
        element.appendChild(this.root.view);
    }
}
let director = new Director();
export default director;
