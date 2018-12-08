/**
 * Created by wizard on 2017/10/18.
 */

const process = require('child_process');

const ProcessHelper = function () {
  let that = {};

  that.exec = function (cmd) {
    return new Promise(function (resolve, reject) {
      process.exec(cmd, function (err, stdout, stderr) {
        if (err) {
          reject(err);
          return;
        }

        if(stderr) {
          reject(stderr);
          return;
        }

        resolve(stdout);
      });
    });
  };

  return that;
};

const processHelper = ProcessHelper();

module.exports = processHelper;