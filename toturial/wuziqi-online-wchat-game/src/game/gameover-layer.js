import { Layer , director, Label, Sprite} from './../util/import'
import {Graphics, Style, Shape, ShapeType} from './../util/render/graphics'
import global from './../global'
import resources from './../resources'
class GameOverLayer extends Layer{
    constructor(color){
        super();
        console.log('画矩形');
        let graphics = new Graphics();
        this.addChild(graphics);
        let rect = new Shape(ShapeType.Rect, 0,0,750, 1640, new Style({fill: color == 'black'?0xd1ccc6:0x000000}));
        graphics.addChild(rect);


        let label = new Label('胜利', {
            fontSize: 100,
            fill: color == 'black'? 0x000000:0xffffff
        });
        this.addChild(label);
        label.anchor.set(0.5);
        label.position = {
            x: 750 * 0.5,
            y: 500
        }
        let piece = new Sprite(global.resource[color == 'black'?resources.piece_black:resources.piece_white].texture);
        this.addChild(piece);
        piece.scale.set(2);
        piece.position = {
            x: 750 * 0.5,
            y: 600
        }
    }
}
export default GameOverLayer;