/**
 * Created by wizard on 2017/10/25.
 */

const fileHelper = require('./helper/file-helper');
const path =  require('path');

const ResourceLister = function (spec) {
  let that = {};

  let _entryPath = spec['game_entry'];
  //let _assetRoot = spec['assets_root'];
  //输出resource文件
  const _resOutput = spec['resource.js'];
  //输出预加载文件
  const _preloadOutput = spec['preload.js'];


  let _preloads = [];
  let _files = {};

  const _GetFileInfo = function (filename) {
    let extname = path.extname(filename).substr(1);
    let pathname = path.dirname(filename).substring(_entryPath.length);
    let basename = path.parse(filename).name;
    return {
      ext: extname,
      path: pathname,
      base: basename,
      full: pathname + basename + '.' + extname
    }
  };

  const _add2Files = function (key, val) {
    if(_files.hasOwnProperty(key) ) {
      console.warn(val + ' has been list more than once');
    }
    _files[key] = val;

    _preloads.push(val);
  };

  const _add2Frames = function (key, val) {
    if(_files.hasOwnProperty(key) ) {
      console.warn(val + ' has been list more than once');
    }
    _files[key] = val;
  };

  let _lister = {};
  _lister['.png']  = _lister['.jpg'] = function (filename) {
    let fileInfo = _GetFileInfo(filename);
    _add2Files(fileInfo.base, fileInfo.full);
  };

  _lister['.xml'] = _lister['.fnt'] = function (filename) {
    let fileInfo = _GetFileInfo(filename);
    _add2Files(fileInfo.ext + '_' + fileInfo.base, fileInfo.full);
  };

  let _needParseList = [];
  _lister['.json'] = function (filename) {
    let fileInfo = _GetFileInfo(filename);
    _add2Files(fileInfo.ext + '_' + fileInfo.base, fileInfo.full);
    _needParseList.push(filename);
  };

  that.addFile = function (filename) {
    let ext = path.extname(filename);
    if(_lister.hasOwnProperty(ext) ) {
      _lister[ext](filename);
    }
  };


  const _handlerParse = async function (filename) {
    let data = await fileHelper.read(filename);
    let json = JSON.parse(data);
    let frames = json['frames'];
    for(let framename in frames) {
      let baseName = path.parse(framename).name;
      _add2Frames(baseName, framename);
    }
  };

  that.doList = async function () {
    for(let parseFile of _needParseList) {
      await _handlerParse(parseFile);
    }

    let content = "const res = \n";
    content += JSON.stringify(_files, null, 2);
    content += ";\n";
    content += "export default res;";
    await fileHelper.write(_resOutput, content);
    console.log('gen res success');

    content = "const preload = \n";
    content += JSON.stringify(_preloads, null, 2);
    content += ";\n";
    content += "export default preload;";
    await fileHelper.write(_preloadOutput, content);
    console.log('gen res success');
  };

  return that;
};

module.exports = ResourceLister;
