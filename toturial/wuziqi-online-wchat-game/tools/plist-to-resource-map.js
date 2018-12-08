if (process.argv.length < 3) {
    return
}
let gamePath = process.argv[2];
let plistPath = gamePath + '/images/';
const fs = require('fs');
var parseString = require('xml2js').parseString;
//toJson第二个参数options如下：
var options = {
    object: false,
    reversible: false,
    coerce: false,
    sanitize: true,
    trim: true,
    arrayNotation: false,
    alternateTextNode: false
};

const files = fs.readdirSync(plistPath);
let plistList = [];
files.forEach((v, k) => {
    if (v.indexOf('.plist') !== -1) {
        plistList.push(v);
    }
})

const writeJsToLocal = function (filePath, plistFileName) {
    fs.readFile(filePath, 'utf-8', function (err, result) {
        parseString(result, (err, data) => {
            let dict = data.plist.dict;
            let contentStr = "";
            for (let i = 0; i < dict.length; i++) {
                let frame = dict[i];
                let nameKeys = frame.dict[0].key;
                for (let j = 0; j < nameKeys.length; j++) {
                    let str = nameKeys[j];
                    if (str.indexOf('.png') !== -1) {
                        let name = str.substring(0, str.length - 4);
                        // obj[name] = str;
                        contentStr =   contentStr + '    ' + name + ': ' + '"' + str + '"' + ',' + '\n';
                    }
                }
            }
            let endStr = "const resourceMap = {\n" + contentStr.substring(0, contentStr.length - 2) + " \n}" + "\nexport default resourceMap;"
            fs.writeFile(gamePath + '/' + plistFileName + '-source-map' + '.js', endStr, () => {
                console.log('写入成功');
            })
        })
    });
}
for (let i = 0; i < plistList.length; i++) {
    let plist = plistList[i];
    let plistFileName = plist.substring(0, plist.length - 6);
    writeJsToLocal(plistPath + plist, plistFileName);
}



