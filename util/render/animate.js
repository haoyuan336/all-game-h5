class Animate extends PIXI.extras.AnimatedSprite {
    constructor(textureList) {
        super(textureList);
        this.ClassType = 'animate';
        this._textureList = textureList;
        // let texture = textureList[this.currentFrame];
        // if (texture.textureInfo) {
        //     let textureInfo = texture.textureInfo;
        //     this.width = textureInfo.rotate ? textureInfo.frame.height : textureInfo.frame.width;
        //     this.height = textureInfo.rotate ? textureInfo.frame.width : textureInfo.frame.height;
        // }
    }
    animateUpdate(dt) {
        // this._textureInfo = 
        let currentTexture = this._textureList[this.currentFrame];
        if (currentTexture.textureInfo) {
            let textureInfo = currentTexture.textureInfo;
            this.width = textureInfo.rotate ? textureInfo.frame.height : textureInfo.frame.width;
            this.height = textureInfo.rotate ? textureInfo.frame.width : textureInfo.frame.height;
        }
    }

}
export default Animate;