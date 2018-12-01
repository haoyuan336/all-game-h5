import global from '../global'
class TextureInfo {
    constructor(textureJson, textureName) {
        let json = global.resource[textureJson].data;
        let texturePos = json[textureName].textureRect;
        this.rotate =parseInt(json[textureName].textureRotated);
        this.frame = {
            x: texturePos[0],
            y: texturePos[1],
            width: this.rotate?texturePos[3]:texturePos[2],
            height: this.rotate?texturePos[2]:texturePos[3]
        }
    }
}
export default TextureInfo;