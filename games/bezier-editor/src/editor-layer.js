import { Layer, Bezier } from './../../../util/import'
import { Graphics, Style, Shape, ShapeType } from './../../../util/render/graphics';
class EditorLayer extends Layer {
    constructor() {
        super();
        this.graphics = new Graphics();
        this.addChild(this.graphics);
        this.interactive = true;

        let bgRect = new Shape(ShapeType.Rect, 0, 0, 1920, 1280, new Style({
            fill: 0xFFFFFF,
            alpha: 0.4
        }));
        this.graphics.addChild(bgRect);

        let rect = new Shape(ShapeType.Rect, 1920 * 0.5 - 1024 * 0.5, 1280 * 0.5 - 660 * 0.5, 1024, 640, new Style({
            fill: 0xFFFFFF,
            alpha: 0.5,
            lineWidth: 6,
            lineColor: 0xFFFFFF
        }));
        this.graphics.addChild(rect);

        this._pointList = [];
        this._touchPoint = undefined;

        this._pathPointList = [];
    }
    update(dt) {
        // if (this.graphics) {
        //     this.graphics.update(dt);
        // }
    }
    onTouchStart(event) {
        let data = event.data.getLocalPosition(this);
        for (let i = 0; i < this._pointList.length; i++) {
            let point = this._pointList[i];
            if (point.isContain(data)) {
                this._touchPoint = point;
            }
        }
        if (this._touchPoint == undefined) {
            let point = new Shape(ShapeType.Circle, data.x, data.y, 20, new Style({
                fill: 0xFFFFFF,
                alpha: 0.5,
                lineWidth: 6,
                lineColor: 0xFFFFFF
            }));
            this.graphics.addChild(point);
            this._pointList.push(point);

        }
    }
    onTouchMove(event) {
        let data = event.data.getLocalPosition(this);
        if (this._touchPoint) {
            this._touchPoint.x = data.x,
                this._touchPoint.y = data.y;
        }
        this.updatePoint();
    }
    onTouchEnd() {
        this._touchPoint = undefined;
    }

    updatePoint() {
        //将路径点 都删掉
        for (let i = 0; i < this._pathPointList.length; i++) {
            this.graphics.removeChild(this._pathPointList[i]);
        }
        this._pathPointList = [];
        //根据控制点 生成路径点

        let bezier = Bezier(this._pointList, 0, 100);
        let pathList = bezier.getPoints(this._pointList.length * 5);
        for (let i = 0; i < pathList.length; i++) {
            let path = pathList[i];
            let point = new Shape(ShapeType.Circle, path.x, path.y, 10, new Style(
                {
                    fill: 0xFF00FF
                }
            ));
            this.graphics.addChild(point);
            this._pathPointList.push(point);
        }
    }

    clear() {
        console.log('clear');
        // this.graphics.removeAllChild();
        // this._pointList = [];
        for (let i = this._pointList.length - 1; i >= 0; i--) {
            let point = this._pointList[i];
            this.graphics.removeChild(point);
        }
        this._pointList = [];
    }
    export() {
        // console.log('export' + JSON.stringify(this._));

        let pathList = [];
        for (let i = 0; i < this._pointList.length; i++) {
            pathList.push({
                x: this._pointList[i].x - (1920 * 0.5 - 1024 * 0.5),
                y: this._pointList[i].y - (1280 * 0.5 - 640 * 0.5)
            })
        }

        var textToWrite = JSON.stringify(pathList);
        var textFileAsBlob = new Blob([textToWrite], { type: 'application/json' });
        var fileNameToSaveAs = 'fish_path_0.json';
        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null) {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
    }
}
export default EditorLayer;