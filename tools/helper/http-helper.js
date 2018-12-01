/**
 * Created by wizard on 2017/9/26.
 */
const request = require('request');

const HttpHelper = function () {
  let that = {};

  that.request = async function (uri) {
    return new Promise(function (resolve, reject) {
      //todo yuchel: query uri
      request(uri, function (err, res, resBody) {
        if (err) {
          reject(err);
          return;
        }
        resolve(resBody);
      });
    });
  };

  return that;
};

let helper = HttpHelper();

module.exports = helper;