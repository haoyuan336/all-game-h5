class SpriteFrame extends PIXI.Texture {
    constructor(packageTexture, textureInfo) {
        // let textureInfo = new TextureInfo(resources.json_texturepacker, textureNameList[i]);

        // let spriteFrame = new PIXI.Texture(texture, frame, undefined, undefined, rotate);
        super(packageTexture, textureInfo.frame, undefined, undefined, textureInfo.rotate);
        this.textureInfo = textureInfo;
    }
}
export default SpriteFrame;