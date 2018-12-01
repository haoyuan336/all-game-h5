/**
 * Created by wizard on 2017/9/23.
 */

const fs = require('fs');
const path = require('path');

const FileHelper = function () {
  let that = {};

  that.isExist = function (filename) {
    try {
      return fs.statSync(filename);
    } catch (ex) {
      //console.log(ex);
    }
    return false;
  };

  that.read = async function (filename) {
    return new Promise(function (resolve, reject) {
      fs.readFile(filename, 'utf8', function (err, data) {
        if (err) {
          console.log(err);
          reject(err);
          return
        }
        resolve(data);
      });
    });
  };

  const _ensurePath = function (filename) {
    var dirname = path.dirname(filename);
    if (fs.existsSync(dirname)) {
      return;
    }
    _ensurePath(dirname);
    fs.mkdirSync(dirname);
  };

  that.write = async function (filename, content, opt) {
    return new Promise(function (resolve, reject) {

      _ensurePath(filename);

      var exist = that.isExist(filename);

      if(!opt) {
        opt = {
          encoding: 'utf8'
        };
      }

      if (!exist || !exist.isFile()) {
        console.log(filename + 'not exist');
        opt.flag = 'wx';
      }

      fs.writeFile(filename, content, opt, function (err, data) {
        if (err) {
          console.log(err);
          reject(err);
          return
        }
        resolve()
      })
    });
  };



  that.walk = async function (pathname, handler) {
    return new Promise(function (resolve, reject) {

      var dirList = fs.readdirSync(pathname);

      (async ()=> {
        for(let i=0; i<dirList.length; ++i) {
          let item = dirList[i];
          if(fs.statSync(pathname + '/' + item).isDirectory()){
            await that.walk(pathname + '/' + item, handler);
          }else{
            let info = {
              path: pathname,
              name: item,
              base: path.parse(item).name,
              ext: path.extname(item)
            };
            handler.call(null,info);
          }
        }
        resolve();
      })();
    });

  };

  return that;
};

const fileHelper = FileHelper();

module.exports = fileHelper;