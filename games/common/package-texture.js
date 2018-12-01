import {SpriteFrame} from '../../util/import'
import global from '../global'
import resources from '../catch-fish/resources'
import TextureInfo from './texture-info'
class PackageTexture extends SpriteFrame{
    constructor( jsonTexturePacker,textureName){
        let textureInfo = new TextureInfo(jsonTexturePacker, textureName);
        super(global.resource[resources.texturespack].texture, textureInfo);
    }
}
export default PackageTexture;