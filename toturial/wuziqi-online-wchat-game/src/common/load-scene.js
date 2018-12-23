import global from './../global'
import { director } from './../util/import'
import defines from './../defines'
class LoadScene extends PIXI.Container {
    constructor(resources) {
        super();
        this.loader = new PIXI.loaders.Loader();
        let resList = [];
        for (let i in resources) {
            resList.push({
                key: resources[i],
                url: defines.resourcesUrl +  resources[i].substr(1, resources[i].length - 1)
            });
        }
        this._resList = resList;

        this._totalCount = this._resList.length;
        this._graphics = new PIXI.Graphics();
        this.addChild(this._graphics);
        this._text = new PIXI.Text('100%', {
            fill: '#ffffff',
            fontSize: '10px'
        });

        this.addChild(this._text)


    }
    _loadRes(loader, resList) {
        this.drawProgress((this._totalCount - this._resList.length) / this._totalCount);
        if (this._resList.length == 0) {
            if (this.loadAllCb) {
                console.log('加载资源');
                this.loadAllCb();
            }
            return;
        }

        let param = resList.pop();
        if (global.resource && global.resource[param.key]) {
            this._loadRes(loader, resList);
        } else {
            console.log('不存在的资源');
            loader.add(param.url)
            loader.load((load, resource) => {
                // global.resource = resource;
                console.log('加载成功');
                global.resource[param.key] = resource[param.url];
                this._loadRes(loader, resList);
            });
        }
    }
    drawProgress(value) {
        // console.log('进度 = ' + value);
        this._graphics.clear();
        this._graphics.lineStyle(2, 0x0000FF, 1);
        this._graphics.beginFill(0xffffff, 1);
        this._graphics.drawRect(director.designSize.width * 0.5 - 50, director.designSize.height * 0.5, 100 * value, 20);
        this._text.position = {
            x: director.designSize.width * 0.5 - 50 + 100 * value,
            y: director.designSize.height * 0.5 + 5
        }
        this._text.text = Math.round(value * 100) + '%';
    }
    load(cb) {
        this.loadAllCb = cb;
        this._loadRes(this.loader, this._resList)

    }
    /**
     *  楚浩远
     *  1.互动游戏小货车优化（开发100%，已提测）上线日期12.14
     */
}
export default LoadScene;