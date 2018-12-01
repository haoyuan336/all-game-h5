/**
 * Created by wizard on 2017/10/25.
 */
const path = require('path');

const Compresser = function () {
  let that = {};

  let _compresser = {};
  //copy for these types
  _compresser['.fnt'] = _compresser['.json'] = _compresser['.xml'] = _compresser['.jpg'] = function (srcName, distName, handler) {
    console.log('cp: ' + srcName);
    if(srcName === distName) {
      handler();
      return;
    }
    var cmdStr = 'cp ' + srcName + ' ' + distName;
    jake.exec(cmdStr, function () {
      handler();
    });
  };
  //compress for png
  _compresser['.png'] = function (srcName, distName, handler) {
    let cmdStr = 'exe/pngquant ' + srcName + " -o " + distName;
    if(srcName === distName) {
      cmdStr += " -f";
    }
    jake.exec(cmdStr, function () {
      console.log('compress success: ' + distName);
      handler();
    });
  };

  that.compress = function (srcName, distName) {
    return new Promise(function (resolve, reject) {
      let ext = path.extname(srcName);
      console.log('ext: ' + ext);
      if(_compresser.hasOwnProperty(ext) ) {
        console.log('try compress: ' + srcName);
        _compresser[ext](srcName, distName, resolve);
      }
    });

  };

  return that;
};

let compresser = Compresser();
module.exports = compresser;