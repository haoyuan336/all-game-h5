class Label extends PIXI.Text{
    constructor(str, spec){
        let style = {
            fontFamily: 'Arial',
            fontSize: 20,
            fontStyle: 'normal',
            fontWeight: 'normal',
            fill: ['#000000'], // gradient
            // stroke: '#4a1850',
            // strokeThickness: 5,
            // dropShadow: true,
            // dropShadowColor: '#000000',
            // dropShadowBlur: 4,
            // dropShadowAngle: Math.PI / 6,
            // dropShadowDistance: 6,
            // wordWrap: true,
            // wordWrapWidth: 440
        }
        if (spec){
            for(let i in style){
                style[i] = spec[i]?spec[i]: style[i]
            }
        }
        let text = str?str: "";
        super(text, style);
    }
    setText(text){
        this.text = text;
    }
    update(){
        
    }
}
export default Label