/**
 * Created by wizard on 2017/9/23.
 */
console.log('process argv = ' + JSON.stringify(process.argv))
const fileHelper = require('./helper/file-helper');
const path = require('path');

//资源根目录
// const resourcePath = './assets';
let resourcePath = './dist/img';

if (process.argv.length < 3) {
  console.error("参数不够");
  return
}
if (process.argv.length != 0) {
  resourcePath = process.argv[2] + 'images';
}
console.log('resourcesPath  = ' + resourcePath);
//合图文件目录,会解析合图json,加入resource定义中方便使用
const packFolder = process.argv[2];
//不预加载的文件夹列表
const noLoadFolders = ['./assets/sounds'];

//写入resource的文件类型
const typeList = ['.json', '.png', '.fnt', '.jpg', '.xml', '.bmp'];
//这些文件会在resouce中加前缀
const fixList = ['.json', '.fnt', '.xml'];

//输出resource文件
const resOutput = process.argv[2] + "/resources.js";
//输出预加载文件
// const preloadOutput = "src/resources-preload.js";


const handlePackRes = async function (filename, output) {
  data = await fileHelper.read(filename);
  let json = JSON.parse(data);
  let frames = json['frames'];
  for (let index in frames) {
    console.log('frame name: ' + index);
    let key = path.parse(index).name;
    output[key] = index;
  }
};

const listFiles = async function () {

  var packFiles = [];
  var result = {};
  var preload = [];

  const add2Exports = (key, fileInfo) => {
    if (result.hasOwnProperty(key)) {
      console.warn('res name already added: ' + key);
      return;
    }
    result[key] = fileInfo.path + '/' + fileInfo.name;
    // result[key] =  'dist/assets/' + fileInfo.name;

    if (noLoadFolders.indexOf(fileInfo.path) != -1) {
      return;
    }

    preload.push(fileInfo.path + '/' + fileInfo.name);
  };

  await fileHelper.walk(resourcePath, function (fileInfo) {
    console.log('path: ' + fileInfo.path);
    console.log('name: ' + fileInfo.name);
    console.log('base: ' + fileInfo.base);
    console.log('ext: ' + fileInfo.ext);

    if (typeList.indexOf(fileInfo.ext) != -1) {
      let fixedKey = fileInfo.base;
      if (fixList.indexOf(fileInfo.ext) != -1) {
        fixedKey = fileInfo.ext.substr(1) + "_" + fileInfo.base;
      }
      add2Exports(fixedKey, fileInfo);
    }

    if (fileInfo.ext == '.json' && fileInfo.path == packFolder) {
      packFiles.push(fileInfo.path + '/' + fileInfo.name);
      console.log('handle pack: ' + fileInfo.name);
    }
  });

  for (let i = 0; i < packFiles.length; ++i) {
    await handlePackRes(packFiles[i], result);
  }

  let content = "const res = \n";
  content += JSON.stringify(result, null, 2);
  content += ";\n";
  content += "export default res;";
  await fileHelper.write(resOutput, content);
  console.log('gen res success');

  content = "const preload = \n";
  content += JSON.stringify(preload, null, 2);
  content += ";\n";
  content += "export default preload;";
  // await fileHelper.write(preloadOutput, content);
  console.log('gen res success');
};

listFiles();