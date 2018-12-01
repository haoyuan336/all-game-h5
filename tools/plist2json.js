if (process.argv.length < 3) {
    return
}
let gamePath = process.argv[2];
let plistPath = gamePath + '/images/';
const fs = require('fs');
var parseString = require('xml2js').parseString;
const files = fs.readdirSync(plistPath);
let plistList = [];
files.forEach((v, k) => {
    if (v.indexOf('.plist') !== -1) {
        plistList.push(v);
    }
})
let getStringInfo = function (key, string) {
    let test = /{{/;
    console.log('test  = ', test.test(string));
    let numList = [''];

    for (let i = 0; i < string.length; i++) {
        if (/[0-9]/.test(string[i])) {
            // numList[numList.length - 1] += string[i];
            numList[numList.length - 1] += string[i];
        } else {
            numList.push('')
            // numList.push('');
            // string = string.substring(i, string.length);
        }
    }

    for (let i = numList.length - 1 ; i >=  0; i --){
        if (numList[i]=== ''){
            numList.splice(i, 1);
        }else{
            numList[i] = Number(numList[i]);
        }
    }
    console.log('num = ' , numList);


    // console.log('pos str = ' + posStr);
    let str = '    "' + key + '"' + ":" + JSON.stringify(numList);
    return str;
}
let getPosJson = function (name, data) {
    let keys = data.key;
    let stringList = data.string;
    let stringPos = '';
    for (let i = 0; i < keys.length; i++) {

        if (i !== 0 && i !== keys.length - 1) {
            let key = keys[i];
            let string = stringList[i - 1];
            let stringInfo = getStringInfo(key, string);
            stringPos += stringInfo + ',' + '\n';
        }else if(i == keys.length - 1){
            //如果遍历到最后一个元素的时候
            let value = 0;
            if (data['true'] == ''){
                value = 2;
            }
            stringPos += '    "' + keys[i] + '"' + ':' + '"' + value  + '"'+ ',\n'
        }
    }

    // console.log('pos json ', data);
    

    stringPos = stringPos.substring(0, stringPos.length - 2);

    return '"' + name + '"' + ':{\n'  +stringPos + "}"
}
const writeJsToLocal = function (filePath, plistFileName) {
    fs.readFile(filePath, 'utf-8', function (err, result) {
        parseString(result, (err, data) => {
            let dict = data.plist.dict[0].dict[0];
            let contentStr = "";
            for (let i = 0; i < dict.key.length; i++) {
                let posInfo = getPosJson(dict.key[i], dict.dict[i]);
                contentStr += '  ' + posInfo + ',\n';
            }
           
            let endStr = "{\n" + contentStr.substring(0, contentStr.length - 2) + " \n}"
            fs.writeFile(plistPath + '/' + plistFileName + '.json', endStr, () => {
            })
        })
    });
}
for (let i = 0; i < plistList.length; i++) {
    let plist = plistList[i];
    let plistFileName = plist.substring(0, plist.length - 6);
    writeJsToLocal(plistPath + plist, plistFileName);
}



