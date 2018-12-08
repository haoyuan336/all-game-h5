/**
 * Created by wizard on 2017/10/27.
 */

const path = require('path');

const mp3Duration = require('mp3-duration');

const fileHelper = require('./helper/file-helper');

let soundResult = {};

let outPutFile = '../assets/config/sound-config.json';

task('config_sound', {async:true}, function () {

  let distBasePath = '../assets/sounds/';
  let fileList = new jake.FileList();
  fileList.include(distBasePath + '**/*.mp3');

  let array = fileList.toArray();

  let thisTask = this;

  const readDuration = function (filename) {
    return new Promise(function (resolve, reject) {
      mp3Duration(filename, function (err, duration) {
        if (err) {
          console.log(err.message);
          reject(err);
          return;
        }

        let key = path.parse(filename).name;
        if(soundResult.hasOwnProperty(key) ) {
          console.warn('same sound more that once: ' + key);
          soundResult[key].duration = duration;
        } else {
          soundResult[key] = {
            channel : 1,
            duration: duration
          };
        }

        console.log('config: ' + key + " duration: " + duration);
        resolve();
      });
    })
  };

  (async()=>{
    let content;
    try {
      content= await fileHelper.read(outPutFile);
    } catch(err) {
      console.log(err.message);
    }

    if (content) {
      soundResult = JSON.parse(content)
    }

    for(filename of array) {
      await readDuration(filename);
    }
    thisTask.complete();
  }) ();
});

task('save_config', ["config_sound"], {async: true}, function () {

  let thisTask = this;
  (async()=> {
    let content = JSON.stringify(soundResult, null, 2);
    await fileHelper.write(outPutFile, content);
    thisTask.complete();
    console.log('gen res success');
  })();

});


task('default', ["save_config"], function () {
  console.log('config sound finish');
});
