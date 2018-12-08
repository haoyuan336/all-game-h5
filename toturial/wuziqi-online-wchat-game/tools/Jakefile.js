/**
 * Created by wizard on 2017/9/23.
 */

const path = require('path');
const compresser = require('./compresser');
const ResourceLister = require('./resource-lister');


const config = {
  "resource_root": "../../art_space/",//资源根目录
  "resource_origins": "pictures/origins",//不合图的图片子目录
  "assets": "../assets/",//打包目录
  "resource.js": '../src/resources.js',
  "preload.js": '../src/resources-preload.js'
};

const jakeExec = async function (cmdStr) {
  return new Promise(function (resolve, reject) {
    jake.exec(cmdStr, resolve);
  });
};

const distFileName = (filename, srcPath, distPath) => {
  var pathname = path.dirname(filename);
  var basename = path.basename(filename);

  let subPath = pathname.substring(srcPath.length);
  if (subPath.length > 0) {
    subPath += '/';
  }

  return {
    pathname: distPath + subPath,
    filename: distPath + subPath + basename
  };
};

const fileWorker = (srcPath, distPath, filter, handler)=> {
  let fileList = new jake.FileList();
  filter.forEach(function (oneFilter) {
    fileList.include(oneFilter);
  });

  let array = fileList.toArray();

  let taskList = [];

  for (let ele of array) {
    let distFile = distFileName(ele, srcPath, distPath);
    //ensure path
    jake.mkdirP(distFile.pathname);

    let tasker = file;
    let pres = [];
    if(ele === distFile.filename) {
      tasker = task;
    } else {
      pres.push(ele);
    }

    //file task
    tasker(distFile.filename, pres, {async: true}, function () {
      let fileTask = this;
      handler(ele, distFile.filename, function () {
        fileTask.complete();
      });
    });

    taskList.push(distFile.filename);
  }

  return taskList;
};

task('pack', {async: true}, function () {

  let startPath = config['resource_root'];
  let middlePath = config['assets'] + "packed/";

  var tpList = new jake.FileList();
  tpList.include(startPath + '**/*.tps');

  let array = tpList.toArray();

  let task = this;

  (async ()=> {
    for (let ele of array) {
      console.log('start tp: ' + ele);
      var sheetName = middlePath + 'tp_' + path.basename(ele, '.tps') + '.png';
      var dataName = middlePath + 'tp_' + path.basename(ele, '.tps') + '.json';

      var cmdStr = 'TexturePacker ' + ele;
      cmdStr += ' --sheet ' + sheetName;
      cmdStr += ' --data ' + dataName;

      await jakeExec(cmdStr);
    }

    task.complete();
  })();


});

task('copy', {async: true}, function () {

  let startPath = config['resource_root'] + config['resource_origins'];
  let middlePath = config['assets'] + "unpack/";

  let filters = [startPath + '/**/*.*'];

  let taskList = fileWorker(startPath, middlePath, filters, function (srcName, middleName, handler) {
    console.log('cp: ' + srcName + " : " + middleName);
    var cmdStr = 'cp ' + srcName + ' ' + middleName;
    jake.exec(cmdStr, handler);
  });

  let thisTask = this;
  task('end_copy', taskList, function () {
    thisTask.complete();
  }).invoke();
});

task('compress', {async:true}, function () {

  let basePath = config['assets'];
  let distBasePath = config['assets'];

  let filters = [basePath + '/**/*.*'];

  let taskList = fileWorker(basePath, distBasePath, filters, function (srcFileName, distFileName, handler) {
    (async ()=> {
      await compresser.compress(srcFileName, distFileName);
      handler();
    })();

  });


  let thisTask = this;
  task('end_compress', taskList, function () {
    thisTask.complete();
  }).invoke();
});

task('ui', function () {

});

task('list_file', {async:true}, function () {
  let distBasePath = config['assets'];
  let fileList = new jake.FileList();
  fileList.include(distBasePath + '**/*.*');

  let array = fileList.toArray();

  console.log('list files: ' + array);

  let resList = ResourceLister({
    'game_entry': '../',
    'resource.js': config['resource.js'],
    'preload.js': config['preload.js']
  });

  for(let filename of array) {
    resList.addFile(filename);
  }

  let thisTask = this;
  (async ()=> {
    await resList.doList();
    thisTask.complete();
  })();


});

const fileHelper = require('./helper/file-helper');
const processHelper = require('./helper/process-helper');

task('tea', function () {

  let thisTask = this;
  (async ()=> {
    let content = await fileHelper.read('exe/ori.txt');
    //console.log("e " + content + '\n');
    let dcontent = await processHelper.exec('exe/tea -d ' + content);
    //console.log("d " + dcontent);
    let result = JSON.stringify(JSON.parse(dcontent), null, 2);
    fileHelper.write('exe/out.txt', result);
    thisTask.complete();
  }) ();

});

task('all_files', function () {
  let fileList = new jake.FileList();
  fileList.include('../assets/' + '**/*.png');
  //fileList.include('../build/' + '**/*.*');

  let array = fileList.toArray();

  let content ="";

  for(let filename of array) {
    let name = filename.substr(3);
    content += "\<file-url\>http:\/\/page.xiaoyaoai.cn\/game_fish\/" + name + "\<\/file-url\>";
    content += "\n"
  }

  fileHelper.write('./exe/files.txt', content);
});

task('fix_res', function () {
  let fileList = new jake.FileList();
  fileList.include('../assets/animate/' + '**/*.json');
  fileList.include('../assets/exports/' + '**/*.json');

  let array = fileList.toArray();

  (async ()=>{
    let errs = "";
    for(let filename of array) {
      let dir = path.dirname(filename);
      let newfilename = filename.replace('assets', 'assets_fixed');
      let content = await fileHelper.read(filename);
      let json = JSON.parse(content);
      if(!json.hasOwnProperty('frames') || !json.hasOwnProperty('meta') ) {
        continue;
      }
      let frames = json['frames'];
      let size = json['meta']['size'];
      for(let index in frames) {
        let oneframe = frames[index];
        if(oneframe.frame.x + oneframe.frame.w > size.w || oneframe.frame.y + oneframe.frame.h > size.h) {
          errs += "err file: " + filename + '\n';
          errs += "err frame " + index + '\n';
        }
      }
    }

    await fileHelper.write('../errs_log', errs);
  })();

});

const requestHelper = require('./helper/http-helper');
task('test_cdn', function () {
  let fileList = new jake.FileList();
  fileList.include('../assets/' + '**/*.png');

  let array = fileList.toArray();

  (async ()=>{
    for(let filename of array) {
      let name = filename.substr(3);
      let httpPng = "http:\/\/page.xiaoyaoai.cn\/game_fish\/" + name;
      let content = await requestHelper.request({
        url: httpPng,
        encoding: 'binary'
      });

      fileHelper.write('../download/' + name, content, {encoding: 'binary'});
    }
  })();
});

const ftpClient = require('ftp');

task('test_ftp', function () {
  let c = new ftpClient();
  c.on('ready', function() {

    // c.list(function(err, list) {
    //   if (err) throw err;
    //   console.dir(list);
    //   c.end();
    // });
    // c.get('app_zips/game_fish.zip', function(err, stream) {
    //   if (err) throw err;
    //   stream.once('close', function() { c.end(); });
    //   stream.pipe(fs.createWriteStream('game_fish-copy.zip'));
    // });

    // c.put('test.js', 'app_zips/test.js', function(err) {
    //   if (err) throw err;
    //   c.end();
    // });
  });

  c.connect({
    host: 'ow.xiaoyouapp.cn',
    port: 21,
    user:'lyc',
    password:'lyc@123'
  });
});

task('default', ["pack", "copy", "compress", "list_file"], function () {
  console.log('resource finish end');
});