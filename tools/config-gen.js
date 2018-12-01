/**
 * Created by wizard on 2017/9/23.
 */
const fileHelper = require('./helper/file-helper');
const httpHelper = require('./helper/http-helper');
const processHelper = require('./helper/process-helper');

var condition = "release";
var originURL = {
  release: {
    gift: 'http://config.go.yuanfenba.net/x/config/GetGifts'  //http://api2.app.yuanfenba.net/Baidu/getAllGifts?wd=GnGgHHwNxe'

  },
  debug: {
    gift: 'http://test.logic.cfg.xiaoyouqipai.cn/x/config/GetGifts'  //'http://test.logic.ph2.xiaoyouqipai.cn/Baidu/getAllGifts?wd=GnGgHHwNxe'
  }
};


var outputFiles = {
  release : {
    gift: 'tools/output/release/gifts.json',
    effects : 'tools/output/release/effects.json'
  },
  debug : {
    gift: 'tools/output/debug/gifts.json',
    effects : 'tools/output/debug/effects.json'
  }
};

let effects = [];
let result = {};

var cloneJsonObj = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};


const configOneGift = function (gift) {
  var endIndex = 'gift_' + gift.id;
  if (result.hasOwnProperty(endIndex)) {
    console.warn("same gift : " + gift.id);
    return;
  }
  result[endIndex] = cloneJsonObj(gift);

  if (gift.packet == "") {
    return;
  }

  if (effects.indexOf(gift.packet) != -1) {
    console.warn("same gift effects : " + gift.id);
    return;
  }

  effects.push(gift.packet);
};

const genGifts = async function () {

  var respStr = await httpHelper.request(originURL[condition].gift, null, null);
  //console.log('resp: ' + respStr);
  //var destr = xxtea.decryptToString(respStr, 'xiaou');

  let stdout = await processHelper.exec('tools/tea -d ' + respStr);
  let resp = JSON.parse(stdout);

  if(resp.status != 'ok') {
    console.log('gifts api failed!');
    return;
  }

  let data = resp.res.gifts;

  for(let i=0; i<data.length; ++i) {
    configOneGift(data[i]);
  }


  await fileHelper.write(outputFiles[condition].gift, JSON.stringify(result, null, 2) );
  console.log('gift success');

  await fileHelper.write(outputFiles[condition].effects, JSON.stringify(effects, null, 2) );
  console.log('assets success');
  //console.log('decode: ' + destr);
  //

};

genGifts();
