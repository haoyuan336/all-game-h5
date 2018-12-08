/**
 * Created by wizard on 16/3/30.
 */

//import Tween from 'tween.js'

var helper = helper || {};

helper.getQueryString = (name) => {
    console.log('get data string = ' + window.location.search + ',' + name);
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    console.log('reg = ' + reg);
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
};

export default helper;